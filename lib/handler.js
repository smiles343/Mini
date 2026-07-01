const path = require('path');
const pino = require('pino');
const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const { handleMessage } = require('./plugins'); // plugin dispatcher
const { saveCreds } = require('./serialize');

async function startBot({ onPairingCode, onPaired, logger = pino() } = {}) {
  const sessionDir = path.resolve(__dirname, '..', 'session');

  // multi-file auth state: will create files under ./session
  const { state, saveCreds: _saveCreds } = await useMultiFileAuthState(sessionDir);

  // fetch baileys version for compatibility
  const { version } = await fetchLatestBaileysVersion().catch(() => ({ version: [2, 2204, 5] }));

  // Make socket
  const sock = makeWASocket({
    version,
    auth: { ...state, // in some Baileys versions to enable pairing you don't need to change this.
      // note: if your version expects a special pairing flag, adjust here per Baileys docs
    },
    printQRInTerminal: false,
    logger
  });

  // persist credentials on update
  sock.ev.on('creds.update', async () => {
    try { await _saveCreds(); } catch (e) { logger.warn('saveCreds failed', e); }
  });

  // Listen for pairing code event (Baileys emits pairing info on creds.pairingCode or similar)
  sock.ev.on('creds.pairingCode', (pairing) => {
    // pairing is usually an object: { code: '12345678', display: '...' }
    const code = pairing?.code || pairing;
    const display = pairing?.display || JSON.stringify(pairing);
    if (onPairingCode) onPairingCode(code, display);
    logger.info({ pairing: code }, 'Received pairing code');
  });

  // fallback: some Baileys versions emit 'connection.update' with pairing info
  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;
    logger.info({ update }, 'connection.update');
    if (connection === 'open') {
      logger.info('Connection opened — paired');
      if (onPaired) onPaired();
    }
    if (connection === 'close') {
      logger.warn({ lastDisconnect }, 'connection closed');
    }
    // if update contains a pairing code text (older/newer versions)
    if (update?.pairing) {
      const { code, display } = update.pairing || {};
      if (onPairingCode) onPairingCode(code || display, display || code);
    }
  });

  // messages
  sock.ev.on('messages.upsert', async (m) => {
    try {
      if (!m.messages) return;
      for (const msg of m.messages) {
        // ignore status broadcasts or system
        if (!msg.message || msg.key && msg.key.remoteJid === 'status@broadcast') continue;
        await handleMessage(sock, msg);
      }
    } catch (e) {
      logger.error('messages.upsert handler error', e);
    }
  });

  return sock;
}

module.exports = { startBot };

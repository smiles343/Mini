const express = require('express');
const pino = require('pino');
const { PORT } = require('./config');
const { startBot } = require('./lib/handler');

const logger = pino({ level: process.env.DEBUG ? 'debug' : 'info' });

const app = express();

let pairingInfo = {
  code: null,
  display: null,
  status: 'idle'
};

app.get('/', (req, res) => {
  res.send(`<h2>LYNX MD</h2><p><a href="/pairing">Pairing page</a></p>`);
});

app.get('/pairing', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  if (pairingInfo.status === 'paired') {
    res.send(`<h3>Paired ✅</h3><p>Your bot is connected.</p>`);
  } else if (pairingInfo.code) {
    res.send(`<h3>Pairing code</h3><p>Enter this code in WhatsApp -> Linked devices -> Link a device</p><h2>${pairingInfo.code}</h2><pre>${pairingInfo.display || ''}</pre>`);
  } else {
    res.send(`<h3>No pairing code yet</h3><p>Start the bot (check logs/console) and the code will appear here.</p>`);
  }
});

const server = app.listen(PORT || 3000, async () => {
  logger.info(`HTTP server running on port ${PORT || 3000}`);
  // Start bot and pass updater for pairing info
  await startBot({
    onPairingCode: (code, display) => {
      pairingInfo.code = code;
      pairingInfo.display = display;
      pairingInfo.status = 'waiting';
      logger.info({ pairingCode: code }, 'Pairing code ready');
    },
    onPaired: () => {
      pairingInfo.status = 'paired';
      pairingInfo.code = null;
      pairingInfo.display = null;
      logger.info('Bot paired successfully');
    },
    logger
  });
});

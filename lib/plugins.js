const { simpleHandler } = require('./utils');
const smileCmd = require('../commands/smile');

const plugins = [
  smileCmd
];

async function handleMessage(sock, msg) {
  try {
    // normalize and extract text
    const from = msg.key.remoteJid;
    const isGroup = from && from.endsWith('@g.us');
    const pushName = (msg.pushName || msg.name || 'User');
    let body = '';

    // message text parsing (supports different message types)
    const m = msg.message;
    if (!m) return;
    if (m.conversation) body = m.conversation;
    else if (m.extendedTextMessage && m.extendedTextMessage.text) body = m.extendedTextMessage.text;
    else if (m.imageMessage && m.imageMessage.caption) body = m.imageMessage.caption;
    else if (m.videoMessage && m.videoMessage.caption) body = m.videoMessage.caption;

    if (!body) return;

    // treat the first token as command if starting with prefix '!'
    const prefix = '!';
    if (!body.startsWith(prefix)) return; // ignore non-commands
    const args = body.slice(prefix.length).trim().split(/\s+/);
    const cmdName = args.shift().toLowerCase();

    // find plugin (case-insensitive)
    const plugin = plugins.find(p => (p.name && p.name.toLowerCase() === cmdName) || (p.aliases && p.aliases.map(a => a.toLowerCase()).includes(cmdName)));
    if (!plugin) {
      // unknown command
      await simpleHandler(sock, from, `Unknown command: ${cmdName}\nType !help`);
      return;
    }

    // run plugin
    await plugin.run({ sock, msg, args, from, pushName, isGroup });
  } catch (e) {
    console.error('plugin handler error', e);
  }
}

module.exports = { handleMessage };

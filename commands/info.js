const { BOT_NAME } = require('../config');

module.exports = {
  name: 'info',
  aliases: ['about'],
  description: 'Show bot information',
  run: async ({ sock, from }) => {
    try {
      const body = `Bot: ${BOT_NAME}\nFramework: Baileys\nMode: Multi-device (pairing code)`;
      await sock.sendMessage(from, { text: body });
    } catch (e) {
      console.error('info command failed', e);
    }
  }
};
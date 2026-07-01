const { OWNER } = require('../config');

module.exports = {
  name: 'restart',
  aliases: ['reboot'],
  description: 'Restart the bot (owner only)',
  run: async ({ sock, from }) => {
    try {
      if (!OWNER) {
        await sock.sendMessage(from, { text: 'Owner not configured on the bot.' });
        return;
      }
      if (from !== OWNER) {
        await sock.sendMessage(from, { text: 'You are not authorized to restart this bot.' });
        return;
      }
      await sock.sendMessage(from, { text: 'Restarting bot now...' });
      setTimeout(() => process.exit(0), 1500);
    } catch (e) {
      console.error('restart command failed', e);
    }
  }
};
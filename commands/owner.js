const { OWNER } = require('../config');

module.exports = {
  name: 'owner',
  aliases: ['admin'],
  description: 'Show the configured owner contact',
  run: async ({ sock, from }) => {
    try {
      if (!OWNER) return await sock.sendMessage(from, { text: 'Owner is not set.' });
      await sock.sendMessage(from, { text: `Owner: ${OWNER}` });
    } catch (e) {
      console.error('owner command failed', e);
    }
  }
};
module.exports = {
  name: 'alive',
  aliases: ['status'],
  description: 'Check if bot is alive',
  run: async ({ sock, from }) => {
    try {
      await sock.sendMessage(from, { text: '✅ I am alive and running.' });
    } catch (e) {
      console.error('alive command failed', e);
    }
  }
};
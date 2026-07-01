module.exports = {
  name: 'ping',
  aliases: [],
  description: 'Reply with pong and latency',
  run: async ({ sock, from, msg }) => {
    try {
      const start = Date.now();
      await sock.sendMessage(from, { text: 'Pinging...' });
      const latency = Date.now() - start;
      await sock.sendMessage(from, { text: `Pong! Latency: ${latency} ms` });
    } catch (e) {
      console.error('ping command failed', e);
    }
  }
};
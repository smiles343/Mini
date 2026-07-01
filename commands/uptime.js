function formatUptime(seconds) {
  const d = Math.floor(seconds / (3600*24));
  const h = Math.floor(seconds % (3600*24) / 3600);
  const m = Math.floor(seconds % 3600 / 60);
  const s = Math.floor(seconds % 60);
  return `${d}d ${h}h ${m}m ${s}s`;
}

module.exports = {
  name: 'uptime',
  aliases: [],
  description: 'Show how long the process has been running',
  run: async ({ sock, from }) => {
    try {
      const up = process.uptime();
      await sock.sendMessage(from, { text: `Uptime: ${formatUptime(up)}` });
    } catch (e) {
      console.error('uptime command failed', e);
    }
  }
};
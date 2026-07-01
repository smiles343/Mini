module.exports = {
  name: 'stats',
  aliases: ['stat'],
  description: 'Show memory and uptime stats',
  run: async ({ sock, from }) => {
    try {
      const mem = process.memoryUsage();
      const rss = Math.round(mem.rss / 1024 / 1024);
      const heapTotal = Math.round(mem.heapTotal / 1024 / 1024);
      const heapUsed = Math.round(mem.heapUsed / 1024 / 1024);
      const uptime = Math.floor(process.uptime());
      const body = `*Stats*\nRSS: ${rss} MB\nHeap: ${heapUsed}/${heapTotal} MB\nUptime: ${uptime} s`;
      await sock.sendMessage(from, { text: body });
    } catch (e) {
      console.error('stats command failed', e);
    }
  }
};
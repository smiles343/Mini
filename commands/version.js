const pkg = require('../package.json');

module.exports = {
  name: 'version',
  aliases: ['v'],
  description: 'Show bot and Node.js version',
  run: async ({ sock, from }) => {
    try {
      const body = `Bot version: ${pkg.version}\nNode: ${process.version}`;
      await sock.sendMessage(from, { text: body });
    } catch (e) {
      console.error('version command failed', e);
    }
  }
};
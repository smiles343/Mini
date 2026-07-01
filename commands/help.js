const pkg = require('../package.json');
const commands = [
  { cmd: 'ping', desc: 'Reply with pong and latency' },
  { cmd: 'alive', desc: 'Check if bot is alive' },
  { cmd: 'smile', desc: 'Return a smile' },
  { cmd: 'stats', desc: 'Show process stats (memory, uptime)' },
  { cmd: 'info', desc: 'Bot information' },
  { cmd: 'uptime', desc: 'Show process uptime' },
  { cmd: 'restart', desc: 'Restart the bot (owner only)' },
  { cmd: 'echo', desc: 'Echo back your text' },
  { cmd: 'owner', desc: 'Show bot owner contact' },
  { cmd: 'version', desc: 'Show bot version and Node version' }
];

module.exports = {
  name: 'help',
  aliases: ['commands', 'h'],
  description: 'List available commands',
  run: async ({ sock, from }) => {
    try {
      let body = `*LYNX MD — Commands*\nVersion: ${pkg.version}\n\n`;
      for (const c of commands) body += `• !${c.cmd} — ${c.desc}\n`;
      await sock.sendMessage(from, { text: body });
    } catch (e) {
      console.error('help command failed', e);
    }
  }
};
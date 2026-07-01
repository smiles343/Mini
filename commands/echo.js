module.exports = {
  name: 'echo',
  aliases: ['say'],
  description: 'Echo back the provided text',
  run: async ({ sock, from, args }) => {
    try {
      const text = args && args.length ? args.join(' ') : '(no text)';
      await sock.sendMessage(from, { text });
    } catch (e) {
      console.error('echo command failed', e);
    }
  }
};
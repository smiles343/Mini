module.exports = {
  name: 'smile',
  aliases: ['smiley'],
  description: 'Return a smile',
  run: async ({ sock, from, args }) => {
    const text = `😊 Hello! You sent: ${args.join(' ') || '(no args)'}`;
    try {
      await sock.sendMessage(from, { text });
    } catch (e) {
      console.error('smile command failed', e);
    }
  }
};

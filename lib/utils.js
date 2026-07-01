async function simpleHandler(sock, to, text) {
  try {
    await sock.sendMessage(to, { text });
  } catch (e) {
    console.error('sendMessage failed', e);
  }
}

module.exports = { simpleHandler };

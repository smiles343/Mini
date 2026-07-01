# LYNX MD — mini WhatsApp multi-device bot (pairing code)

Overview
- Node.js WhatsApp bot built with Baileys (multi-device).
- Uses the 8-digit pairing code method so you enter the code on your phone (WhatsApp → Settings → Linked devices → Link a device) instead of scanning a QR.

Setup
1. Install:
   npm install

2. Copy environment:
   cp .env.example .env
   edit .env to fill values if desired.

3. Start:
   npm start

Pairing
- Start the bot: node index.js
- Open http://localhost:3000/pairing to see the current pairing code (or watch console if you prefer).
- On your phone: WhatsApp → Settings → Linked devices → Link a device → enter the 8-digit code shown.
- The server will print "Paired successfully" when done and session files will be saved under /session.

Deployment
- Use PM2 or Docker. Example PM2:
  pm2 start index.js --name lynx-md

Security
- Do NOT commit anything inside /session (auth files). Keep them private.

Notes
- If Baileys event names or shape differ with your installed version, consult the Baileys README and adjust index.js accordingly. The pairing-mode events used here are available on Baileys v7+ in pairing mode.

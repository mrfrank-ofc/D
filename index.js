const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  jidNormalizedUser,
  isJidBroadcast,
  getContentType,
  proto,
  generateWAMessageContent,
  generateWAMessage,
  AnyMessageContent,
  prepareWAMessageMedia,
  areJidsSameUser,
  downloadContentFromMessage,
  MessageRetryMap,
  generateForwardMessageContent,
  generateWAMessageFromContent,
  generateMessageID, makeInMemoryStore,
  jidDecode,
  fetchLatestBaileysVersion,
  Browsers
} = require('@whiskeysockets/baileys');

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const port = process.env.PORT || 9090;

// Function to download and set up the bot
const setupBot = async () => {
  console.log('🚀 Downloading bot files from GitHub...');

  // Clone the repository
  exec('git clone https://github.com/mrfrank-ofc/SUBZERO-BOT.git', (err, stdout, stderr) => {
    if (err) {
      console.error('❌ Failed to clone repository:', err);
      return;
    }

    console.log('✅ Repository cloned successfully.');

    // Navigate to the bot directory
    process.chdir('SUBZERO-BOT');

    // Install dependencies
    console.log('📦 Installing dependencies...');
    exec('npm install', (err, stdout, stderr) => {
      if (err) {
        console.error('❌ Failed to install dependencies:', err);
        return;
      }

      console.log('✅ Dependencies installed successfully.');

      // Start the bot
      console.log('🤖 Starting the bot...');
      exec('node index.js', (err, stdout, stderr) => {
        if (err) {
          console.error('❌ Failed to start the bot:', err);
          return;
        }

        console.log('✅ Bot started successfully.');
      });
    });
  });
};

// Start the setup process
setupBot();

// Serve static files
app.use(express.static(path.join(__dirname, 'lib')));

app.get('/', (req, res) => {
  res.redirect('/subzero.html');
});

app.listen(port, () => console.log(`Server listening on port http://localhost:${port}`));

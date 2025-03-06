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

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const { exec } = require('child_process');
const express = require('express');
const app = express();
const port = process.env.PORT || 9090;

// Function to download and set up the bot
const setupBot = async () => {
  console.log('🚀 Downloading bot files from GitHub...');

  const repoUrl = 'https://github.com/mrfrank-ofc/SUBZERO-BOT/archive/refs/heads/main.zip';
  const zipPath = path.join(__dirname, 'SUBZERO-BOT.zip');
  const extractPath = path.join(__dirname, 'SUBZERO-BOT');

  try {
    // Download the repository as a ZIP file
    const response = await axios({
      method: 'get',
      url: repoUrl,
      responseType: 'stream',
    });

    const writer = fs.createWriteStream(zipPath);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    console.log('✅ Repository downloaded successfully.');

    // Extract the ZIP file
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(extractPath, true);
    console.log('✅ Repository extracted successfully.');

    // Navigate to the bot directory
    const botDir = path.join(extractPath, 'SUBZERO-BOT-main');
    process.chdir(botDir);

    // Install dependencies
    console.log('📦 Installing dependencies...');
    exec('npm install --production', (err, stdout, stderr) => {
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
  } catch (err) {
    console.error('❌ Error during setup:', err);
  }
};

// Start the setup process
setupBot();

// Serve static files
app.use(express.static(path.join(__dirname, 'lib')));

app.get('/', (req, res) => {
  res.redirect('/subzero.html');
});

app.listen(port, () => console.log(`Server listening on port http://localhost:${port}`));

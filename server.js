const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');
const https = require('https');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Custom Imports
const Config = require('./config.js');
const TelegramExtension = require('./telegram_extension.js');
let tele = new TelegramExtension();

app.post('/ias_bot', (req, res) => {
  console.log('received');
  const message = req.body.message; // replace .message with .channel_post or .edited_message or .edited_channel_post where required
  const callback = req.body.callback_query;
  if (message) {
    tele.processTeleMsg(message);
  } else if (callback) {
    tele.processTeleCallback(callback);
  }
  return res.end();
});

const httpsServer = https.createServer(
  {
    key: fs.readFileSync('./.data/YOURPRIVATE.key'),
    cert: fs.readFileSync('./.data/YOURPUBLIC.pem'),
  },
  app,
);

var listener = httpsServer.listen(Config.getPort(), () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});

/**
  // listen for requests :)
var listener = app.listen(Config.getPort(), () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});
*/

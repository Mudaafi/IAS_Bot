// This js file is an extension to the multi-purpose telegram_interface js file
// meant for this bot in particular
const tele = require('./telegram-interface.js');

class TelegramExtension {
  constructor(botKey) {
    // idk what to use
    this.CALLBACK_DELIMETER = '<>';
    this.BOT_KEY = botKey;
  }

  async processTeleCallback(callback) {
    const username = callback.from.username;
    const firstName = callback.from.first_name;
    var msgText = callback.message.text;
    var msgMarkup = callback.message.reply_markup;
    const data = callback.data.split(this.tele.CALLBACK_DELIMETER);
  }

  async processTeleMsg(message) {
    var id = message.from.id;
    var chatId = message.chat.id;
    var formatting = message.entities;
    if (chatId != id) return; // From a group, ignore
    // malice removal
    var textMsg = message.text;
    if (!textMsg) textMsg = 'empty';
    textMsg = tele.cleanseString(textMsg);
    textMsg = textMsg.replace(/\"/g, "'");
    // Polls not supported
    if (formatting) {
      textMsg = tele.convertToHTML(textMsg, formatting);
    }
    // -- Commands
    // Start/registration
    if (this.identifyCommand('/start', textMsg)) {
      await tele.sendMessage(
        id,
        'No functionality available',
        {},
        this.BOT_KEY,
      );
    } else if (this.identifyCommand('/wut', textMsg)) {
      await tele.sendMessage(id, 'Wut', {}, this.BOT_KEY);
    } else {
      await tele.sendMessage(id, message, {}, this.BOT_KEY);
    }
  }

  identifyCommand(command, textMsg) {
    return textMsg.indexOf(command) >= 0;
  }

  // Wrapper for telegram_interface.js sendMessage()
  async sendMsg(id, msg) {
    await tele.sendMessage(id, msg, {}, this.BOT_KEY);
  }
}

module.exports = TelegramExtension;

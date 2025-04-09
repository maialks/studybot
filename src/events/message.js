const { Events } = require('discord.js');

const messageHandler = {
  name: Events.MessageCreate,
  execute(message) {
    if (message.author.bot || !message.content) return;
    const dateStr = new Date(message.createdTimestamp).toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
    });
    console.log(
      `${message.author.globalName} [${dateStr}]: ${message.content}`
    );
  },
};

module.exports = messageHandler;

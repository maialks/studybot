const { Events, ActivityType } = require('discord.js');

const ClientReady = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log(`✅ ${client.user.tag} online!`);
    client.user.setActivity('Discord.js Guide', {
      type: ActivityType.Watching,
    });
  },
};

const MessageHandler = {
  name: Events.MessageCreate,
  execute(message) {
    if (message.author.bot || !message.content) return;

    const date = new Date(message.createdTimestamp);
    console.log(
      `${message.author.globalName} [${date.toLocaleString()}]: ${
        message.content
      }`
    );

    if (message.author.globalName === 'Carolina Oliveira') {
      message.reply('chata');
    }
  },
};

const voiceStateHadnler = {
  name: Events.VoiceStateUpdate,
  execute(oldState, newState) {
    if (!oldState.channelId) {
      newState.voiceJoinedTimestamp = Date.now();
    } else {
      const channel = 1350465997001195520;
      console.log(
        `Ficou por ${oldState.voiceJoinedTimestamp - Date.now() / 1000}s`
      );
    }
  },
};

// const voiceChannelJoin = {
//   name: Events.VoiceStateUpdate,
// };

module.exports = {
  ClientReady,
  MessageHandler,
  voiceStateHadnler,
};

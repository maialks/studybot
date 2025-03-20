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
    } else if (
      !newState.channelId ||
      newState.channelId !== oldState.channelId
    ) {
      const user = newState.member.user;
      const channel = newState.guild.channels.cache.get('1350465997001195520');
      console.log('Old ------');
      console.log(oldState);
      console.log('New ------');
      console.log(newState);
      console.log(
        `Parabéns ${user.globalName}, você estudou por ${Math.ceil(
          (Date.now() - oldState.voiceJoinedTimestamp) / 1000 / 60
        )}min`
      );
      // channel.send(
      //   `Parabéns ${user.globalName}, você estudou por ${
      //    Math.ceil(((Date.now() - oldState.voiceJoinedTimestamp) / 1000) / 60)
      //  }min`
      // );
    }
  },
};

module.exports = {
  ClientReady,
  MessageHandler,
  voiceStateHadnler,
};

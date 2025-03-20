const { Events, ActivityType } = require('discord.js');
const { formatTime } = require('../utils/formmaters');

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
    const user = newState.member.user;
    newState.studyChannels = ['1350284781128122451', '1352418837819162634'];
    if (!oldState.channelId) {
      console.log(`${user.globalName} joined a channel`);
      newState.voiceJoinedTimestamp = Date.now();
    } else if (
      (!newState.channelId &&
        oldState.studyChannels.includes(oldState.channelId)) ||
      (newState.channelId &&
        !newState.studyChannels.includes(newState.channelId))
    ) {
      const { hrs, min } = formatTime(
        Date.now() - oldState.voiceJoinedTimestamp
      );
      if (!min) return console.log('Estudou nada ai');
      const channel = newState.guild.channels.cache.get('1350465997001195520');
      channel.send(
        `Parabéns <@${user.id}>, você estudou por ${
          hrs ? `${hrs}h e ${min}min` : `${min}min`
        }`
      );
    }
  },
};

module.exports = {
  ClientReady,
  MessageHandler,
  voiceStateHadnler,
};

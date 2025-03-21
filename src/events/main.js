const { Events, ActivityType } = require('discord.js');
const { formatTime } = require('../utils/formmaters');

const studyChannels = new Set(['1350284781128122451', '1352418837819162634']);
const voiceJoinTimes = new Map();
const REPORT_CHANNEL_ID = '1350465997001195520';

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
    const user = newState.member?.user;

    const wasStudying = studyChannels.has(oldState.channelId);
    const nowStudying = studyChannels.has(newState.channelId);

    if (nowStudying && !wasStudying) {
      console.log(`${user.globalName} joined a study channel`);
      voiceJoinTimes.set(user.id, Date.now());
    }
    if (wasStudying && !nowStudying) {
      const joinTime = voiceJoinTimes.get(user.id);
      const { hrs, min } = formatTime(Date.now() - joinTime);
      if (!min) return console.log('Estudou nada ai');
      const channel = newState.guild.channels.cache.get(REPORT_CHANNEL_ID);
      channel.send(
        `Parabéns <@${user.id}>, você estudou por ${
          hrs ? `${hrs}h e ${min}min` : `${min}min`
        }`
      );
      console.log(`${user.globalName} stopped studying`);
    }
  },
};

module.exports = {
  ClientReady,
  MessageHandler,
  voiceStateHadnler,
};

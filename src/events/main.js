const { Events, ActivityType, EmbedBuilder } = require('discord.js');
const { formatMS, getHHMM } = require('../utils/formmaters');

const studyChannels = new Set(['1350284781128122451', '1352418837819162634']);
const REPORT_CHANNEL_ID = '1350465997001195520';
const userData = {};

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

    userData[user.id] ||= { avatarURL: user.displayAvatarURL() };

    const wasStudying = studyChannels.has(oldState.channelId);
    const nowStudying = studyChannels.has(newState.channelId);

    if (nowStudying && !wasStudying) {
      console.log(`${user.globalName} joined a study channel`);
      userData[user.id].join = Date.now();
      console.log(userData);
    }
    if (wasStudying && !nowStudying) {
      userData[user.id].exit = Date.now();
      const userInfo = userData[user.id];
      const { hrs, min } = formatMS(userInfo.exit - userInfo.join);
      if (!min) return console.log('Estudou nada ai');
      const channel = newState.guild.channels.cache.get(REPORT_CHANNEL_ID);
      const msg = new EmbedBuilder()
        .setAuthor({ name: `${user.username}`, iconURL: userInfo.avatarURL })
        .setDescription(`<@${user.id}>`)
        .setColor('f54336')
        .addFields(
          {
            name: `Parabens ! Você estudou por ${
              hrs ? `${hrs}h e ${min}min` : `${min}min`
            }`,
            value: '\u200B',
          },
          { name: 'De:', value: getHHMM(userInfo.join), inline: true },
          { name: 'Até:', value: getHHMM(userInfo.exit), inline: true }
        )
        .setFooter({
          text: `|      Voe alto, seja leve`,
          iconURL: 'https://i.imgur.com/bwkB5DN.png',
        });
      channel.send({ embeds: [msg] });
      console.log(`${user.globalName} stopped studying`);
    }
  },
};

module.exports = {
  ClientReady,
  MessageHandler,
  voiceStateHadnler,
};

const { Events, ActivityType, EmbedBuilder } = require('discord.js');
const { msToHMS, getHHMM, getDDMMYY } = require('../utils/formmaters');

const studyChannels = new Set(['1350284781128122451', '1352418837819162634']);
const REPORT_CHANNEL_ID = '1353055889023828020';
const usersData = {};

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
  },
};

const voiceStateHandler = {
  name: Events.VoiceStateUpdate,
  execute: async (oldState, newState) => {
    const _user = newState.member?.user;
    if (!_user || _user.bot) return;

    const curTimestamp = Date.now();
    const dateStr = new Date(curTimestamp).toLocaleString();
    const user = (usersData[_user.id] ||= {
      studySessions: {},
      lastSessionStarted: getDDMMYY(curTimestamp),
    });

    const wasStudying = studyChannels.has(oldState.channelId);
    const nowStudying = studyChannels.has(newState.channelId);

    if (nowStudying && !wasStudying) {
      startStudySession(user, curTimestamp);
      console.log(
        `[${dateStr}]: ${_user.globalName} joined a study channel \n ${user.studySessions}`
      );
    }

    if (wasStudying && !nowStudying) {
      endStudySession(user, curTimestamp, newState, _user);
    }
  },
};

function startStudySession(user, timestamp) {
  const currentDate = getDDMMYY(timestamp);
  user.lastSessionStarted = currentDate;

  user.studySessions[user.lastSessionStarted] ||= [];
  user.studySessions[user.lastSessionStarted].push([timestamp]);
}

function endStudySession(user, timestamp, newState, _user) {
  const lastSession = user.studySessions[user.lastSessionStarted];
  if (!lastSession?.length) return;

  const dateStr = new Date(timestamp).toLocaleString();
  lastSession[lastSession.length - 1].push(timestamp);

  console.log(
    `[${dateStr}]: ${_user.globalName} stopped studying \n`,
    lastSession
  );

  const [start, end] = lastSession[lastSession.length - 1];
  const curDuration = msToHMS(end - start);
  if (curDuration.min < 1)
    return console.log('(sessão inferior a 1min, não contabilizada)');

  const dayDuration = msToHMS(
    lastSession.reduce((acc, [s, e]) => acc + (e - s), 0)
  );

  const channel = newState.guild.channels.cache.get(REPORT_CHANNEL_ID);
  const embed = new EmbedBuilder()
    .setAuthor({ name: _user.username, iconURL: _user.displayAvatarURL() })
    .setDescription(`<@${_user.id}>`)
    .setColor('#f54336')
    .addFields(
      {
        name: `Parabéns! Você estudou por ${
          curDuration.hrs ? `${curDuration.hrs}h e ` : ''
        }${curDuration.min}min`,
        value: '\u200B',
      },
      { name: 'De:', value: getHHMM(start), inline: true },
      { name: 'Até:', value: getHHMM(end), inline: true }
    )
    .setFooter({
      text: `Total de ${
        user.lastSessionStarted === getDDMMYY(timestamp)
          ? 'Hoje:'
          : `${user.lastSessionStarted} (Início da Sessão):`
      } ${dayDuration.hrs ? `${dayDuration.hrs}h e ` : ''}${
        dayDuration.min
      }min`,
      iconURL: 'https://i.imgur.com/bwkB5DN.png',
    });

  channel.send({ embeds: [embed] });
}

module.exports = {
  ClientReady,
  MessageHandler,
  voiceStateHandler,
};

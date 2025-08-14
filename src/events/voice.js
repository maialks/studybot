// const { Events, EmbedBuilder } = require('discord.js')
// const Server = require('../models/server')

// const voiceStateHandler = {
//   name: Events.VoiceStateUpdate,
//   execute: async (oldState, newState) => {
//     const server = await Server.findOne({ serverId: newState.guild.id })
//     const user = newState.member?.user
//     if (!user || user.bot) return
//     if (!server.userSessions[user.id]) {
//       server.userSessions[user.id] = {}
//       server.markModified('userSessions')
//       await server.save()
//     }

//     const wasStudying = server.studyChannels.includes(oldState.channelId)
//     const nowStudying = server.studyChannels.includes(newState.channelId)

//     const now = Date.now()
//     const dateTimeStr = new Date(now).toLocaleString('en-US', {
//       timeZone: 'America/Sao_Paulo',
//     })
//     if (nowStudying && !wasStudying) {
//       startStudySession(server, user.id)
//       return console.log(
//         `[${dateTimeStr}] ${user.globalName} joined a study channel`
//       )
//     }

//     if (wasStudying && !nowStudying) {
//       endStudySession(server, user.id, newState)
//       return console.log(
//         `[${dateTimeStr}] ${user.globalName} left a study channel`
//       )
//     }
//   },
// }

// async function safeSend(channel, message, retries = 3, delay = 2000) {
//   for (let attempt = 1; attempt <= retries; attempt++) {
//     try {
//       return await channel.send(message)
//     } catch (err) {
//       console.error(
//         `Tentativa ${attempt} falhou ao enviar mensagem:`,
//         err.code || err.message
//       )
//       if (attempt < retries) {
//         await new Promise((res) => setTimeout(res, delay))
//       } else {
//         throw err
//       }
//     }
//   }
// }

// async function startStudySession(server, userId) {
//   const curTimestamp = Date.now()
//   const date = new Date()
//   const dateStr = date.toLocaleDateString('en-US', {
//     timeZone: server.timezone,
//   })

//   const usrSessions = server?.userSessions?.[userId]
//   usrSessions.lastSessionStarted = curTimestamp
//   usrSessions[dateStr] ||= []
//   usrSessions[dateStr].push(curTimestamp)
//   server.markModified('userSessions')
//   await server.save()
//   return
// }

// async function endStudySession(server, userId, newState) {
//   const curTimestamp = Date.now()
//   const date = new Date()
//   const dateStr = date.toLocaleDateString('en-US', {
//     timeZone: server.timezone,
//   })

//   const usrSessions = server?.userSessions?.[userId]
//   const durationMS = curTimestamp - usrSessions.lastSessionStarted
//   console.log(durationMS)
//   if (durationMS < 120000) {
//     console.log('tempo nao registrado, inferior a 2min')
//     usrSessions[dateStr].pop()
//     server.markModified('userSessions')
//     await server.save()
//     return
//   }
//   const lastSessionDate = new Date(
//     usrSessions.lastSessionStarted
//   ).toLocaleDateString('en-US', {
//     timeZone: server.timezone,
//   })
//   usrSessions[dateStr].push(curTimestamp)
//   server.markModified('userSessions')
//   await server.save()

//   const channel = await newState.guild.channels.fetch(server.reportChannel)
//   const member = await newState.guild.members.fetch(userId)

//   function getHHMM(timestamp) {
//     const date = new Date(timestamp)
//     const timeStr = date.toLocaleString('pt-BR', {
//       timeZone: server.timezone,
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: false,
//     })
//     return timeStr
//   }

//   const [join, exit] = usrSessions[dateStr].slice(-2)
//   const sessionDuration = exit - join
//   const curDuration = {
//     hrs: Math.floor(sessionDuration / 3600000),
//     min: Math.floor((sessionDuration % 3600000) / 60000),
//   }

//   const sessions = usrSessions[dateStr]
//   let total = 0
//   for (let i = 0; i < sessions.length; i += 2) {
//     if (sessions[i + 1]) total += sessions[i + 1] - sessions[i]
//   }
//   const dayDuration = {
//     hrs: Math.floor(total / 3600000),
//     min: Math.floor((total % 3600000) / 60000),
//   }

//   const embed = new EmbedBuilder()
//     .setAuthor({
//       name: member.user.username,
//       iconURL: member.displayAvatarURL(),
//     })
//     .setDescription(`<@${member.id}>`)
//     .setColor('#f54336')
//     .addFields(
//       {
//         name: `Parabéns! Você estudou por ${
//           curDuration.hrs
//             ? `${curDuration.hrs}h e ${curDuration.min}min`
//             : `${curDuration.min}min`
//         }`,
//         value: '\u200B',
//       },
//       { name: 'De:', value: getHHMM(join), inline: true },
//       { name: 'Até:', value: getHHMM(exit), inline: true }
//     )
//     .setFooter({
//       text: `Total ${
//         lastSessionDate === dateStr
//           ? 'de Hoje:'
//           : `${lastSessionDate} (início da sessão):`
//       } ${
//         dayDuration.hrs
//           ? `${dayDuration.hrs}h e ${dayDuration.min}min`
//           : `${dayDuration.min}min`
//       } `,
//       iconURL: 'https://i.imgur.com/bwkB5DN.png',
//     })
//   await safeSend(channel, { embeds: [embed] })
//   return
// }

// module.exports = voiceStateHandler

import logger from '../utils/logger';
import serverService from '../services/serverService';
import userService from '../services/userService';
import { Events } from 'discord.js';
import type { VoiceState } from 'discord.js';
import studySessionService from '../services/studySessionService';
import buildEmbed from '../builders/endSessionEmbed';

const voiceStateHandler = {
  name: Events.VoiceStateUpdate,
  execute: async (oldState: VoiceState, newState: VoiceState) => {
    if (oldState.channelId === newState.channelId) return;
    let server;
    try {
      server = await serverService.findServer(newState.guild.id);
    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'server not found')
        server = await serverService.createServer(newState.guild.id);
      logger.error(error);
    }
    if (!server) return;

    const member = newState.member?.user;
    const wasStudying = server.studyChannels.includes(
      oldState.channelId || 'NO_CHANNELID'
    );
    const nowStudying = server.studyChannels.includes(
      newState.channelId || 'NO_CHANNELID'
    );
    if ((!wasStudying && !nowStudying) || !member || member.bot) return;

    let user;
    try {
      user = await userService.findUser(member.id);
    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'user not found')
        user = await userService.createUser(member.id);
      logger.error(error);
    }
    if (!user) return;

    if (!wasStudying && nowStudying)
      studySessionService.startStudySession(user._id);

    if (wasStudying && !nowStudying) {
      const closedSession = await studySessionService.endStudySession(user._id);
      const channel = await newState.guild.channels.fetch(server.reportChannel);
      if (!channel || !channel.isTextBased()) return;
      channel.send({
        embeds: [buildEmbed(closedSession, server.timezone, member)],
      });
    }
  },
};

export default voiceStateHandler;

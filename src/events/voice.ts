import { Events, type VoiceState } from 'discord.js';
import { add } from 'date-fns';

import type { Types } from 'mongoose';

import buildEmbed from '../builders/endSessionEmbed';

import serverService from '../services/serverService';
import userService from '../services/userService';
import studySessionService from '../services/studySessionService';
import sessionService from '../services/sessionService';
import retryAsync from '../utils/general/retryAsync';
import logger from '../utils/general/logger';
import { format } from 'date-fns';
import { isJsonString } from '../utils/general/jsonValidator';

async function handleUserJoinedStudy(userId: Types.ObjectId) {
  await studySessionService.startStudySession(userId);
}

async function handleUserLeftStudy(
  userId: Types.ObjectId,
  reportChannelId: string,
  timezone: string,
  member: VoiceState['member'],
  serverId: string
) {
  const { minTime } = await serverService.findServer(serverId);
  const channel = await member?.guild.channels.fetch(reportChannelId);
  if (!channel || !channel.isTextBased() || !member?.user) return;
  try {
    const closedSession = await studySessionService.endStudySession(userId, minTime);
    const todaySessions = await sessionService.sessionsInInterval(
      userId,
      closedSession.date,
      add(closedSession.date, { days: 1 })
    );
    retryAsync(channel.send.bind(channel), 5, 1000, {
      embeds: [
        buildEmbed(
          closedSession,
          timezone,
          member?.user,
          todaySessions.reduce((acc, cur) => acc + cur.duration, 0)
        ),
      ],
    });
  } catch (error: unknown) {
    if (!(error instanceof Error)) return logger.error(error);
    if (isJsonString(error.message)) {
      const errorData = JSON.parse(error.message);
      if (errorData.type === 'bellow min length') {
        const date = new Date(0);
        channel.send(
          `<@${member.user.id}>, your study session was too short to be saved | ${format(
            date.setSeconds(errorData.duration),
            'mm:ss'
          )} is less than ${minTime / 60}min`
        );
      }
    } else {
      logger.error(error.message);
    }
  }
}

const voiceStateHandler = {
  name: Events.VoiceStateUpdate,
  execute: async (oldState: VoiceState, newState: VoiceState) => {
    if (oldState.channelId === newState.channelId) return;

    const server = await serverService.findOrCreateServer(newState.guild.id);
    if (!server) return;

    const member = newState.member?.user;
    const wasStudying = server.studyChannels.includes(oldState.channelId || '');
    const nowStudying = server.studyChannels.includes(newState.channelId || '');

    // early return se o usuário não é relevante
    if ((!wasStudying && !nowStudying) || !member || member.bot) return;

    const user = await userService.findOrCreateUser(member.id);
    if (!user) return;

    if (!wasStudying && nowStudying) {
      await handleUserJoinedStudy(user._id);
    }

    if (wasStudying && !nowStudying) {
      await handleUserLeftStudy(
        user._id,
        server.reportChannel,
        server.timezone,
        newState.member,
        newState.guild.id
      );
    }
  },
};

export default voiceStateHandler;

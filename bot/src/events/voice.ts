// External libraries and Discord.js
import { type Client, type VoiceState, type ClientUser, type Guild, Events } from 'discord.js';
import { add, format } from 'date-fns';
import type { Types } from 'mongoose';

// services
import serverService from '../services/serverService';
import userService from '../services/userService';
import studySessionService from '../services/studySessionService';
import sessionService from '../services/sessionService';

// utils and builders
import logger from '../utils/general/logger';
import { isJsonString } from '../utils/general/jsonValidator';
import { isMongoError } from '../utils/db/mongo';
import { safeSendMessage } from '../utils/discord/channelUtils';
import { buildStudySessionMessage } from '../builders/endSessionMessageComponent';

async function handleUserJoinedStudy(userId: Types.ObjectId) {
  try {
    await studySessionService.startStudySession(userId);
  } catch (error: unknown) {
    if (isMongoError(error) && error.errorResponse?.code === 11000) {
      await sessionService.deleteOpenSession(error.errorResponse?.keyValue?.user);
      await studySessionService.startStudySession(userId);
    } else {
      logger.error(error);
    }
  }
}

async function handleUserLeftStudy(
  userId: Types.ObjectId,
  reportChannelId: string,
  timezone: string,
  member: VoiceState['member'],
  guild: Guild,
  clientUser: ClientUser
) {
  const { minTime } = await serverService.findServer(guild.id);
  if (!member?.user) return;
  const user = member.user;

  try {
    const closedSession = await studySessionService.endStudySession(userId, minTime);
    const todaySessions = await sessionService.sessionsInInterval(
      userId,
      closedSession.date,
      add(closedSession.date, { days: 1 })
    );
    const todaySessionsTotal = todaySessions.reduce((acc, session) => acc + session.duration, 0);
    await safeSendMessage(
      reportChannelId,
      buildStudySessionMessage(closedSession, timezone, user, todaySessionsTotal),
      guild,
      clientUser
    );
  } catch (error: unknown) {
    if (error instanceof Error && isJsonString(error.message)) {
      const errorData = JSON.parse(error.message);
      if (errorData.type === 'bellow min length') {
        const date = new Date(0);
        await safeSendMessage(
          reportChannelId,
          `<@${user.id}>, your study session was too short to be saved | ${format(
            date.setSeconds(errorData.duration),
            'mm:ss'
          )} is less than ${Math.floor(minTime / 60)}min`,
          guild,
          clientUser
        );
      }
    }
  }
}

const voiceStateHandler = {
  name: Events.VoiceStateUpdate,
  execute: async (oldState: VoiceState, newState: VoiceState, client: Client) => {
    if (oldState.channelId === newState.channelId) return;

    const server = await serverService.findOrCreateServer(newState.guild.id);
    if (!server || !client.user) return;

    const member = newState.member?.user;
    const wasStudying = server.studyChannels.includes(oldState.channelId || '');
    const nowStudying = server.studyChannels.includes(newState.channelId || '');

    if ((!wasStudying && !nowStudying) || !member || member.bot) return;

    const user = await userService.findOrCreateUser(member.id);
    if (!user) return;

    if (!wasStudying && nowStudying) await handleUserJoinedStudy(user._id);

    if (wasStudying && !nowStudying) {
      await handleUserLeftStudy(
        user._id,
        server.reportChannel,
        server.timezone,
        newState.member,
        newState.guild,
        client.user
      );
    }
  },
};

export default voiceStateHandler;

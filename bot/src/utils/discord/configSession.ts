import serverService from '../../services/serverService';
import { ConfigState } from '../../types';
import type { Client, Interaction } from 'discord.js';
import { isValidChannel } from './channelUtils';

const configSessions: Map<string, ConfigState> = new Map();

export async function startSession(
  client: Client,
  interaction: Interaction
): Promise<ConfigState> {
  if (!client.user || !interaction.guild) throw new Error('guild or client user missing');
  const user = client.user,
    guild = interaction.guild;

  const { timezone, reportChannel, studyChannels, minTime } = await serverService.findServer(
    interaction.guild.id
  );

  const validatedStudyChannels = (
    await Promise.all(
      studyChannels.map(async (ch) => ({
        channelId: ch,
        isValid: await isValidChannel(ch, guild, user),
      }))
    )
  )
    .filter((result) => result.isValid)
    .map((result) => result.channelId);

  const validatedReportChannel = (await isValidChannel(
    reportChannel,
    interaction.guild,
    client.user
  ))
    ? reportChannel
    : '';

  const sessionData = {
    timezone,
    reportChannel: validatedReportChannel,
    studyChannels: validatedStudyChannels,
    minTime: minTime / 60,
  };

  const session: ConfigState = {
    data: sessionData,
    completed:
      !!sessionData.reportChannel && !!sessionData.studyChannels.length && !!sessionData.minTime,
  };

  configSessions.set(interaction.guild.id, session);

  if (session.data.studyChannels !== studyChannels) {
    await serverService.updateServer(interaction.guild.id, {
      studyChannels: session.data.studyChannels,
    });
  }

  if (session.data.reportChannel !== reportChannel) {
    await serverService.updateServer(interaction.guild.id, {
      reportChannel: '',
    });
  }

  return session;
}

function updateSession(serverId: string, payload: Partial<ConfigState['data']>): ConfigState {
  const session = configSessions.get(serverId);
  if (!session) throw new Error('config session closed/not found, try again later');

  const updatedData = { ...session.data, ...payload };

  const newSession = {
    modified: true,
    data: updatedData,
    completed:
      !!updatedData.reportChannel &&
      updatedData.studyChannels.length > 0 &&
      updatedData.minTime >= 3 &&
      updatedData.minTime <= 7,
  };

  configSessions.set(serverId, newSession);
  return newSession;
}

export function deleteSession(serverId: string): void {
  configSessions.delete(serverId);
}

export function findSession(serverId: string): ConfigState | undefined {
  const session = configSessions.get(serverId);
  return session;
}

export default {
  updateSession,
  deleteSession,
  findSession,
};

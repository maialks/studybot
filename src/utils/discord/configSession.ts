import serverService from '../../services/serverService';
import { ConfigState } from '../../types';

const configSessions: Map<string, ConfigState> = new Map();

export async function startSession(serverId: string, userId: string): Promise<void> {
  const { timezone } = await serverService.findServer(serverId);
  configSessions.set(`${serverId}:${userId}`, {
    data: { reportChannel: '', studyChannels: [], timezone },
    completed: false,
  });
}

function updateSession(
  serverId: string,
  userId: string,
  payload: Partial<ConfigState['data']>
): ConfigState {
  const session = configSessions.get(`${serverId}:${userId}`);
  if (!session) throw new Error('config session closed/not found, try again later');
  const newSession = {
    data: { ...session.data, ...payload },
    completed: !!(
      (session.data.reportChannel || payload.reportChannel) &&
      (session.data.studyChannels.length || (payload.studyChannels && payload.studyChannels.length))
    ),
  };
  configSessions.set(`${serverId}:${userId}`, newSession);
  return newSession;
}

export function deleteSession(serverId: string, userId: string): void {
  configSessions.delete(`${serverId}:${userId}`);
  console.log(configSessions);
}

function findSession(serverId: string, userId: string): ConfigState {
  const session = configSessions.get(`${serverId}:${userId}`);
  if (!session) throw new Error('config session closed/not found, try again later');
  return session;
}

export default {
  updateSession,
  deleteSession,
  findSession,
};

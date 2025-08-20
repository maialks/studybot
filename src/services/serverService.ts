import Server from '../models/serverModel';
import logger from '../utils/general/logger';
import { Server as ServerInterface } from '../types';

const createServer = async function (serverId: string): Promise<ServerInterface> {
  const server = await Server.create({ serverId });
  logger.info(`server ${serverId} saved sucessfully`);
  return server;
};

const deleteServer = async function (serverId: string) {
  await Server.findOneAndDelete({ serverId });
  logger.info('deleted sucessfully');
};

const findServer = async function (serverId: string): Promise<ServerInterface> {
  const server = await Server.findOne({ serverId });
  if (!server) throw new Error('server not found');
  return server;
};

async function findOrCreateServer(serverId: string) {
  try {
    return await findServer(serverId);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'server not found') {
      return await createServer(serverId);
    }
    logger.error(error);
    return null;
  }
}

async function fetchStudyChannels(serverId: string) {
  const response = await Server.findOne({ serverId }, { studyChannels: 1, _id: 0 }).lean();
  if (!response) return [];
  return response.studyChannels;
}

async function updateServer(serverId: string, update: Partial<ServerInterface>) {
  await Server.findOneAndUpdate({ serverId }, { ...update });
}

export default {
  createServer,
  deleteServer,
  findServer,
  findOrCreateServer,
  fetchStudyChannels,
  updateServer,
};

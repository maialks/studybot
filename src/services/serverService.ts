import Server from '../models/serverModel';
import logger from '../utils/logger';
import { Server as ServerInterface } from '../types';

const createServer = async function (
  serverId: string
): Promise<ServerInterface> {
  try {
    const server = await Server.create({ serverId });
    logger.info(`server ${serverId} saved sucessfully`);
    return server;
  } catch (error: unknown) {
    throw error;
  }
};

const deleteServer = async function (serverId: string) {
  try {
    await Server.findOneAndDelete({ serverId });
    logger.info('deleted sucessfully');
  } catch (error: unknown) {
    throw error;
  }
};

const findServer = async function (serverId: string): Promise<ServerInterface> {
  try {
    const server = await Server.findOne({ serverId });
    if (!server) throw new Error('server not found');
    return server;
  } catch (error: unknown) {
    throw error;
  }
};

async function findOrCreateServer(guildId: string) {
  try {
    return await findServer(guildId);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'server not found') {
      return await createServer(guildId);
    }
    logger.error(error);
    return null;
  }
}

export default {
  createServer,
  deleteServer,
  findServer,
  findOrCreateServer,
};

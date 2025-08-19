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

async function setReportChannel(serverId: string, reportChannel: string) {
  try {
    await Server.findOneAndUpdate({ serverId }, { reportChannel });
  } catch (error: unknown) {
    logger.error(error);
    throw error;
  }
}

async function fetchStudyChannels(serverId: string) {
  try {
    const response = await Server.findOne(
      { serverId },
      { studyChannels: 1, _id: 0 }
    ).lean();
    if (!response) return [];
    return response.studyChannels;
  } catch (error: unknown) {
    throw error;
  }
}

async function updateServer(
  serverId: string,
  update: Partial<ServerInterface>
) {
  try {
    await Server.findOneAndUpdate({ serverId }, { ...update });
  } catch (error: unknown) {
    logger.error(error);
    throw error;
  }
}

export default {
  createServer,
  deleteServer,
  findServer,
  findOrCreateServer,
  fetchStudyChannels,
  updateServer,
};

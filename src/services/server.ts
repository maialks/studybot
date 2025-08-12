import Server from '../models/server';
import logger from '../utils/logger';

const createServer = async function (guildId: string) {
  try {
    const server = new Server({ serverId: guildId });
    await server.save();
    logger.info('saved sucessfully');
  } catch (error: unknown) {
    throw error;
  }
};

const deleteServer = async function (guildId: string) {
  try {
    await Server.findOneAndDelete({ serverId: guildId });
    logger.info('deleted sucessfully');
  } catch (error: unknown) {
    throw error;
  }
};

export default {
  createServer,
  deleteServer,
};

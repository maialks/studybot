import Server from '../models/serverModel';
import logger from '../utils/logger';

const createServer = async function (serverId: string) {
  try {
    const server = new Server({ serverId });
    await server.save();
    logger.info(`server ${serverId} saved sucessfully`);
    return true;
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

export default {
  createServer,
  deleteServer,
};

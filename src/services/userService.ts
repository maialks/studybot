import User from '../models/userModel.js';
import type { User as UserInterface } from '../types.js';
import logger from '../utils/general/logger.js';

const createUser = async function (discordId: string): Promise<UserInterface> {
  const user = await User.create({ discordId });
  logger.info(`user ${user.discordId} saved sucessfully`);
  return user;
};

const deleteUser = async function (discordId: string): Promise<void> {
  const user = await User.findOneAndDelete({ discordId });
  if (!user) return;
  logger.info(`user ${user.discordId} deleted sucessfully`);
};

const addServer = async function (discordId: string, serverId: string): Promise<void> {
  await User.findOneAndUpdate({ discordId }, { $push: { servers: serverId } });
};

const delServer = async function (discordId: string, serverId: string): Promise<void> {
  await User.findOneAndUpdate({ discordId }, { $pull: { servers: serverId } });
};

const findUser = async (discordId: string): Promise<UserInterface> => {
  const user = await User.findOne({ discordId });
  if (!user) throw new Error('user not found');
  return user;
};

async function findOrCreateUser(userId: string) {
  try {
    return await findUser(userId);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'user not found') {
      return await createUser(userId);
    }
    logger.error(error);
    return null;
  }
}

export default {
  findOrCreateUser,
  createUser,
  deleteUser,
  delServer,
  addServer,
  findUser,
};

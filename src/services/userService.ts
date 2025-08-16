import User from '../models/userModel';
import { User as UserInterface } from '../types';
import logger from '../utils/logger';

const createUser = async function (discordId: string): Promise<UserInterface> {
  try {
    const user = await User.create({ discordId });
    logger.info(`user ${user.discordId} saved sucessfully`);
    return user;
  } catch (error: unknown) {
    throw error;
  }
};

const deleteUser = async function (discordId: string): Promise<void> {
  try {
    const user = await User.findOneAndDelete({ discordId });
    if (!user) return;
    logger.info(`user ${user.discordId} deleted sucessfully`);
  } catch (error: unknown) {
    throw error;
  }
};

const addServer = async function (
  discordId: string,
  serverId: string
): Promise<void> {
  try {
    await User.findOneAndUpdate(
      { discordId },
      { $push: { servers: serverId } }
    );
  } catch (error: unknown) {
    throw error;
  }
};

const delServer = async function (
  discordId: string,
  serverId: string
): Promise<void> {
  try {
    await User.findOneAndUpdate(
      { discordId },
      { $pull: { servers: serverId } }
    );
  } catch (error: unknown) {
    throw error;
  }
};

const findUser = async (discordId: string): Promise<UserInterface> => {
  try {
    const user = await User.findOne({ discordId });
    if (!user) throw new Error('user not found');
    return user;
  } catch (error: unknown) {
    throw error;
  }
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

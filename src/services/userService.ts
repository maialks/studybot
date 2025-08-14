import User from '../models/userModel';
import logger from '../utils/logger';

const createUser = async function (discordId: string): Promise<void> {
  try {
    const user = new User({ discordId });
    await user.save();
    logger.info(`user ${user} saved sucessfully`);
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

export default {
  createUser,
  deleteUser,
  delServer,
  addServer,
};

import serverService from '../services/serverService';
import type { Guild } from 'discord.js';
import logger from '../utils/general/logger';

export const joinGuild = {
  name: 'guildCreate',
  execute: async (guild: Guild) => {
    try {
      await serverService.createServer(guild.id);
    } catch (error: unknown) {
      logger.error(error);
    }
  },
};

export const exitGuild = {
  name: 'guildDelete',
  execute: async (guild: Guild) => {
    try {
      await serverService.deleteServer(guild.id);
    } catch (error: unknown) {
      logger.error(error);
    }
  },
};

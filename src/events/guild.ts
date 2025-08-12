const { createServer, deleteServer } = require('../services/server');
import type { Guild } from 'discord.js';
import logger from '../utils/logger';

export const joinGuild = {
  name: 'guildCreate',
  execute: async (guild: Guild) => {
    try {
      createServer(guild.id);
    } catch (error: unknown) {
      logger.error(error);
    }
  },
};

export const exitGuild = {
  name: 'guildDelete',
  execute: async (guild: Guild) => {
    try {
      deleteServer(guild.id);
    } catch (error: unknown) {
      logger.error(error);
    }
  },
};

import type { EventHandler } from '../types.js';
import type { Client } from 'discord.js';
import { Events, ActivityType } from 'discord.js';
import logger from '../utils/general/logger.js';

const clientReady: EventHandler = {
  name: Events.ClientReady,
  once: true,
  execute: (client: Client) => {
    logger.info(`${client.user?.username} running on ${process.env.NODE_ENV}`);
    client.user?.setActivity(`Tracking Study Time: `, {
      type: ActivityType.Watching,
    });
  },
};

export default clientReady;

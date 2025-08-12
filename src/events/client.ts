import type { EventHandler } from '../types';
import type { Client } from 'discord.js';
import { Events, ActivityType } from 'discord.js';
import logger from '../utils/logger';

const clientReady: EventHandler = {
  name: Events.ClientReady,
  once: true,
  execute: (client: Client) => {
    logger.info(`${client.user?.username} running`);
    client.user?.setActivity(`Tracking Study Time: `, {
      type: ActivityType.Watching,
    });
  },
};

export default clientReady;

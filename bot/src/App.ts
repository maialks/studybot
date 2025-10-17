import { Client, Collection } from 'discord.js';
import express from 'express';

import { DISCORD_INTENTS } from './config/discord';
import { connectMongo } from './utils/db/mongo';
import logger from './utils/general/logger';
import env from './config/env';

import { registerEvents } from './utils/discord/registerEvents';
import { registerCommands } from './utils/discord/registerCommands';
import type { WrappedCommand } from './types';

export class App {
  discord: Client;
  express = express();
  constructor() {
    this.discord = new Client({ intents: DISCORD_INTENTS });
  }

  async start() {
    // @ts-expect-error discord client does not have commands collection by default anymore
    this.discord.commands = new Collection<string, WrappedCommand>();
    await connectMongo(env.MONGODB_URI);
    registerEvents(this.discord);
    registerCommands(this.discord);
    await this.discord.login(env.BOT_TOKEN);

    this.express.listen(env.PORT, () => {
      logger.info(`express running on port ${env.PORT}`);
    });
  }
}

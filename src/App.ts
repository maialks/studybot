import { Client, Collection } from 'discord.js';
import express from 'express';

import { DISCORD_INTENTS } from './config/discord.js';
import { connectMongo } from './utils/db/mongo.js';
import logger from './utils/general/logger.js';
import env from './config/env.js';

import { registerEvents } from './utils/discord/registerEvents.js';
import { registerCommands } from './utils/discord/registerCommands.js';
import type { WrappedCommand } from './types.js';

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

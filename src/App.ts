import { DISCORD_INTENTS } from './config/discord';
import { connectMongo } from './utils/mongo';
import { Client } from 'discord.js';
import logger from './utils/logger';
import env from './config/env';
import express from 'express';
import { registerEvents } from './utils/registerEvents';

export class App {
  discord: Client;
  express = express();
  constructor() {
    this.discord = new Client({ intents: DISCORD_INTENTS });
  }

  async start() {
    await connectMongo(env.MONGODB_URI);
    registerEvents(this.discord);
    // registerCommands();
    const teste = await this.discord.login(env.BOT_TOKEN);
    console.log(teste);

    this.express.listen(env.PORT, () => {
      logger.info(`express running on port ${env.PORT}`);
    });
  }
}

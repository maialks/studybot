import logger from '../utils/logger';
import { Events } from 'discord.js';
import type { Message } from 'discord.js';
import type { EventHandler } from '../types';
import type { Client } from 'discord.js';

const messageHandler: EventHandler<Events.MessageCreate> = {
  name: Events.MessageCreate,
  execute(message: Message, client: Client) {
    console.log(client);
    if (message.author.bot || !message.content) return;
    const dateStr = new Date(message.createdTimestamp).toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
    });
    logger.info(
      `${message.author.globalName} [${dateStr}]: ${message.content}`
    );
  },
};

export default messageHandler;

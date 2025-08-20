import logger from '../utils/general/logger';
import { Events } from 'discord.js';
import type { Message } from 'discord.js';
import type { EventHandler } from '../types';

const messageHandler: EventHandler<Events.MessageCreate> = {
  name: Events.MessageCreate,
  execute(message: Message) {
    if (message.author.bot || !message.content) return;
    const dateStr = new Date(message.createdTimestamp).toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
    });
    logger.info(`${message.author.globalName} [${dateStr}]: ${message.content}`);
  },
};

export default messageHandler;

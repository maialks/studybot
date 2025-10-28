import {
  type Guild,
  type User,
  type TextChannel,
  MessagePayload,
  DiscordAPIError,
  type ClientUser,
  type Client,
} from 'discord.js';
import logger from '../general/logger.js';
import type { ComponentsContainer } from '../../types.js';

function getAvailableTextChannel(guild: Guild, botUser: User): TextChannel | undefined {
  const allChannels = guild.channels.cache
    .filter((ch) => ch.type === 0) // text channel
    .filter((ch) => ch.permissionsFor(botUser)?.has('SendMessages'));
  const commonChannelNames = new Set<string>([
    'logs',
    'general',
    'chat',
    'bot-commands',
    'commands',
    'geral',
    'conversa',
    'bots',
    'lounge',
    'off-topic',
    'main',
    'welcome',
    'talk',
    'general-chat',
    'comunidade',
    'bater-papo',
    'bot',
    'cmd',
    'chatroom',
    'hub',
    'community',
  ]);

  const preferedChannels = allChannels.filter((ch) =>
    commonChannelNames.has(ch.name.toLowerCase())
  );

  return preferedChannels.first() || allChannels.first();
}

export async function safeSendMessage(
  channelId: string,
  message: string | MessagePayload | ComponentsContainer,
  guild: Guild,
  botUser: ClientUser
) {
  try {
    const channel = await guild.channels.fetch(channelId);
    if (!channel || channel.type !== 0) return;
    if (typeof message === 'string' || message instanceof MessagePayload) {
      await channel.send(message);
    } else {
      await channel.send({ components: message, flags: ['IsComponentsV2'] });
    }
  } catch (error: unknown) {
    if (error instanceof DiscordAPIError) {
      if (error.code === 10003) {
        const channel = getAvailableTextChannel(guild, botUser);
        if (channel) {
          if (typeof message === 'string' || message instanceof MessagePayload) {
            await channel.send(message);
          } else {
            await channel.send({ components: message, flags: ['IsComponentsV2'] });
          }
          await channel.send(
            'The selected report channel is unavailable (deleted or not set). Please set a new one using /set-report-channel or /start.'
          );
        }
      }
    } else {
      logger.error(error);
    }
  }
}

export async function deleteMessage(client: Client, channelId: string, messageId: string) {
  try {
    const channel = client.channels.cache.get(channelId);
    if (channel && channel.isTextBased()) channel.messages.delete(messageId);
  } catch (error) {
    logger.error('failed to delete message', error);
  }
}

export async function isValidChannel(
  channelId: string,
  guild: Guild,
  botUser: User
): Promise<boolean> {
  try {
    const channel = guild.channels.cache.get(channelId);
    if (!channel) return false;
    return channel.permissionsFor(botUser)?.has('SendMessages') ? true : false;
  } catch (_error) {
    return false;
  }
}

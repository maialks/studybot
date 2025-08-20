import { type Client } from 'discord.js';

export default async function deleteMessage(
  client: Client,
  channelId: string,
  messageId: string
) {
  const channel = client.channels.cache.get(channelId);
  if (channel && channel.isTextBased()) channel.messages.delete(messageId);
}

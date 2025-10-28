import { Client, type ClientUser, Collection } from 'discord.js';
import { DISCORD_INTENTS } from '../../config/discord.js';
import type { WrappedCommand } from '../../types.js';
import { registerCommands } from '../../utils/discord/registerCommands.js';
import { registerEvents } from '../../utils/discord/registerEvents.js';

export async function createTestClient(): Promise<Client<true>> {
  const testClient = new Client({ intents: DISCORD_INTENTS });
  // @ts-expect-error discord client does not have commands collection by default anymore
  testClient.commands = new Collection<string, WrappedCommand>();
  testClient.user = true as unknown as ClientUser;
  await registerCommands(testClient);
  await registerEvents(testClient);

  // testClient.on('interactionCreate', (interaction: any) => {
  //   console.log('interaction caught:', interaction.commandName);
  // });

  // testClient.on('voiceStateUpdate', (_event: any) => {
  //   console.log('voice state update');
  // });

  return testClient as Client<true>;
}

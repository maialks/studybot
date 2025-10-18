import { Client, Collection } from 'discord.js';
import { DISCORD_INTENTS } from '../../config/discord.js';
import { WrappedCommand } from '../../types.js';
import { registerCommands } from '../../utils/discord/registerCommands.js';
import { registerEvents } from '../../utils/discord/registerEvents.js';

export async function createTestClient(): Promise<Client<true>> {
  const testClient = new Client({ intents: DISCORD_INTENTS });
  // @ts-expect-error discord client does not have commands collection by default anymore
  testClient.commands = new Collection<string, WrappedCommand>();
  await registerCommands(testClient);
  await registerEvents(testClient);

  testClient.on('interactionCreate', (interaction: any) => {
    console.log('interaction caught:', interaction.commandName);
    // @ts-expect-error discord client does not have commands collection by default anymore
    console.log('other commands:', Array.from(testClient.commands?.keys()) || []);
  });

  return testClient as Client<true>;
}

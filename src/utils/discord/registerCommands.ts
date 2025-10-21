import fs from 'fs';
import path from 'path';
import type { Client, Collection } from 'discord.js';
import { fileURLToPath, pathToFileURL } from 'url';
import logger from '../general/logger';
import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
import type { WrappedCommand, AnyCommand } from '../../types';

interface BotClient extends Client {
  commands: Collection<string, WrappedCommand>;
}

async function importModule(filePath: string) {
  return await import(pathToFileURL(filePath).href);
}

async function loadDir(client: BotClient | Client, dir: string) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const filePath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await loadDir(client, filePath);
      continue;
    }

    if (!/\.(js|ts)$/.test(entry.name)) continue; // apenas .js/.ts

    let mod;
    try {
      mod = await importModule(filePath);
    } catch (err) {
      logger.error(err);
      continue;
    }

    const isValidCommand = (possibleCommand: AnyCommand): boolean =>
      possibleCommand.data instanceof SlashCommandBuilder &&
      !!possibleCommand.data.name &&
      typeof possibleCommand.execute === 'function';
    //!! converte para boolean

    const wrapCommand =
      (command: AnyCommand): WrappedCommand =>
      (interaction: CommandInteraction) =>
        Promise.resolve(command.execute(interaction, client)).catch((e) =>
          logger.error(`Error in command ${command.data.name}:`, e)
        );

    if (mod.default) {
      const command = mod.default as AnyCommand;
      if (isValidCommand(command)) {
        const handler = wrapCommand(command);
        // @ts-expect-errordiscord client does not have commands collection by default anymore
        client.commands.set(command.data.name, {
          data: command.data,
          execute: handler,
        });
        // logger.info(`Command loaded (default): ${command.data.name}`);
      }
    }

    for (const key of Object.keys(mod)) {
      if (key === 'default') continue;
      const command = mod[key];
      if (isValidCommand(command)) {
        const handler = wrapCommand(command);
        // @ts-expect-error discord client does not have commands collection by default anymore
        client.commands.set(command.data.name, {
          data: command.data,
          execute: handler,
        });
        // logger.info(`Command loaded (named): ${command.data.name}`);
      }
    }
  }
}

export async function registerCommands(client: Client): Promise<void> {
  // @ts-expect-error false warning due to compilation issues
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const commandsPath = path.join(__dirname, '..', '..', 'commands');

  if (!fs.existsSync(commandsPath)) {
    logger.warn('vents folder not found, skipping event registration.');
    return;
  }

  await loadDir(client as BotClient, commandsPath);
}

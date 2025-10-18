import { type APIApplicationCommand, REST, Routes } from 'discord.js';
import env from './config/env';
import { fileURLToPath, pathToFileURL } from 'url';
import fs from 'fs';
import path from 'path';
import logger from './utils/general/logger';
import type { AnyCommand } from './types';

async function importModule(filePath: string) {
  return await import(pathToFileURL(filePath).href);
}

async function loadDir(dir: string): Promise<AnyCommand[]> {
  let commands: AnyCommand[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  const isValidCommand = (possibleCommand: AnyCommand): boolean =>
    !!possibleCommand.data.name && typeof possibleCommand.execute === 'function';

  for (const entry of entries) {
    const filePath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const subCommands = await loadDir(filePath);
      commands = commands.concat(subCommands);
      continue;
    }

    if (!/\.(js|ts)$/.test(entry.name)) continue;

    let mod;
    try {
      mod = await importModule(filePath);
    } catch (error: unknown) {
      logger.error(error);
      continue;
    }

    if (mod.default) {
      const command = mod.default as AnyCommand;
      if (isValidCommand(command)) {
        commands.push(command);
        logger.info(`Command addead to commands array (default): ${command.data.name}`);
      }
    }

    for (const key of Object.keys(mod)) {
      if (key === 'default') continue;
      const command = mod[key];
      if (isValidCommand(command)) {
        commands.push(command);
        logger.info(`Command addead to commands array (named): ${command.data.name}`);
      }
    }
  }

  return commands;
}

const rest = new REST().setToken(env.BOT_TOKEN);

async function deployCommands(): Promise<void> {
  // @ts-expect-error false warning due to compilation issues
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const commandsPath = path.join(__dirname, 'commands');
  const scope: 'global' | 'guild' = process.argv[2] as 'global' | 'guild';
  const commands = await loadDir(commandsPath);
  let data: APIApplicationCommand[];
  if (scope === 'global') {
    data = (await rest.put(Routes.applicationCommands(env.APP_ID), {
      body: commands.map((command) => command.data.toJSON()),
    })) as APIApplicationCommand[];
  } else {
    data = (await rest.put(Routes.applicationGuildCommands(env.APP_ID, env.DEV_GUILD), {
      body: commands.map((command) => command.data.toJSON()),
    })) as APIApplicationCommand[];
  }
  logger.info(`Successfully reloaded ${data?.length} application ${scope} slash commands.`);
}

deployCommands();

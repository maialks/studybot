import fs from 'fs';
import path from 'path';
import type { Client } from 'discord.js';
import { fileURLToPath, pathToFileURL } from 'url';
import logger from '../general/logger.js';

type AnyEvent = {
  name: string;
  once?: boolean;
  execute: (...args: any[]) => unknown | Promise<unknown>;
};

async function importModule(filePath: string) {
  return await import(pathToFileURL(filePath).href);
}

async function loadDir(client: Client, dir: string) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const filePath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await loadDir(client, filePath);
      continue;
    }

    if (!/\.(js|ts)$/.test(entry.name)) continue;

    let mod;
    try {
      mod = await importModule(filePath);
    } catch (err) {
      logger.error(err);
      continue;
    }

    const isValidEvent = (possibleEv: AnyEvent): boolean =>
      !!possibleEv?.name && typeof possibleEv.execute === 'function';

    type wrappedEvent = (...agrs: any[]) => Promise<unknown>;
    const wrapEvent =
      (event: AnyEvent): wrappedEvent =>
      (...args: any[]) =>
        Promise.resolve(event.execute(...args, client)).catch((e) =>
          logger.error(`Error in event ${event.name}:`, e)
        );

    if (mod.default) {
      const event = mod.default as AnyEvent;
      if (isValidEvent(event)) {
        const handler = wrapEvent(event);
        if (event.once) client.once(event.name, handler);
        else client.on(event.name, handler);
        // logger.info(`Event loaded (default): ${event.name}`);
      }
    }

    for (const key of Object.keys(mod)) {
      if (key === 'default') continue;
      const event = mod[key];
      if (isValidEvent(event)) {
        const handler = wrapEvent(event);
        if (event.once) client.once(event.name, handler);
        else client.on(event.name, handler);
        // logger.info(`Event loaded (default): ${event.name}`);
      }
    }
  }
}

export async function registerEvents(client: Client): Promise<void> {
  // @ts-expect-error false warning due to compilation issues
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const eventsPath = path.join(__dirname, '..', '..', 'events');

  if (!fs.existsSync(eventsPath)) {
    logger.warn('vents folder not found, skipping event registration.');
    return;
  }

  await loadDir(client, eventsPath);
}

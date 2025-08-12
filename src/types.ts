import type { Awaitable, Events } from 'discord.js';

export interface EventHandler<T extends Events = Events> {
  name: T;
  once?: boolean;
  execute: (...args: any[]) => Awaitable<void>;
}

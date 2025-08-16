import type {
  Awaitable,
  Events,
  CommandInteraction,
  Client,
  Collection,
} from 'discord.js';
import type { Document, Types } from 'mongoose';
import { src } from './utils/constants';

export interface EventHandler<T extends Events = Events> {
  name: T;
  once?: boolean;
  execute: (...args: any[]) => Awaitable<void>;
}

type SourceType = (typeof src)[number];

export interface Session extends Document {
  _id: Types.ObjectId;
  src: SourceType;
  user: Types.ObjectId;
  start: Date;
  end: Date;
  duration: number;
  date: Date;
}

export type NewSession = Pick<Session, 'src' | 'user' | 'date' | 'start'>;

export interface User extends Document {
  _id: Types.ObjectId;
  discordId: string;
  servers: string[];
}

export interface Server extends Document {
  _id: Types.ObjectId;
  serverId: string;
  studyChannels: string[];
  reportChannel: string;
  timezone: string;
}

export type DateFormat =
  | 'yyyy-MM-dd HH:mm:ss' // Exemplo: 2025-08-14 11:30:00
  | 'dd-MM HH:mm:ss' // 14-07 11:30:00
  | 'yyyy-MM-dd' // Exemplo: 2025-08-14
  | 'HH:mm:ss' // Exemplo: 11:30:00
  | 'HH:mm' // Exemplo: 11:30
  | 'MMM dd' // Exemplo: Aug 14
  | 'MM/dd/yyyy' // Exemplo: 08/14/2025
  | 'PPpp' // Exemplo: Aug 14, 2025 at 11:30:00 AM
  | 'P' // Exemplo: 08/14/2025
  | 'p'; // Exemplo: 11:30 AM

export type WrappedCommand = (
  interaction: CommandInteraction
) => Promise<unknown>;

export interface BotClient extends Client {
  commands?: Collection<string, WrappedCommand>;
}

import type { Awaitable, Events } from 'discord.js';
import mongoose, { Document } from 'mongoose';

export interface EventHandler<T extends Events = Events> {
  name: T;
  once?: boolean;
  execute: (...args: any[]) => Awaitable<void>;
}

export interface Session extends Document {
  src: string; // origem da sessão (ex.: canal de voz)
  user: mongoose.Types.ObjectId; // referência ao usuário
  start: Date; // início da sessão
  end: Date; // fim da sessão
  duration: number; // duração em segundos ou minutos
  date: Date; // data-base da sessão (pode ser o mesmo que start)
}

export interface User extends Document {
  discordId: string;
  servers: string[];
}

export interface Server extends Document {
  serverId: string;
  studyChannels: string[];
  reportChannel: string;
  timezone: string;
}

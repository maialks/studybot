import mongoose from 'mongoose';
import type { User } from '../types';

const userSchema = new mongoose.Schema<User>(
  {
    discordId: { type: String, required: true, unique: true }, // ID do usuário no Discord
    servers: { type: [String], default: [] }, // lista de serverIds em que o usuário está
  },
  { minimize: false } // mantém campos mesmo que vazios
);

userSchema.index({ discordId: 1 });

export default mongoose.model<User>('users', userSchema, 'users');

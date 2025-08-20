import mongoose from 'mongoose';
import type { Server } from '../types';

const serverSchema = new mongoose.Schema<Server>(
  {
    serverId: { type: String, required: true, unique: true },
    studyChannels: { type: [String], default: [] },
    reportChannel: { type: String, default: '' },
    timezone: { type: String, default: 'UTC' },
  },
  { minimize: false }
);

export default mongoose.model<Server>('Servers', serverSchema, 'servers');

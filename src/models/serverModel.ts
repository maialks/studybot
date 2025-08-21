import mongoose from 'mongoose';
import type { Server } from '../types';

const serverSchema = new mongoose.Schema<Server>(
  {
    serverId: { type: String, required: true, unique: true },
    studyChannels: { type: [String], default: [] },
    reportChannel: { type: String, default: '' },
    timezone: { type: String, default: 'UTC' },
    minTime: {
      type: Number,
      min: 180,
      max: 600,
      default: 300,
      validate: {
        validator: Number.isInteger,
        message: '{VALUE} must be a integer number between 180 - 600 (calculated in secontds)',
      },
    },
  },
  { minimize: false }
);

export default mongoose.model<Server>('Servers', serverSchema, 'servers');

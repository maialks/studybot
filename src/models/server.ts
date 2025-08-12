import mongoose from 'mongoose';
const serverSchema = new mongoose.Schema(
  {
    serverId: { type: String, required: true },
    studyChannels: {
      type: [String],
      default: [],
    },
    reportChannel: {
      type: String,
    },
    userSessions: { type: mongoose.Schema.Types.Mixed, default: {} },
    timezone: { type: String, default: 'UTC' },
  },
  { minimize: false }
);

export default mongoose.model('server', serverSchema, 'servers');

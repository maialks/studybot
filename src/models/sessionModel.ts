import mongoose from 'mongoose';
import type { Session } from '../types.js';
import { src } from '../utils/constants.js';

const sessionSchema = new mongoose.Schema<Session>({
  src: { type: String, enum: src, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  start: { type: Date, required: true },
  end: { type: Date },
  duration: { type: Number }, // já calculado para facilitar relatórios
  date: { type: Date, required: true }, // pode ser igual a start (com menos dados, aqui nao precisamos da hora/min)
});

sessionSchema.index({ user: 1, date: 1 });
sessionSchema.index({ user: 1 }, { partialFilterExpression: { end: null }, unique: true });

export default mongoose.model<Session>('Session', sessionSchema, 'sessions');

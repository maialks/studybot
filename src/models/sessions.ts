import mongoose from 'mongoose';
import type { Session } from '../types';

const sessionSchema = new mongoose.Schema<Session>({
  src: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  start: { type: Date, required: true },
  end: { type: Date },
  duration: { type: Number }, // já calculado para facilitar relatórios
  date: { type: Date, required: true }, // pode ser igual a start (com menos dados, aqui nao precisamos da hora/min)
});

sessionSchema.index({ user: 1, date: 1 });

export default mongoose.model<Session>('sessions', sessionSchema, 'sessions');

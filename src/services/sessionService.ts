import Session from '../models/sessionModel.js';
import type { NewSession, Session as SessionInterface } from '../types.js';
import type { ObjectId, Types } from 'mongoose';

const createSessionEntry = async function (params: NewSession): Promise<void> {
  await Session.create(params);
};

const endOpenSession = async function (
  user: Types.ObjectId,
  serverMin: number
): Promise<SessionInterface> {
  const now = new Date();
  const updatedSession = await Session.findOneAndUpdate(
    { user: user.toString(), end: null }, // Filtro para encontrar a sessão aberta
    [
      {
        $set: {
          end: now, // Data/hora atual do servidor MongoDB
          duration: {
            $floor: { $divide: [{ $subtract: [now, '$start'] }, 1000] }, // Diferença em segundos
          },
        },
      },
    ],
    { new: true }
  );
  if (!updatedSession) throw new Error('No open session found for user');
  if (updatedSession.duration < serverMin) {
    await Session.findByIdAndDelete(updatedSession._id);
    throw new Error(
      JSON.stringify({
        type: 'bellow min length',
        duration: updatedSession.duration,
      })
    );
  }
  return updatedSession;
};

const deleteOpenSession = async function (user: ObjectId | Types.ObjectId) {
  await Session.findOneAndDelete({ user });
};

const sessionsInInterval = async function (
  user: Types.ObjectId,
  start: Date,
  end: Date
): Promise<SessionInterface[]> {
  return await Session.find({ user, date: { $gte: start, $lt: end } });
};

const userSessionExists = async function (user: Types.ObjectId) {
  return await Session.exists({ user });
};

export default {
  createSessionEntry,
  endOpenSession,
  sessionsInInterval,
  deleteOpenSession,
  userSessionExists,
};

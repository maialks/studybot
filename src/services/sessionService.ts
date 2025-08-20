import Session from '../models/sessionModel';
import type { NewSession, Session as SessionInterface } from '../types';
import type { Types } from 'mongoose';

const createSessionEntry = async function (params: NewSession): Promise<void> {
  await Session.create(params);
};

const endOpenSession = async function (
  user: Types.ObjectId
): Promise<SessionInterface> {
  const now = new Date();
  try {
    const updatedSession = await Session.findOneAndUpdate(
      { user, end: null }, // Filtro para encontrar a sessão aberta
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
    return updatedSession;
  } catch (error: unknown) {
    throw new Error(
      `failed to end session: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
};

const sessionsInInterval = async function (
  user: Types.ObjectId,
  start: Date,
  end: Date
): Promise<SessionInterface[]> {
  return await Session.find({ user, date: { $gte: start, $lt: end } });
};

export default { createSessionEntry, endOpenSession, sessionsInInterval };

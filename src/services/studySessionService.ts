import type { Types } from 'mongoose';
import { getStartOfDay } from '../utils/general/date.js';
import sessionService from './sessionService.js';
import retryAsync from '../utils/general/retryAsync.js';
import type { Session } from '../types.js';

async function startStudySession(userId: Types.ObjectId): Promise<void> {
  const now = new Date();
  await retryAsync(sessionService.createSessionEntry, 2, 2000, {
    src: 'discord-bot',
    user: userId,
    date: getStartOfDay(now),
    start: now,
  });
}

async function endStudySession(userId: Types.ObjectId, serverMin: number): Promise<Session> {
  return await sessionService.endOpenSession(userId, serverMin);
}

export default {
  startStudySession,
  endStudySession,
};

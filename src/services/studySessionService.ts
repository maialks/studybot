import type { Types } from 'mongoose';
import { getStartOfDay } from '../utils/general/date';
import sessionService from './sessionService';
import retryAsync from '../utils/general/retryAsync';
import { Session } from '../types';

async function startStudySession(userId: Types.ObjectId): Promise<void> {
  const now = new Date();
  retryAsync(sessionService.createSessionEntry, 2, 2000, {
    src: 'discord-bot',
    user: userId,
    date: getStartOfDay(now),
    start: now,
  });
}

async function endStudySession(userId: Types.ObjectId): Promise<Session> {
  return await retryAsync(sessionService.endOpenSession, 3, 2000, userId);
}

export default {
  startStudySession,
  endStudySession,
};

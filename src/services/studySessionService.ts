import type { Types } from 'mongoose';
import sessionService from './sessionService';
import { getStartOfDay } from '../utils/date';
import retryAsync from '../utils/retryAsync';
async function startStudySession(userId: Types.ObjectId) {
  const now = new Date();
  retryAsync(sessionService.createSessionEntry, 2, 2000, {
    src: 'discord-bot',
    user: userId,
    date: getStartOfDay(now),
    start: now,
  });
}

export default {
  startStudySession,
};

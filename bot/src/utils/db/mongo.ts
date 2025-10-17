import mongoose, { MongooseError } from 'mongoose';
import logger from '../general/logger';
import { ObjectId } from 'mongoose';

export async function connectMongo(URI: string) {
  try {
    await mongoose.connect(URI);
    logger.info('connected to mongodb ✅');
  } catch (error: unknown) {
    if (error instanceof MongooseError) logger.error(`Mongoose error: ${error.message}`);
    else logger.error('unable to connect do mongodb: ', error);
  }
}

export function isMongoError(
  error: unknown
): error is { errorResponse?: { code?: number; keyValue: { user: ObjectId } } } {
  return error != null && typeof error === 'object' && 'errorResponse' in error;
}

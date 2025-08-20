import mongoose, { MongooseError } from 'mongoose';
import logger from '../general/logger';

export async function connectMongo(URI: string) {
  try {
    await mongoose.connect(URI);
    logger.info('connected to mongodb');
  } catch (error: unknown) {
    if (error instanceof MongooseError) logger.error(`Mongoose error: ${error.message}`);
    else logger.error('unable to connect do mongodb: ', error);
  }
}

import env from '../../config/env.js';
import { connectMongo } from '../../utils/db/mongo.js';
import logger from '../../utils/general/logger.js';

const connectToTestDb = async () => {
  try {
    await connectMongo(env.TEST_MONGODB_URI);
  } catch (error) {
    logger.error(error);
  }
};

export default connectToTestDb;

import env from '../../config/env';
import { connectMongo } from '../../utils/db/mongo';

const connectToTestDb = () => connectMongo(env.MONGODB_URI);

export default connectToTestDb;

import dotenv from 'dotenv';
dotenv.config();

const testHost = 'localhost';
const testPort = process.env.GITHUB_ACTIONS ? '27017' : '27027';

const env = {
  PORT: Number(process.env.PORT) || 3000,
  BOT_TOKEN:
    process.env.NODE_ENV === 'dev'
      ? process.env.DEV_BOT_TOKEN || ''
      : process.env.NODE_ENV === 'prod'
      ? process.env.BOT_TOKEN || ''
      : '',
  APP_ID:
    process.env.NODE_ENV === 'dev'
      ? process.env.DEV_APP_ID || ''
      : process.env.NODE_ENV === 'prod'
      ? process.env.APP_ID || ''
      : '',
  MONGODB_URI:
    process.env.NODE_ENV === 'dev'
      ? process.env.DEV_MONGODB_URI || ''
      : process.env.NODE_ENV === 'prod'
      ? process.env.MONGODB_URI || ''
      : '',
  PUBLIC_KEY: process.env.DEV_PUBLIC_KEY || '',
  DEV_GUILD: process.env.DEV_GUILD || '',
  TEST_MONGODB_URI: `mongodb://${testHost}:${testPort}/testdb`,
};

export default env;

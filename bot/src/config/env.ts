import dotenv from 'dotenv';
dotenv.config();
console.log(process.env.NODE_ENV);

const env = {
  PORT: Number(process.env.PORT) || 3000,
  BOT_TOKEN: process.env.DEV_BOT_TOKEN || '',
  APP_ID: process.env.DEV_APP_ID || '',
  MONGODB_URI:
    process.env.NODE_ENV === 'dev'
      ? process.env.DEV_MONGODB_URI || ''
      : process.env.NODE_ENV === 'test'
      ? process.env.TEST_MONGODB_URI || ''
      : '',
  PUBLIC_KEY: process.env.DEV_PUBLIC_KEY || '',
  DEV_GUILD: '1350284780666880040',
};

export default env;

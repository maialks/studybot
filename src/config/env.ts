import dotenv from 'dotenv';
dotenv.config();

const env = {
  PORT: Number(process.env.PORT) || 3000,
  BOT_TOKEN: process.env.DEV_BOT_TOKEN || '',
  APP_ID: process.env.DEV_APP_ID || '',
  MONGODB_URI: process.env.DEV_MONGODB_URI || '',
  PUBLIC_KEY: process.env.DEV_PUBLIC_KEY || '',
};

export default env;

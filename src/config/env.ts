import dotenv from 'dotenv';
dotenv.config();

const env = {
  PORT: Number(process.env.PORT) || 3000,
  BOT_TOKEN: process.env.BOT_TOKEN || '',
  APP_ID: process.env.APP_ID || '',
  MONGODB_URI: process.env.MONGODB_URI || '',
  PUBLIC_KEY: process.env.PUBLIC_KEY || '',
};

export default env;

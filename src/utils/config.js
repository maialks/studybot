require('dotenv').config({ path: 'src/.env' });

const PORT = process.env.PORT;

let MONGODB_URI;
let BOT_TOKEN;
let PUBLIC_KEY;
let APP_ID;

if (process.env.NODE_ENV === 'development') {
  console.log('dev mode');
  MONGODB_URI = process.env.DEV_MONGODB_URI;
  BOT_TOKEN = process.env.DEV_BOT_TOKEN;
  APP_ID = process.env.DEV_APP_ID;
  PUBLIC_KEY = process.env.DEV_PUBLIC_KEY;
}
if (process.env.NODE_ENV === 'production') {
  console.log('prod mode');
  MONGODB_URI = process.env.MONGODB_URI;
  BOT_TOKEN = process.env.BOT_TOKEN;
  APP_ID = process.env.APP_ID;
  PUBLIC_KEY = process.env.PUBLIC_KEY;
}

module.exports = {
  PORT,
  MONGODB_URI,
  BOT_TOKEN,
  APP_ID,
  PUBLIC_KEY,
};

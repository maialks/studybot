require('dotenv').config({ path: '.env' });
const express = require('express');
const app = express();
const router = require('./controllers/routes');
const { requestLogger } = require('./utils/logger');

const { Client, Events, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.MessageCreate, (message) => {
  console.log(message);
  if (message.content === '!ping') {
    message.reply('Pong! 🏓');
  }
});

client.login(process.env.BOT_TOKEN);

app.use(express.json());
app.use(requestLogger);
app.use('/', router);
module.exports = app;

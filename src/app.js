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

client.login(process.env.BOT_TOKEN);

client.on(Events.MessageCreate, (message) => {
  if (message.content === '!ping') {
    message.reply('Pong! 🏓');
  }
});

app.use(express.json());
app.use(requestLogger);
app.use('/', router);
module.exports = app;

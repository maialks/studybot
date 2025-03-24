require('dotenv').config({ path: '.env' });
const express = require('express');
const app = express();
const router = require('./controllers/routes');
const { requestLogger } = require('./utils/logger');
const { Client, GatewayIntentBits } = require('discord.js');
const {
  ClientReady,
  MessageHandler,
  voiceStateHandler,
} = require('./events/main');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.on(ClientReady.name, ClientReady.execute);
client.on(MessageHandler.name, MessageHandler.execute);
client.on(voiceStateHandler.name, voiceStateHandler.execute);

client.login(process.env.BOT_TOKEN);

app.use(express.json());
app.use(requestLogger);
app.use('/', router);
module.exports = app;

require('dotenv').config({ path: '.env' })
const express = require('express')
const app = express()
const router = require('./controllers/routes')
const { requestLogger } = require('./utils/middleware')
const { Client, GatewayIntentBits } = require('discord.js')
const mongoose = require('mongoose')
const clientReady = require('./events/client')
const messageHandler = require('./events/message')
const voiceStateHandler = require('./events/voice')
const { joinGuild, exitGuild } = require('./events/guild')
const {
  PORT,
  MONGODB_URI,
  BOT_TOKEN,
  APP_ID,
  PUBLIC_KEY,
} = require('./utils/config')
const interactionCreate = require('./events/interaction')

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
})

;(async () => {
  try {
    mongoose.connect(MONGODB_URI)
    console.log('connected to mongodb')
  } catch {
    console.log('failed to connect to mongodb')
  }
})()

client.on(clientReady.name, clientReady.execute)
client.on(messageHandler.name, messageHandler.execute)
client.on(voiceStateHandler.name, voiceStateHandler.execute)
client.on(joinGuild.name, joinGuild.execute)
client.on(exitGuild.name, exitGuild.execute)
client.on(interactionCreate.name, interactionCreate.execute)

;(async () => {
  try {
    client.login(BOT_TOKEN)
  } catch (exception) {
    console.log(`faild to connect ${exception}`)
  }
})()

// app.use(express.json());
app.use(requestLogger)
app.use('/', router)
module.exports = app

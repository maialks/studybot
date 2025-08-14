const { REST, Routes } = require('discord.js');
const { APP_ID, BOT_TOKEN } = require('./utils/config');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const rest = new REST().setToken(BOT_TOKEN);

rl.question('qual o ID do comando?', async (id) => {
  try {
    await rest.delete(Routes.applicationCommand(APP_ID, id));
    console.log('Successfully deleted application command');
  } catch (err) {
    console.error(err);
  } finally {
    rl.close();
  }
});

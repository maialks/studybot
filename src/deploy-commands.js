const { REST, Routes } = require('discord.js');
const { APP_ID, BOT_TOKEN } = require('./utils/config');
const commands = require('./utils/get-commands')();

const rest = new REST().setToken(BOT_TOKEN);

console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV === 'development') {
  (async () => {
    try {
      console.log(
        `iniciada a atualização de ${commands.length} comandos slash`
      );
      const data = await rest.put(
        Routes.applicationGuildCommands(APP_ID, '1350284780666880040'),
        {
          body: commands,
        }
      );
      console.log(
        `finalizada a atualização de ${commands.length} comandos slash`
      );
    } catch (err) {
      console.error(err);
    }
  })();
}

if (process.env.NODE_ENV === 'production') {
  (async () => {
    try {
      console.log(
        `iniciada a atualização de ${commands.length} comandos slash`
      );
      const data = await rest.put(Routes.applicationCommands(APP_ID), {
        body: commands,
      });
      console.log(
        `finalizada a atualização de ${commands.length} comandos slash`
      );
    } catch (err) {
      console.error(err);
    }
  })();
}

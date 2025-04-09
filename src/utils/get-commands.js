const fs = require('fs');
const path = require('path');

const getCommands = (full = false) => {
  const commands = [];

  const foldersPath = path.join(__dirname, '..', 'commands');
  const commandFolders = fs.readdirSync(foldersPath);

  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith('.js'));

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);
      if ('data' in command && 'execute' in command) {
        full ? commands.push(command) : commands.push(command.data.toJSON());
      } else {
        console.log(
          `command at ${filePath} is missing a required "data" or "execute" property`
        );
      }
    }
  }
  return commands;
};

module.exports = getCommands;

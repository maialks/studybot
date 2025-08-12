// import fs from 'fs';
// import path from 'path';
// import {
//   ChatInputCommandInteraction,
//   Collection,
//   SlashCommandBuilder,
// } from 'discord.js';

// interface Command {
//   data: SlashCommandBuilder;
//   execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
// }

// function registerCommands(commandsCollection: Collection<string, Command>) {
//   const commandsPath = path.join(__dirname, '..', 'commands');

//   function loadCommands(dir: string) {
//     const files = fs.readdirSync(dir, { withFileTypes: true });

//     for (const file of files) {
//       const filePath = path.join(dir, file.name);

//       if (file.isDirectory()) {
//         loadCommands(filePath); // Recursivo
//       } else if (file.name.endsWith('.js')) {

//         if (!command.data || !command.execute) {
//           console.warn(
//             `command in ${file.name} ignored: 'data' or 'execute' fields missing`
//           );
//           continue;
//         }

//         commandsCollection.set(command.data.name, command);
//         console.log(`command loaded: ${command.data.name}`);
//       }
//     }
//   }

//   loadCommands(commandsPath);
// }

const { InteractionType } = require('discord.js');
const Server = require('../models/server');
const timezones = require('../config/timezones');

const commands = require('../utils/get-commands')(true);

const interactionCreate = {
  name: 'interactionCreate',
  execute: async (interaction) => {
    if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
      console.log('autocomplete');
      if (interaction.commandName === 'remove-study-channels') {
        const focusedValue = interaction.options.getFocused();
        const server = await Server.findOne({
          serverId: interaction.guildId,
        });
        const channels = await Promise.all(
          server.studyChannels.map(async (channelId) => {
            const channel = await interaction.guild.channels.fetch(channelId);
            return {
              name: channel.name,
              value: channelId,
            };
          })
        );
        const results = channels.filter((channel) =>
          channel.name.toLowerCase().startsWith(focusedValue.toLowerCase())
        );
        interaction.respond(results || channels);
        return;
      }
      if (interaction.commandName === 'set-timezone') {
        const focusedValue = interaction.options.getFocused();

        const results = timezones
          .filter((channel) =>
            channel.name.toLowerCase().includes(focusedValue.toLowerCase())
          )
          .slice(0, 5);
        interaction.respond(results);
      }
    }

    if (interaction.type === InteractionType.ApplicationCommand) {
      const command = await commands.find(
        (cmd) => cmd.data.name === interaction.commandName
      );
      console.log(`slash command executado ${interaction.commandName}`);
      command.execute(interaction);
    }
  },
};

module.exports = interactionCreate;

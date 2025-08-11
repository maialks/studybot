const { SlashCommandBuilder } = require('discord.js');
const Server = require('../../models/server');
const timezones = require('../../utils/timezones');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('set-timezone')
    .setDescription('set the timezone that will be used in your server')
    .addStringOption((option) =>
      option
        .setName('country')
        .setDescription('select one country or timezone')
        .setRequired(true)
        .setAutocomplete(true)
    ),

  async execute(interaction) {
    try {
      const timezone = interaction.options.getString('country');
      const { name: timezoneName } = timezones.find(
        (tz) => tz.value === timezone
      );
      if (!timezoneName) {
        return await interaction.reply({
          content:
            '❌ Invalid timezone selected. Please choose one from the list.',
          ephemeral: true,
        });
      }
      const server = await Server.findOne({ serverId: interaction.guild.id });
      server.timezone = timezone;
      server.save();
      interaction.reply(`Timezone set to:\n${timezoneName} - (${timezone})`);
    } catch (err) {
      console.log(err);
    }
  },
};

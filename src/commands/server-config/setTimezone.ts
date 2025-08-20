import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import timezones from '../../config/timezones';
import serverService from '../../services/serverService';

export default {
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

  async execute(interaction: ChatInputCommandInteraction) {
    const timezone = interaction.options.getString('country');
    let selectedTimezone: (typeof timezones)[number] | undefined;
    if (timezone !== null) {
      selectedTimezone = timezones.find((tz) => tz.value === timezone);
    }
    if (!selectedTimezone) {
      return await interaction.reply({
        content: 'Invalid timezone selected. Please choose one from the list.',
        flags: ['Ephemeral'],
      });
    }
    try {
      if (!interaction.guildId) return;
      await serverService.updateServer(interaction.guildId, {
        timezone: selectedTimezone.value,
      });
      interaction.reply(
        `Timezone set to:\n${selectedTimezone.name} - (${selectedTimezone.value})`
      );
    } catch (err) {
      console.log(err);
    }
  },
};

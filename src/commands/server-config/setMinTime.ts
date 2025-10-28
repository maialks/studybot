import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import serverService from '../../services/serverService.js';
import logger from '../../utils/general/logger.js';

export default {
  data: new SlashCommandBuilder()
    .setName('set-mininum-time')
    .setDescription('Set the minimum duration a session must have to be saved to the database.')
    .addIntegerOption((option) =>
      option
        .setName('duration')
        .setDescription('Enter a value in minutes between 3 and 7')
        .setRequired(true)
        .setMinValue(3)
        .setMaxValue(7)
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const minDuration = interaction.options.getInteger('duration');
    if (!interaction.guildId || !minDuration) return;
    try {
      await serverService.updateServer(interaction.guildId, {
        minTime: minDuration * 60,
      });
      await interaction.reply(
        `The minimum session duration has been successfully updated to ${minDuration} minutes.`
      );
    } catch (error: unknown) {
      logger.error(error);
    }
  },
};

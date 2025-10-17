import {
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
} from 'discord.js';
import serverService from '../../services/serverService';

export default {
  data: new SlashCommandBuilder()
    .setName('list-study-channels')
    .setDescription('Displays witch channels are being tracked'),
  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.guildId) return;

    try {
      const studyChannels = await serverService.fetchStudyChannels(
        interaction.guildId
      );

      await interaction.reply(
        `Currently Tracked Channels:\n${studyChannels
          .map((ch) => `• <#${ch}>`)
          .join('\n')}`
      );
    } catch (error) {
      console.error(error);
      await interaction.reply('❌ Failed to fetch study channels.');
    }
  },
};

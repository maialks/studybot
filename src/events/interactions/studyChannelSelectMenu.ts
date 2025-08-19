import { type StringSelectMenuInteraction } from 'discord.js';
import serverService from '../../services/serverService';
import logger from '../../utils/logger';

export default async function (interaction: StringSelectMenuInteraction) {
  if (interaction.customId === 'STUDY-CH-SELECT' && interaction.guildId) {
    try {
      const res = await serverService.updateServer(interaction.guildId, {
        studyChannels: interaction.values,
      });
      await interaction.reply(
        `Currently Tracked Channels:\n${interaction.values
          .map((ch) => `• <#${ch}>`)
          .join('\n')}`
      );
    } catch (error: unknown) {
      logger.error(error);
      if (interaction.deferred || interaction.replied) {
        await interaction.followUp({
          content: 'error updating study channels',
          flags: ['Ephemeral'],
        });
      } else {
        await interaction.reply({
          content: 'error updating study channels',
          flags: ['Ephemeral'],
        });
      }
    }
  }
}

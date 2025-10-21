import { type StringSelectMenuInteraction } from 'discord.js';
import serverService from '../../../services/serverService';
import logger from '../../../utils/general/logger';

export default async function (interaction: StringSelectMenuInteraction) {
  try {
    if (!interaction.guildId) return;
    await serverService.updateServer(interaction.guildId, {
      studyChannels: interaction.values,
    });
    await interaction.reply(
      `Currently Tracked Channels:\n${interaction.values.map((ch) => `• <#${ch}>`).join('\n')}`
    );
    await interaction.message.delete();
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

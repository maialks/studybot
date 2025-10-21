import type { ChatInputCommandInteraction } from 'discord.js';
import logger from '../../../utils/general/logger';

export default async function chatInputCommandHandler(interaction: ChatInputCommandInteraction) {
  // @ts-expect-error discord client does not have commands collection by default anymore
  const command = interaction.client.commands.get(interaction.commandName);
  if (!command) return;
  try {
    await command.execute(interaction);
  } catch (err) {
    logger.error(err);
    if (interaction.deferred || interaction.replied) {
      await interaction.followUp({
        content: 'erro ao executar comando',
        flags: ['Ephemeral'],
      });
    } else {
      await interaction.reply({
        content: 'erro ao executar comando',
        flags: ['Ephemeral'],
      });
    }
  }
}

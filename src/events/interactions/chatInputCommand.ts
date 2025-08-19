import type { ChatInputCommandInteraction } from 'discord.js';

export default async function chatInputCommandHandler(
  interaction: ChatInputCommandInteraction
) {
  // @ts-ignore
  const command = interaction.client.commands.get(interaction.commandName);
  if (!command) return;
  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(err);
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

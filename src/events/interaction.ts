// src/events/interactionCreate.ts
import { Events, type Interaction } from 'discord.js';
import type { Client } from 'discord.js';

export default {
  name: Events.InteractionCreate,
  async execute(interaction: Interaction) {
    if (!interaction.isChatInputCommand()) return;
    // @ts-ignore
    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (err) {
      console.error(err);
      if (interaction.deferred || interaction.replied) {
        await interaction.followUp({
          content: 'erro ao executar comando.',
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: 'erro ao executar comando.',
          ephemeral: true,
        });
      }
    }
  },
};

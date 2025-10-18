import { SlashCommandBuilder, type CommandInteraction } from 'discord.js';

export default {
  data: new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!'),
  async execute(interaction: CommandInteraction) {
    console.log('ping command called');
    await interaction.reply('Pong!');
  },
};

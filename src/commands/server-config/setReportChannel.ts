import { ChannelType, ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import serverService from '../../services/serverService.js';
import logger from '../../utils/general/logger.js';

export default {
  data: new SlashCommandBuilder()
    .setName('set-report-channel')
    .setDescription('set the text channel that will be used to send study logs')
    .addChannelOption((option) =>
      option
        .setName('channel')
        .setDescription('choose one of the channels')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const channel = interaction.options.getChannel('channel');
    if (!interaction?.guild || !channel?.id || !interaction.guildId) return;
    try {
      serverService.updateServer(interaction.guildId, {
        reportChannel: channel.id,
      });
      await interaction.reply(`Report Channel set to: <#${channel.id}>`);
    } catch (error: unknown) {
      logger.error(error);
    }
  },
};

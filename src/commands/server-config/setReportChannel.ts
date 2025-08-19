import {
  ChannelType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';
import serverService from '../../services/serverService';
import logger from '../../utils/logger';

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
    if (!interaction?.guild || !channel?.id) return;
    try {
      serverService.updateServer(interaction.guildId!, {
        reportChannel: channel.id,
      });
      await interaction.reply(
        `canal de report configurado para: <#${channel.id}>`
      );
    } catch (error: unknown) {
      console.log('erro em commands/serverconfig');
      logger.error(error);
    }
  },
};

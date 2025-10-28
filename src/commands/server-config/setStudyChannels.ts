import {
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from 'discord.js';
import serverService from '../../services/serverService.js';

export default {
  data: new SlashCommandBuilder()
    .setName('set-study-channels')
    .setDescription('Select which voice channels will be tracked as study channels'),

  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.guildId) return;

    const selectedChannels = await serverService.fetchStudyChannels(interaction.guildId);

    const guild = interaction.guild;
    if (!guild) return;
    const voiceChannels = guild.channels.cache.filter(
      (ch) => ch.type === 2 // ChannelType.GuildVoice (2)
    );

    const select = new StringSelectMenuBuilder()
      .setCustomId('STUDY-CH-SELECT')
      .setPlaceholder('Selecione os canais de estudo')
      .setMaxValues(5)
      .setMinValues(1);

    voiceChannels.forEach((ch) => {
      select.addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel(ch.name)
          .setValue(ch.id)
          .setDefault(selectedChannels.includes(ch.id))
      );
    });

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select);
    await interaction.reply({
      content: 'Selecione os canais de estudo:',
      components: [row],
    });
  },
};

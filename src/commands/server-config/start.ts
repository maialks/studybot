import { SlashCommandBuilder, type ChatInputCommandInteraction, type Client } from 'discord.js';
import serverService from '../../services/serverService';
import { startSession, deleteSession } from '../../utils/discord/configSession';
import deleteMessage from '../../utils/discord/deleteMessage';
import { buildSessionStartMessage } from '../../builders/startCommandComponents';

export default {
  data: new SlashCommandBuilder()
    .setName('start')
    .setDescription('Quick config for your Discord bot'),

  async execute(interaction: ChatInputCommandInteraction, client: Client) {
    if (!interaction.guild || !interaction.guildId) return;
    const serverData = await serverService.findServer(interaction.guildId);

    const textChannels = interaction.guild.channels.cache.filter((ch) => ch.type === 0);
    const notDefaultTextChannels = textChannels.filter((ch) => ch.id !== serverData.reportChannel);
    const defaultTextChannel = textChannels.get(serverData.reportChannel);

    const components = buildSessionStartMessage({
      voiceChannels: interaction.guild.channels.cache.filter((ch) => ch.type === 2),
      currentChannels: serverData.studyChannels,
      notDefaultTextChannels,
      defaultTextChannel,
    });

    const response = await interaction.reply({
      components,
      flags: ['IsComponentsV2'],
      withResponse: true,
    });

    // prettier-ignore
    const guildId = interaction.guildId, userId = interaction.user.id;
    startSession(guildId, userId);

    // config timeout
    if (response.resource !== null && response.resource.message !== null) {
      const channelId = response.resource.message.channelId;
      const messageId = response.resource.message.id;
      setTimeout(() => {
        deleteMessage(client, channelId, messageId);
        deleteSession(guildId, userId);
      }, 180000);
    }
  },
};

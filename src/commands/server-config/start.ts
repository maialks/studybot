import { SlashCommandBuilder, type ChatInputCommandInteraction, type Client } from 'discord.js';
import serverService from '../../services/serverService';
import { startSession, deleteSession } from '../../utils/discord/configSession';
import deleteMessage from '../../utils/discord/deleteMessage';
import { buildSessionStartMessage } from '../../builders/startCommandComponents';
import { getUpdatedUI } from '../../events/interactions/helpers/interfaceRefreshHelper';

export default {
  data: new SlashCommandBuilder()
    .setName('start')
    .setDescription('Quick config for your Discord bot'),

  async execute(interaction: ChatInputCommandInteraction, client: Client) {
    if (!interaction.guild || !interaction.guildId) return;
    const serverData = await serverService.findServer(interaction.guildId);

    // prettier-ignore
    const guildId = interaction.guildId, userId = interaction.user.id;
    const session = await startSession(guildId, userId);

    const components = getUpdatedUI(interaction, session);

    const response = await interaction.reply({
      components,
      flags: ['IsComponentsV2'],
      withResponse: true,
    });

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

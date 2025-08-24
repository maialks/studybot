import {
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
  type Client,
  type SectionBuilder,
  type ContainerBuilder,
} from 'discord.js';
import { startSession, deleteSession, findSession } from '../../utils/discord/configSession';
import { deleteMessage } from '../../utils/discord/channelUtils';
import { getUpdatedUI } from '../../events/interactions/helpers/interfaceRefreshHelper';
import { buildAlreadyConfiguringMessage } from '../../builders/startCommandComponents';
import logger from '../../utils/general/logger';

export default {
  data: new SlashCommandBuilder()
    .setName('start')
    .setDescription('Quick config for your Discord bot'),

  async execute(interaction: ChatInputCommandInteraction, client: Client) {
    console.log('start execute running');
    if (!interaction.guild || !interaction.guildId) return;
    const guildId = interaction.guildId;

    let components: (SectionBuilder | ContainerBuilder)[] = [];
    let ephemeral = false;

    if (findSession(guildId)) {
      components = buildAlreadyConfiguringMessage();
      ephemeral = true;
    } else {
      const session = await startSession(client, interaction);
      components = getUpdatedUI(client, interaction, session);
    }

    const response = await interaction.reply({
      components,
      flags: ephemeral ? ['IsComponentsV2', 'Ephemeral'] : ['IsComponentsV2'],
      withResponse: true,
    });

    // config timeout
    if (!ephemeral && response.resource !== null && response.resource.message !== null) {
      const channelId = response.resource.message.channelId;
      const messageId = response.resource.message.id;
      setTimeout(() => {
        deleteMessage(client, channelId, messageId);
        deleteSession(guildId);
      }, 180000);
    }
  },
};

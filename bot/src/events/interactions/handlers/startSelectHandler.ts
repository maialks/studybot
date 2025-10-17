import { type StringSelectMenuInteraction, type Client, ButtonInteraction } from 'discord.js';
import serverService from '../../../services/serverService';
import configSession from '../../../utils/discord/configSession';
import type { ConfigState } from '../../../types';
import { deleteMessage } from '../../../utils/discord/channelUtils';
import { buildSessionClosingMessage } from '../../../builders/startCommandComponents';
import { getUpdatedUI } from '../helpers/interfaceRefreshHelper';

type Interaction = StringSelectMenuInteraction | ButtonInteraction;

export default async function startSelectHandler(interaction: Interaction, client: Client) {

  if (!interaction.guildId) return;
  const [guildId, userId] = [interaction.guildId, interaction.user.id];

  const closeSession = async (data: ConfigState['data'], changed = true) => {

    if (changed)
      await serverService.updateServer(guildId, { ...data, minTime: data.minTime * 60 });

    await interaction.reply({
      components: buildSessionClosingMessage(data),
      flags: ['IsComponentsV2'],
    });
    await interaction.message.delete();

    configSession.deleteSession(guildId);
  };

  if (interaction.customId === 'SAVE-BTN' && interaction.isButton()) {
    const session = configSession.findSession(guildId);

    if (session && session.completed) {

      closeSession(session.data, session.modified);
    } else {

      const response = await interaction.reply({
        content: `<@${userId}>, you can't save settings with data missing. Please fulfill all the fields`,
        withResponse: true,
      });

      if (response.resource !== null && response.resource.message !== null) {
        const channelId = response.resource.message.channelId;
        const messageId = response.resource.message.id;
        setTimeout(() => deleteMessage(client, channelId, messageId), 3500);
      }
    }
    return;
  }

  let session: ConfigState | undefined = undefined;

  if (interaction.customId === 'STUDY-CH-SELECT' && interaction.isStringSelectMenu()) {
    session = configSession.updateSession(guildId, {
      studyChannels: interaction.values, 
    });
  }

  if (interaction.customId === 'REPORT-CH-SELECT' && interaction.isStringSelectMenu()) {
    session = configSession.updateSession(guildId, {
      reportChannel: interaction.values[0], 
    });
  }

  if (interaction.customId.startsWith('TIME-BTN') && interaction.isButton()) {
    const value = Number(interaction.customId.slice(-1));

    if (isNaN(value)) return;

    session = configSession.updateSession(guildId, {
      minTime: value,
    });
  }

  if (session) {
    interaction.update({
      components: getUpdatedUI(client, interaction, session),
      flags: ['IsComponentsV2'],
    });
  }
}
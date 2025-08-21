import {
  type StringSelectMenuInteraction,
  type Client,
  ButtonInteraction,
} from 'discord.js';
import serverService from '../../../services/serverService';
import configSession from '../../../utils/discord/configSession';
import type { ConfigState } from '../../../types';
import deleteMessage from '../../../utils/discord/deleteMessage';
import { buildSessionClosingMessage } from '../../../builders/startCommandComponents';
import { minTime } from 'date-fns/constants';
type Interaction = StringSelectMenuInteraction | ButtonInteraction;

export default async function startSelectHandler(
  interaction: Interaction,
  client: Client
) {
  if (!interaction.guildId) return;
  const [guildId, userId] = [interaction.guildId, interaction.user.id];

  const closeSession = async (data: ConfigState['data'], changed = true) => {
    if (changed) await serverService.updateServer(guildId, data);

    await interaction.reply({
      components: buildSessionClosingMessage(data),
      flags: ['IsComponentsV2'],
    });
    await interaction.message.delete();
    configSession.deleteSession(guildId, userId);
  };

  if (interaction.customId === 'SAVE-BTN' && interaction.isButton()) {
    const session = configSession.findSession(guildId, userId);

    if (session.completed) {
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

  if (interaction.customId === 'STUDY-CH-SELECT' && interaction.isStringSelectMenu()) {
    configSession.updateSession(guildId, userId, {
      studyChannels: interaction.values,
    });
    await interaction.deferUpdate();
    return;
  }

  if ((interaction.customId === 'REPORT-CH-SELECT', interaction.isStringSelectMenu())) {
    configSession.updateSession(guildId, userId, {
      reportChannel: interaction.values[0],
    });
    await interaction.deferUpdate();
    return;
  }

  if (interaction.customId.startsWith('TIME-BTN') && interaction.isButton()) {
    const value = Number(interaction.customId.slice(-1));
    if (isNaN(value)) return;
    const session = configSession.updateSession(guildId, userId, {
      minTime: value,
    });
    await interaction.deferUpdate();
  }
}

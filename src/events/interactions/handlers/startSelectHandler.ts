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

    const {
      reportChannel: defaultReportChannel,
      studyChannels: defaultStudyChannels,
      timezone,
      minTime,
    } = await serverService.findServer(guildId);

    const { reportChannel: inputReportChannel, studyChannels: inputStudyChannels } =
      session.data;
    const changed =
      defaultReportChannel === inputReportChannel &&
      defaultStudyChannels.length === inputStudyChannels.length &&
      inputStudyChannels.every((ch) => defaultStudyChannels.includes(ch));

    if (
      (inputReportChannel || defaultReportChannel) &&
      (inputStudyChannels.length || defaultStudyChannels.length)
    ) {
      closeSession(
        {
          reportChannel: inputReportChannel || defaultReportChannel,
          studyChannels: inputStudyChannels.length
            ? inputStudyChannels
            : defaultStudyChannels,
          timezone,
          minTime: session.data.minTime !== -1 ? session.data.minTime : minTime,
        },
        changed
      );
    } else {
      const response = await interaction.reply({
        content: `<@${userId}>, you can't save setting with data missing. Please fulfill all the fields`,
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
    const session = configSession.updateSession(guildId, userId, {
      studyChannels: interaction.values,
    });

    if (session.completed) {
      closeSession(session.data);
    } else {
      const response = await interaction.reply({
        content: `<@${userId}>, you successfully defined ${session.data.studyChannels
          .map((ch) => `<#${ch}>`)
          .join(
            ' '
          )} as your study channels, please finish filling the form or click save to send it  if already filled`,
        withResponse: true,
      });

      if (response.resource !== null && response.resource.message !== null) {
        const channelId = response.resource.message.channelId;
        const messageId = response.resource.message.id;
        setTimeout(() => deleteMessage(client, channelId, messageId), 4500);
      }
    }
    return;
  }

  if ((interaction.customId === 'REPORT-CH-SELECT', interaction.isStringSelectMenu())) {
    const session = configSession.updateSession(guildId, userId, {
      reportChannel: interaction.values[0],
    });

    if (session.completed) {
      closeSession(session.data);
    } else {
      const response = await interaction.reply({
        content: `<@${userId}>, you successfully defined <#${session.data.reportChannel}> as your report channel, please finish filling the form or click save to send it if already filled`,
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

  if (interaction.customId.startsWith('TIME-BTN') && interaction.isButton()) {
    const value = Number(interaction.customId.slice(-1));
    if (isNaN(value)) return;
    const session = configSession.updateSession(guildId, userId, {
      minTime: value,
    });
    await interaction.deferUpdate();
    console.log(session);
  }
}

import {
  type StringSelectMenuInteraction,
  type Client,
  SectionBuilder,
  TextDisplayBuilder,
  ButtonInteraction,
} from 'discord.js';
import serverService from '../../services/serverService';
import logger from '../../utils/logger';
import configSession from '../../utils/configSession';
import type { ConfigState } from '../../types';
import timezones from '../../config/timezones';
import deleteMessage from '../../utils/deleteMessage';

export default async function startSelectHandler(
  interaction: StringSelectMenuInteraction | ButtonInteraction,
  client: Client
) {
  if (!interaction.guildId) return;
  console.log('handler triggered');

  const closeSession = async (data: ConfigState['data'], changed = true) => {
    if (changed) await serverService.updateServer(interaction.guildId!, data);
    const components = [
      new SectionBuilder()
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            `## ✅ Configuration Saved Successfully! Your Studybot settings have been updated.\nHere’s the current configuration: \n**Report Channel:** ${`<#${data.reportChannel}>`}\n**Study Channels:** ${data.studyChannels
              .map((ch) => `\n• <#${ch}>`)
              .join(
                ' '
              )}\nYou can always run this command again if you need to update your settings. \nYour current timezone is **${
              timezones.find((tz) => tz.value === data.timezone)!.name
            }**. If you need to change it, please use _/set-timezone_ command.`
          )
        )
        .setThumbnailAccessory((thumbnail) =>
          thumbnail
            .setDescription('bot icon')
            .setURL('https://i.imgur.com/ls2IPmi.png')
        ),
    ];

    console.log(data);
    console.log(changed);
    await interaction.reply({ components, flags: ['IsComponentsV2'] });
    await interaction.message.delete();
    configSession.deleteSession(interaction.guildId!, interaction.user.id);
  };

  let session: ConfigState;
  if (interaction.customId === 'SAVE-BTN' && interaction.isButton()) {
    session = configSession.findSession(
      interaction.guildId,
      interaction.user.id
    );

    const {
      reportChannel: defaultReportChannel,
      studyChannels: defaultStudyChannels,
      timezone,
    } = await serverService.findServer(interaction.guildId);

    const {
      reportChannel: inputReportChannel,
      studyChannels: inputStudyChannels,
    } = session.data;
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
        },
        changed
      );
    } else {
      const response = await interaction.reply({
        content: `<@${interaction.user.id}>, you can't save setting with data missing. Please fulfill all the fields`,
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

  if (
    interaction.customId === 'STUDY-CH-SELECT' &&
    interaction.isStringSelectMenu()
  ) {
    console.log('study ch interaciton');
    session = configSession.updateSession(
      interaction.guildId,
      interaction.user.id,
      {
        studyChannels: interaction.values,
      }
    );
    if (session.completed) {
      closeSession(session.data);
    } else {
      const response = await interaction.reply({
        content: `<@${
          interaction.user.id
        }>, you successfully defined ${session.data.studyChannels
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

  if (
    (interaction.customId === 'REPORT-CH-SELECT',
    interaction.isStringSelectMenu())
  ) {
    console.log('set report ch interaciton');

    session = configSession.updateSession(
      interaction.guildId,
      interaction.user.id,
      {
        reportChannel: interaction.values[0],
      }
    );
    if (session.completed) {
      closeSession(session.data);
    } else {
      const response = await interaction.reply({
        content: `<@${interaction.user.id}>, you successfully defined <#${session.data.reportChannel}> as your report channel, please finish filling the form or click save to send it if already filled`,
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

  console.log(session!);
}

import {
  type VoiceChannel,
  type TextChannel,
  type Collection,
  TextDisplayBuilder,
  StringSelectMenuBuilder,
  ContainerBuilder,
  ActionRowBuilder,
  StringSelectMenuOptionBuilder,
  ButtonBuilder,
  ButtonStyle,
  SectionBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
} from 'discord.js';
import timezones from '../config/timezones';
import { ConfigState } from '../types';

interface BuildSessionStartMessageProps {
  voiceChannels: Collection<string, VoiceChannel>;
  currentChannels: string[];
  notDefaultTextChannels: Collection<string, TextChannel>;
  defaultTextChannel: TextChannel | undefined;
  selectedTime: number;
}

export function buildSessionStartMessage({
  voiceChannels,
  currentChannels,
  notDefaultTextChannels,
  defaultTextChannel,
  selectedTime,
}: BuildSessionStartMessageProps): (SectionBuilder | ContainerBuilder)[] {
  return [
    // Bloco de introdução
    new SectionBuilder()
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          "## Welcome to Studybot \n\nI'm here to help Discord communities organize and monitor study sessions. \nBut before we start, you need to configure some things:"
        )
      )
      .setThumbnailAccessory((thumbnail) =>
        thumbnail.setDescription('bot icon').setURL('https://i.imgur.com/ls2IPmi.png')
      ),

    // Container para Study Channels e Report Channel
    new ContainerBuilder()
      .setAccentColor(0x000000)

      // Study Channels
      .addTextDisplayComponents(new TextDisplayBuilder().setContent('### Study Channels'))
      .addActionRowComponents(
        new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
          new StringSelectMenuBuilder()
            .setCustomId('STUDY-CH-SELECT')
            .setPlaceholder('No Study Channels Selected')
            .setMaxValues(5)
            .setMinValues(1)
            .addOptions(
              voiceChannels.map((ch) =>
                new StringSelectMenuOptionBuilder()
                  .setValue(ch.id)
                  .setLabel(ch.name)
                  .setDefault(currentChannels.includes(ch.id))
              )
            )
        )
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          '_These are the voice channels that will be tracked for your study sessions_'
        )
      )

      .addSeparatorComponents(
        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(false)
      )

      // Report Channel
      .addTextDisplayComponents(new TextDisplayBuilder().setContent('### Report Channel'))
      .addActionRowComponents(
        new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
          new StringSelectMenuBuilder()
            .setCustomId('REPORT-CH-SELECT')
            .setPlaceholder('No Report Channel Selected')
            .addOptions([
              ...notDefaultTextChannels.map((ch) =>
                new StringSelectMenuOptionBuilder().setValue(ch.id).setLabel(ch.name)
              ),
              ...(defaultTextChannel
                ? [
                    new StringSelectMenuOptionBuilder()
                      .setLabel(defaultTextChannel.name)
                      .setValue(defaultTextChannel.id)
                      .setDefault(true),
                  ]
                : []),
            ])
        )
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          '_Choose the text channel where the logs of your study sessions will be sent_\n '
        )
      )

      .addSeparatorComponents(
        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(false)
      )

      // Min Time
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent('### Mininum Session Duration')
      )
      .addSeparatorComponents(
        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(false)
      )
      .addActionRowComponents(
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setStyle(
              'TIME-BTN_3'.endsWith(`${selectedTime}`)
                ? ButtonStyle.Primary
                : ButtonStyle.Secondary
            )
            .setDisabled('TIME-BTN_3'.endsWith(`${selectedTime}`))
            .setLabel('3min')
            .setCustomId('TIME-BTN_3'),
          new ButtonBuilder()
            .setStyle(
              'TIME-BTN_4'.endsWith(`${selectedTime}`)
                ? ButtonStyle.Primary
                : ButtonStyle.Secondary
            )
            .setDisabled('TIME-BTN_4'.endsWith(`${selectedTime}`))
            .setLabel('4min')
            .setCustomId('TIME-BTN_4'),
          new ButtonBuilder()
            .setStyle(
              'TIME-BTN_5'.endsWith(`${selectedTime}`)
                ? ButtonStyle.Primary
                : ButtonStyle.Secondary
            )
            .setDisabled('TIME-BTN_5'.endsWith(`${selectedTime}`))
            .setLabel('5min')
            .setCustomId('TIME-BTN_5'),
          new ButtonBuilder()
            .setStyle(
              'TIME-BTN_6'.endsWith(`${selectedTime}`)
                ? ButtonStyle.Primary
                : ButtonStyle.Secondary
            )
            .setDisabled('TIME-BTN_6'.endsWith(`${selectedTime}`))
            .setLabel('6min')
            .setCustomId('TIME-BTN_6'),
          new ButtonBuilder()
            .setStyle(
              'TIME-BTN_7'.endsWith(`${selectedTime}`)
                ? ButtonStyle.Primary
                : ButtonStyle.Secondary
            )
            .setDisabled('TIME-BTN_7'.endsWith(`${selectedTime}`))
            .setLabel('7min')
            .setCustomId('TIME-BTN_7')
        )
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          '_Sets the minimum time (in minutes) for a session to be valid and saved. Shorter sessions are ignored_\n '
        )
      )

      .addSeparatorComponents(
        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true)
      )
      // Botão Save
      .addActionRowComponents(
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setStyle(ButtonStyle.Success)
            .setLabel('Save')
            .setCustomId('SAVE-BTN')
        )
      ),
  ];
}

export function buildSessionClosingMessage(data: ConfigState['data']): SectionBuilder[] {
  return [
    new SectionBuilder()
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `## ✅ Configuration Saved Successfully! Your Studybot settings have been updated.\nHere’s the current configuration: \n**Report Channel:** ${`<#${data.reportChannel}>`}\n**Study Channels:** ${data.studyChannels
            .map((ch) => `\n• <#${ch}>`)
            .join(
              ' '
            )}\n\nYou can always run this command again if you need to update your settings. \n**${
            timezones.find((tz) => tz.value === data.timezone)?.name
          }** is your current timezone.\nIf you need to change it, please use _/set-timezone_ command.`
        )
      )
      .setThumbnailAccessory((thumbnail) =>
        thumbnail.setDescription('bot icon').setURL('https://i.imgur.com/ls2IPmi.png')
      ),
  ];
}

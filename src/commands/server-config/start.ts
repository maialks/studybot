import {
  TextDisplayBuilder,
  StringSelectMenuBuilder,
  ContainerBuilder,
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
  type Client,
  ActionRowBuilder,
  StringSelectMenuOptionBuilder,
  ButtonBuilder,
  ButtonStyle,
  SectionBuilder,
} from 'discord.js';
import serverService from '../../services/serverService';
import { startSession, deleteSession } from '../../utils/configSession';
import deleteMessage from '../../utils/deleteMessage';

export default {
  data: new SlashCommandBuilder()
    .setName('start')
    .setDescription('Quick config for your Discord bot'),

  async execute(interaction: ChatInputCommandInteraction, client: Client) {
    if (!interaction.guild || !interaction.guildId) return;
    const serverData = await serverService.findServer(interaction.guildId);
    console.log(serverData);
    const voiceChannels = interaction.guild.channels.cache.filter(
      (ch) => ch.type === 2
    );
    const textChannels = interaction.guild.channels.cache.filter(
      (ch) => ch.type === 0
    );

    const notDefaultTextChannels = textChannels.filter(
      (ch) => ch.id !== serverData.reportChannel
    );

    const defaultTextChannel = textChannels.get(serverData.reportChannel);
    const currentChannels = serverData.studyChannels;

    const components = [
      // Bloco de introdução
      new SectionBuilder()
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            "## Welcome to Studybot \n\nI'm here to help Discord communities organize and monitor study sessions. \n\nBefore we start, you need to configure some things like:\n • Channel where the sessions will be reported\n • Which voice channels will be tracked\n • Your server timezone"
          )
        )
        .setThumbnailAccessory((thumbnail) =>
          thumbnail
            .setDescription('bot icon')
            .setURL('https://i.imgur.com/ls2IPmi.png')
        ),

      // Container para Study Channels e Report Channel
      new ContainerBuilder()
        .setAccentColor(0x000000)

        // Study Channels
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent('### Study Channels')
        )
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

        // Report Channel
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent('### Report Channel')
        )
        .addActionRowComponents(
          new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            new StringSelectMenuBuilder()
              .setCustomId('REPORT-CH-SELECT')
              .setPlaceholder('No Report Channel Selected')
              .addOptions([
                ...notDefaultTextChannels.map((ch) =>
                  new StringSelectMenuOptionBuilder()
                    .setValue(ch.id)
                    .setLabel(ch.name)
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

    const response = await interaction.reply({
      components,
      flags: ['IsComponentsV2'],
      withResponse: true,
    });
    const guildId = interaction.guildId,
      userId = interaction.user.id;
    startSession(guildId, userId);
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

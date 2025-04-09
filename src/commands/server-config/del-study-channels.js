const { SlashCommandBuilder, ChannelType } = require('discord.js');
const Server = require('../../models/server');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remove-study-channels')
    .setDescription('remove one of the the channels')
    .addStringOption((option) =>
      option
        .setName('channel')
        .setDescription('Voice channel to remove')
        .setRequired(true)
        .setAutocomplete(true)
    ),

  async execute(interaction) {
    try {
      const targetChannelId = interaction.options.getString('channel');
      const targetChannel = await interaction.guild.channels.fetch(
        targetChannelId
      );

      const server = await Server.findOne({ serverId: interaction.guild.id });
      server.studyChannels = server.studyChannels.filter(
        (serverId) => serverId !== targetChannel.id
      );
      server.markModified('studyChannels');
      server.save();
      if (server.studyChannels.length === 0)
        return await interaction.reply(
          `<#${targetChannel.id}> was removed, no study channels are being tracked now, use /add-study-channels to add one`
        );
      const channelsList = server.studyChannels
        .map((id) => `• <#${id}>`)
        .join('\n');
      return await interaction.reply(
        `Study channels updated:\n${channelsList}\n \n<#${targetChannel.id}> was removed`
      );
    } catch (err) {
      console.error(err);
      return await interaction.reply(
        'An error occurred while removing the study channel.'
      );
    }
  },
};

const { SlashCommandBuilder, ChannelType } = require('discord.js');
const Server = require('../../models/server');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('add-study-channels')
    .setDescription('Choose up to 5 voice channels to track')
    .addChannelOption((option) =>
      option
        .setName('channel')
        .setDescription('Voice channel to track')
        .addChannelTypes(ChannelType.GuildVoice)
        .setRequired(true)
    ),

  async execute(interaction) {
    try {
      const channel = interaction.options.getChannel('channel');
      const serverId = channel.guildId;

      const server = await Server.findOne({ serverId });

      if (server?.studyChannels?.length >= 5) {
        return await interaction.reply(
          `You can only track 5 channels. Use \`/study-channels-remove\` to free up space.`
        );
      }

      if (server?.studyChannels.includes(channel.id)) {
        return await interaction.reply(
          `Channel <#${channel.id}> is already tracked. Use \`/study-channels-list\` to see all.`
        );
      }
      server.studyChannels.push(channel.id);
      server.markModified('studyChannels');
      await server.save();

      const channelsList = server.studyChannels
        .map((id) => `• <#${id}>`)
        .join('\n');
      return await interaction.reply(
        `Study channels updated:\n${channelsList}`
      );
    } catch (err) {
      console.error(err);
      return await interaction.reply(
        'An error occurred while adding the study channel.'
      );
    }
  },
};

const { SlashCommandBuilder, ChannelType } = require('discord.js');
const Server = require('../../models/server');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('list-study-channels')
    .setDescription('Displays wich channals are being tracked'),
  async execute(interaction) {
    try {
      const server = await Server.findOne({ serverId: interaction.guildId });
      if (server.studyChannels.length === 0)
        return interaction.reply(
          'No study channels are being tracked now, use /add-study-channels to add one'
        );
      const channelsList = server.studyChannels
        .map((id) => `• <#${id}>`)
        .join('\n');
      return await interaction.reply(`Study channels are:\n${channelsList}`);
    } catch (err) {
      console.error(err);
      return await interaction.reply(
        'An error occurred while fetching the study channels.'
      );
    }
  },
};

const { SlashCommandBuilder, ChannelType } = require('discord.js');
const Server = require('../../models/server');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('set-report-channel')
    .setDescription('choose the channel where timer logs will be sent')
    .addChannelOption((option) =>
      option
        .setName('channel')
        .setDescription('Choose one of the text channels')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    ),
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    const guild = await Server.findOneAndUpdate(
      { serverId: channel.guildId },
      { reportChannel: channel.id },
      { new: true }
    );
    // 1350284780666880045
    console.log('---------------');
    console.log(guild);

    await interaction.reply(`canal de report configurado para: ${channel}`);
  },
};

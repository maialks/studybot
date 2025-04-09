const { Events, ActivityType } = require('discord.js');

const clientReady = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log(`✅ ${client.user.tag} online!`);
    client.user.setActivity('Discord.js Guide', {
      type: ActivityType.Watching,
    });
  },
};

module.exports = clientReady;

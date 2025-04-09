const { createServer, deleteServer } = require('../services/server');

const joinGuild = {
  name: 'guildCreate',
  execute: async (guild) => {
    createServer(guild.id);
  },
};

const exitGuild = {
  name: 'guildDelete',
  execute: async (guild) => {
    deleteServer(guild.id);
  },
};

module.exports = {
  joinGuild,
  exitGuild,
};

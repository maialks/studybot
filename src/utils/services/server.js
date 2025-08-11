const Server = require('../models/server');

const createServer = async function (guildId) {
  const server = new Server({ serverId: guildId });
  await server.save();
  console.log('saved sucessfully');
};

const deleteServer = async function (guildId) {
  const deleted = await Server.findOneAndDelete({ serverId: guildId });
  if (!deleted) {
    console.error('Server not found in database');
  }
  console.error('deleted sucessfully');
};

module.exports = {
  createServer,
  deleteServer,
};

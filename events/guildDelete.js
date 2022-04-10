const servers = require("../models/servers.js");

module.exports = async (client, guild) => {
    let server = await  servers.findOne({guildID: guild.id})
    await server.deleteOne();
}
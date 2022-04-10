const servers = require("../models/servers.js");



module.exports = async (client, guild) => {
    new servers({
        antispam: "0",
        maxwarns: "3",
        levelsys: "1",
        guildID: guild.id,
        mutedrole: "String",
        prefix: "v!",
        welcome: "String",
        leave: "String",
        audit: "String",
        autorole: "String",
        antiraid: "0",
        welcomemsg: "String",
        leavemsg: "String",
        private: "String",
        botautorole: "String",
    }).save()
}

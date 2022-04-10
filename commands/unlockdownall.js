const servers = require("../models/servers")

module.exports.run = (client , message, args) => {
message.guild.channels.cache.map(channel => {
channel.updateOverwrite(message.guild.id, {
    SEND_MESSAGES: true
  })
})

message.channel.send("``🔒 Successfully all channels i have permissions in , is not at lockdown anymore!``")
servers.findOne({
    guildID: message.guild.id}, (err, res) => {
   let channel1 = message.guild.channels.cache.get(res.mod)
   if(channel1){
    channel1.send("``🔒 All channels i have permissions in , is not at lockdown anymore!``")
   }
   })

}

module.exports.help = {
    name: "unlockdownall",
    category: "moderation",
    aliases: ['unldall'],
    description: "If all channels in lockdown , unlock it",
    example: "``unlockdownall``"
}

module.exports.requirements = {
    userPerms: ["MANAGE_CHANNELS"],
    clientPerms: ["MANAGE_CHANNELS"],
    ownerOnly: false
}

module.exports.limits = {
    rateLimit: 2,
    cooldown: 1e4
}
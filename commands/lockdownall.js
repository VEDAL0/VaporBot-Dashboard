const servers = require("../models/servers")

module.exports.run = (client , message, args) => {
message.guild.channels.cache.map(channel => {
channel.updateOverwrite(message.guild.id, {
    SEND_MESSAGES: false
  })
})

message.channel.send("``🔒 Successfully all the channels at lockdown!``")
servers.findOne({
    guildID: message.guild.id}, (err, res) => {
   let channel1 = message.guild.channels.cache.get(res.mod)
   if(channel1){
    channel1.send("``🔒 All channels i have permissions in , is at lockdown!``")
   }
   })

}

module.exports.help = {
    name: "lockdownall",
    category: "moderation",
    aliases: ['ldall'],
    description: "No one can talk in call hannel , if there's raid!",
    example: "``lockdownall``"
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
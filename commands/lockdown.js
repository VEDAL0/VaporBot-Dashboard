const servers = require("../models/servers")

module.exports.run = (client , message, args) => {
let channelargs = args.slice(0).join(" ")
let channel = message.mentions.channels.first() || message.guild.channels.cache.get(channelargs) || message.guild.channels.cache.find(c => c.name === channelargs)
if(!channel) channel = message.channel
channel.updateOverwrite(message.guild.id, {
    SEND_MESSAGES: false
  })

message.channel.send("🔒 Successfully ``" + channel.name + "`` at lockdown now!")
servers.findOne({
    guildID: message.guild.id}, (err, res) => {
   let channel1 = message.guild.channels.cache.get(res.mod)
   if(channel1){
    channel1.send('🔒 ``' + channel.name + "`` is at lockdown by ``" + message.author.tag + "``")
   }
   })

}

module.exports.help = {
    name: "lockdown",
    category: "moderation",
    aliases: ['ld'],
    description: "No one can talk in channel , if there's raid!",
    example: "``lockdown [#channel]``"
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
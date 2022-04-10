const servers = require("../models/servers")

module.exports.run = (client , message, args) => {
    let time = 0;
    if(args[0].endsWith("s")){
        time = args[0].split("s")[0] * 1
    }else if(args[0].endsWith("m")){
        time = args[0].split("m")[0] * 60
    }else if(args[0].endsWith("h")){
        if(args[0].split("h")[0] > 6){
            return message.reply("❌ Can't be more than 6 hours!")
        }
time = args[0].split("h")[0] * 3600
    }else{
        return message.reply("❌ Wrong usage try do: \n``slowmode 5s``")
    }
    let channelargs = args.slice(1).join(" ")
    let channel = message.mentions.channels.first() || message.guild.channels.cache.get(channelargs) || message.guild.channels.cache.find(c => c.name === channelargs)
if(!channel){
    channel = message.channel
}
channel.setRateLimitPerUser(time)
message.channel.send("⏳ Successfully added slowmode with " + args[0] + " per message , at **" + channel.name + "**")
servers.findOne({
    guildID: message.guild.id}, (err, res) => {
   let channel1 = message.guild.channels.cache.get(res.mod)
   if(channel1){
    channel1.send("⏳ Slowmode has been set with " + args[0] + " per message , at **" + channel.name + "**" + " by ``" + message.author.tag + "``")
   }
   })


}

module.exports.help = {
    name: "slowmode",
    category: "moderation",
    aliases: ['sm'],
    description: "Set slow mode for channel",
    example: "``slowmode <time(m,s,h)> [#channel]``"
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
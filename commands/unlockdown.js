const servers = require("../models/servers")

module.exports.run = (client , message, args) => {
    let channelargs = args.slice(0).join(" ")
    let channel = message.mentions.channels.first() || message.guild.channels.cache.get(channelargs) || message.guild.channels.cache.find(c => c.name === channelargs)
    if(!channel) channel = message.channel
    channel.updateOverwrite(message.guild.id, {
        SEND_MESSAGES: true
      })
    servers.findOne({
        guildID: message.guild.id}, (err, res) => {
       let channel1 = message.guild.channels.cache.get(res.mod)
       if(channel1){
        channel1.send('🔓 ``' + channel.name + "`` is not at lockdown anymore by ``" + message.author.tag + "``")
       }
       })
    message.channel.send("🔓 Successfully ``" + channel.name + "`` is not at lockdown now!")
    
    
    }
    
    module.exports.help = {
        name: "unlockdown",
        category: "moderation",
        aliases: ['uld'],
        description: "Unlock channel if its at lockdown!",
        example: "``unlockdown [#channel]``"
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
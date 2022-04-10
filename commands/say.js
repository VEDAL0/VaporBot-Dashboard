module.exports.run = (client , message, args) => {
    if(!args[0]) return message.reply('❌ Please define channel!')
    if(!args[1]) return message.reply('❌ Please define message!')
    let argsresult;
    let mChannel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
    if(!mChannel) return message.reply("❌ Unknown Channel , Please mention it or put id")
    message.delete()
    if(mChannel) {
        argsresult = args.slice(1).join(" ")
        mChannel.send(argsresult)
    } else {
        argsresult = args.join(" ")
        message.channel.send(argsresult)
    }
}

module.exports.help = {
    name: "say",
    category: "moderation",
    aliases: ['new'],
    description: "Send messages to specific channels by bot!",
    example: "``say <channel_id> <message>``"
}

module.exports.requirements = {
    userPerms: ["MANAGE_MESSAGES"],
    clientPerms: ["MANAGE_CHANNELS"],
    ownerOnly: false
}

module.exports.limits = {
    rateLimit: 2,
    cooldown: 1e4
}
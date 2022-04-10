const { MessageEmbed } = require("discord.js")



module.exports.run = (client , message, args) => {
let thechannel = args.slice(0).join(" ")
if(!thechannel) return message.reply("❌ Please define channel name or mention or id!")
let channel = message.mentions.channels.first() || message.guild.channels.cache.get(thechannel) || message.guild.channels.cache.find(r => r.name === thechannel)
if(!channel) return message.channel.send("❌ Seems like i can't find that channel")
let topic = "No topic for this channel"
if(channel.topic){
    topic = channel.topic
}
let embed = new MessageEmbed()
.setAuthor(`🌐 ${channel.name}` + ` (${channel.id})`, client.user.displayAvatarURL())
.setDescription(`\`Name: ${channel.name}\nID: ${channel.id}\nType: ${channel.type}\nDeleted: ${channel.deleted}\nPosition: ${message.guild.channels.cache.filter(c => c.type == channel.type).size - channel.position}\nTopic: ${topic}\``)
.setFooter("Channel created at " + channel.createdAt.toLocaleString())
message.channel.send(embed)
}

module.exports.help = {
    name: "channel",
    category: "info",
    aliases: ['channelinfo'],
    description: "Show information about roles!",
    example: "``channel <#channel>``"
}

module.exports.requirements = {
    userPerms: [],
    clientPerms: ['EMBED_LINKS'],
    ownerOnly: false
}

module.exports.limits = {
    rateLimit: 2,
    cooldown: 1e4
}
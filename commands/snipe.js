const { MessageEmbed } = require("discord.js")

module.exports.run = (client , message, args) => {
if (client.snipe.has(message.guild.id)) {
    let embed = new MessageEmbed()
    embed.setAuthor("✅ Snipe", client.user.displayAvatarURL({dynamic: true}))
    if(client.snipe[message.guild.id].message){
        embed.addField(`Snipe: `, `\`\`\`javascript\n${client.snipe[message.guild.id].message}\n\`\`\``)
    }
    embed.addField(`Message Sender: `, client.snipe[message.guild.id].name)
    embed.addField(`Channel: `, client.snipe[message.guild.id].channel)
    embed.addField("Sniped By:", `${message.author.tag}`)
    embed.setFooter("Deleted at: " + client.snipe[message.guild.id].time)
    if(client.snipe[message.guild.id].image){
        embed.setImage(client.snipe[message.guild.id].image)
    }
    return message.channel.send(embed);
  }
let embed1 = new MessageEmbed()
embed1.setDescription("``❌ No deleted messages``")
return message.channel.send(embed1)
}

module.exports.help = {
    name: "snipe",
    category: "moderation",
    aliases: [],
    description: "Snipe last deleted message or images!",
    example: "``snipe``"
}

module.exports.requirements = {
    userPerms: ["MANAGE_MESSAGES"],
    clientPerms: ["EMBED_LINKS"],
    ownerOnly: false
}

module.exports.limits = {
    rateLimit: 2,
    cooldown: 1e4
}
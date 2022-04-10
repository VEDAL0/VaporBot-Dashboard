const { MessageEmbed } = require("discord.js")
const cases = require("../models/cases")
const servers = require("../models/servers")

module.exports.run = (client , message, args) => {
    let userses = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if(!userses) return message.reply("❌ Seems like i can't find that user!")
        if(userses.user.bot) {
        return message.channel.send("❌ You can't resetwarns of bot!")
    }
    if(userses.roles.highest.position >= message.member.roles.highest.position){
        return message.channel.send("❌ You can't resetwarns of person have roles higher than or same to you!")
   }
        cases.find({
            serverID: message.guild.id,
            action: "Warn",
            userID: userses.id}, (err, res) => {
                if(res.length === 0){
                    return message.reply("❌ That user doesn't have any warns to reset!")
                }
                res.forEach(warns => {
                    warns.deleteOne()
                })
     message.channel.send(`✅ Successfully reseted warns of **${userses.user.tag}**`)
     servers.findOne({
        guildID: message.guild.id}, (err, res) => {
       let channel = message.guild.channels.cache.get(res.mod)
       if(channel){
        channel.send(`✅ Warns of **${userses.user.username}** has been reseted by **${message.author.tag}**`)
       }
       })
        })
}


module.exports.help = {
    name: "resetwarns",
    category: "moderation",
    aliases: ['rwarns'],
    description: "reset all warns of the user!",
    example: "``resetwarns <@user>``"
}

module.exports.requirements = {
    userPerms: ["MANAGE_GUILD"],
    clientPerms: ['EMBED_LINKS','SEND_MESSAGES'],
    ownerOnly: false
}

module.exports.limits = {
    rateLimit: 2,
    cooldown: 1e4
}
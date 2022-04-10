const { MessageEmbed } = require("discord.js")
const cases = require("../models/cases")
const servers = require("../models/servers")
module.exports.run = (client , message, args) => {
if(!args[0]) return message.reply("❌ Please define case number\n``reason <case_number> <new_reason>``")
if(!args[1]) return message.reply("❌ Please define the new reason")
cases.findOne({
serverID: message.guild.id,
case: args[0]}, (err , res) => {
    if(!res){
        return message.reply("Can't find that case!")
    }
        let reason = '';
        let newreason = args.slice(1).join(" ")
        if(res.reason == ''){
            reason = 'No reason Provided'
        }else{
            reason = res.reason
        }
    let embed = new MessageEmbed()
    embed.setAuthor("✏️ Case Number #" + args[0], message.guild.iconURL({dynamic: true}))
    embed.setDescription("Editing reason of case number " + args[0])
    embed.addField("Old Reason: ", "``" + reason + "``")
    res.reason = newreason
    res.save()
    embed.addField("New Reason: ",  "``" + res.reason + "``", true)
    embed.setFooter("Changed by " + message.author.tag, message.author.displayAvatarURL({dynamic: true}))
    message.channel.send(embed)
    servers.findOne({
        guildID: message.guild.id}, (err, res) => {
       let channel = message.guild.channels.cache.get(res.mod)
       if(channel){
        channel.send(`✏️ Reason of case number \`#${args[0]}\` has been changed by **${message.author.tag}**`)
       }
       })
        })
}


module.exports.help = {
    name: "reason",
    category: "moderation",
    aliases: ["changereason", 'creason'],
    description: "Change reason of an old case!",
    example: "``reason <case_number> <new_reason>``"
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
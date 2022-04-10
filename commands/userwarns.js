const { MessageEmbed } = require("discord.js")
const cases = require("../models/cases")

module.exports.run = (client , message, args) => {
    let theuser = args.slice(0).join(" ")
    let userses = message.mentions.users.first() || client.users.cache.get(theuser) || client.users.cache.find(u => u.username === theuser);
    if(!userses){
        let embed = new MessageEmbed()
        .setTitle("❌ Invalid Usage")
        .addField("**Note**", "Maybe that user isn\'t in the server")
        .setDescription("**Right Usage**\n ``userwarns <@user>``\n``userwarns <user_id>``\n``userwarns <user_name>``")
        .setFooter("< Required Parameters >")
         .setColor("BLACK")
return message.channel.send(embed)
    }
    if(userses.bot) {
        return message.channel.send("❌ Bots doesn't have warns!")
    }
    cases.find({
        serverID: message.guild.id,
        action: "Warn",
        userID: userses.id}, (err, res) => {
                let embed2 = new MessageEmbed()
                .setTitle(`📃 ${userses.username}` + " Infractions!")
                .setColor("#4000FF")
                .setAuthor(`${userses.username}`, userses.displayAvatarURL({dynamic: true}))
                if(!res){
                    embed2.addField("Warns", "0", true);
                    return message.channel.send(embed2);
                }else{
                    embed2.addField("Warns", res.length, true);
                    return message.channel.send(embed2)
                }
        })
}


module.exports.help = {
    name: "userwarns",
    category: "moderation",
    aliases: ['uwarns', 'infractions'],
    description: "Check user infractions!",
    example: "``userwarns <@user>``"
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
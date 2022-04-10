const { MessageEmbed } = require("discord.js");
const cases = require("../models/cases")
const servers = require("../models/servers")
const moment = require('moment')


module.exports.run = (client , message, args) => {
if (!args[0]) return message.reply('**Please provide a user for the action!**')
let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
if(user.roles.highest.position >= message.member.roles.highest.position){
    return message.channel.send("You can't kick to person have roles higher than or same to you!")
}
let rreason = args.slice(1).join(" ");
if(!user) return message.channel.send("Seems like i can't fine that user!")
if (!rreason) {
    rreason = "No reason provided!"
}
if (user) {
    const member = message.guild.member(user);

    if (member) {
        member.kick('You Was Kicked For Reason')
        .then(() => {
            servers.findOne({
                guildID: message.guild.id}, (err, res) => {
               let channel = message.guild.channels.cache.get(res.mod)
               if(channel){
                   channel.send(`👢 **${member.user.tag}** has been kicked from server by **${message.author.tag}**.\nReason: **${rreason}**`)
               }
               })
            message.channel.send(`👢 Successfully Kicked **${member.user.tag}**.\nReason: **${rreason}**`)
             cases.find({
                serverID: message.guild.id
                    }).sort([
                      ['descending']
                    ]).exec((err, res) => {
                let cases1 = new cases({
                    userID: member.id,
                    reason: rreason,
                    action: "Kick",
                    Moderator: message.author.id,
                    serverID: message.guild.id,
                    time: moment(message.createdAt).format('MM/DD/YYYY HH:mm:ss A'),
                    case: res.length + 1
                })
                cases1.save()
                let embed = new MessageEmbed()
                .setAuthor(`${message.guild.name} | Kick`, message.guild.iconURL({dynamic: true}))
                .setColor("RED")
                .setDescription(`Case Number: \`#${res.length}\` \nModerator: **${message.author.tag}** (\`${message.author.id}\`) \nAllegation: **${member.user.tag}** (\`${member.id}\`)`)
                .addField("**Reason**", rreason)
                .setFooter(moment(message.createdAt).format('MM/DD/YYYY HH:mm:ss A'))
                member.send(embed).catch(() => {})
                })
        })
        .catch(() => message.reply('I was unable to kick the member. Check if their roles are higher then mine or if they have administrative permissions!'));
    }
} else {
    message.reply('**You Need To Specify A Person**')
}

}


module.exports.help = {
    name: "kick",
    category: "moderation",
    aliases: [],
    description: "kicks user from the server",
    example: "``kick <user_id> [reason]``"
}

module.exports.requirements = {
    userPerms: ["KICK_MEMBERS"],
    clientPerms: ["KICK_MEMBERS"],
    ownerOnly: false
}

module.exports.limits = {
    rateLimit: 2,
    cooldown: 1e4
}
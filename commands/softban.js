const { MessageEmbed } = require("discord.js");
const cases = require("../models/cases")
const servers = require("../models/servers")
const moment = require('moment')

module.exports.run = (client , message, args) => {
    if(!args[0]) return message.reply("**❌ Please provide user for the action!**")
    let banMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]) 
    if(!banMember) return message.channel.send("❌ Seems like i can't find the user!")
    let reason = args.slice(1).join(" ");
    if(!reason) reason = "No reason provided!"
    if(banMember.roles.highest.position >= message.member.roles.highest.position){
        return message.channel.send("❌ You can't softban person have roles higher than or same to you!")
   }
    message.guild.members.ban(banMember ,{ days: 1, reason: reason})
    .then(() => {
        message.guild.members.unban(banMember.id, { reason: "Softban"}, 
        message.channel.send(`👢 **${banMember.user.tag}** has been Softbanned by **${message.author.tag}**\nReason: **${reason}**`))
        servers.findOne({
            guildID: message.guild.id}, (err, res) => {
           let channel = message.guild.channels.cache.get(res.mod)
           if(channel){
            channel.send(`👢 **${banMember.user.tag}** has been Softbanned by **${message.author.tag}**\nReason: **${reason}**`)
           }
           })
        cases.find({
            serverID: message.guild.id
                }).sort([
                  ['descending']
                ]).exec((err, res) => {
            let cases1 = new cases({
                userID: banMember.user.id,
                reason: reason,
                action: "SoftBan",
                Moderator: message.author.id,
                serverID: message.guild.id,
                time: moment(message.createdAt).format('MM/DD/YYYY HH:mm:ss A'),
                case: res.length + 1
            })
            cases1.save()
            let embed = new MessageEmbed()
            .setAuthor(`${message.guild.name} | SoftBan`, message.guild.iconURL({dynamic: true}))
            .setColor("RED")
            .setDescription(`Case Number: \`#${res.length}\` \nModerator: **${message.author.tag}** (\`${message.author.id}\`) \nAllegation: **${banMember.user.tag}** (\`${banMember.user.id}\`)`)
            .addField("**Reason**", reason)
            .setFooter(moment(message.createdAt).format('MM/DD/YYYY HH:mm:ss A'))
            banMember.send(embed).catch(() => {})
        })
    })
        .catch(() => message.reply('I was unable to softban the member. Check if their roles are higher then mine or if they have administrative permissions!'))
}

module.exports.help = {
    name: "softban",
    category: "moderation",
    aliases: ['sban'],
    description: "Ban user then unban him to remove his all message in servers\nhelps in adversting of people!",
    example: "``softban <user_id> [reason]``\n``softban <@user> [reason]``"
}

module.exports.requirements = {
    userPerms: ["BAN_MEMBERS"],
    clientPerms: ["BAN_MEMBERS"],
    ownerOnly: false
}

module.exports.limits = {
    rateLimit: 2,
    cooldown: 1e4
}
const { MessageEmbed } = require("discord.js");
const cases = require("../models/cases")
const servers = require("../models/servers")
const moment = require('moment')

module.exports.run = async (client , message, args) => {
    if(!args[0]) return message.reply("**Please provide a user for the action!**")
  let reason = args.slice(1).join(" ")
  if(!reason){
      reason = "No reason provided!"
  }
  client.users.fetch(args[0]).then(async member => {
      if(!member) return message.reply("Seems like i can't find that user!")
      if(message.guild.members.cache.get(member.id)) return message.reply("Use the default ban command , that user already exists at server!")
      const guildBans = await message.guild.fetchBans();
      if(guildBans.has(member.id)){
          return message.reply("That user is already banned!")
        }else{
            message.guild.members.ban(member, reason).then(() => {
            message.channel.send(`👢 **${member.tag}** has been hack banned by **${message.author.tag}**\nReason: **${reason}**`)
            servers.findOne({
                guildID: message.guild.id}, (err, res) => {
               let channel = message.guild.channels.cache.get(res.mod)
               if(channel){
                channel.send(`👢 **${member.tag}** has been hack banned by **${message.author.tag}**\nReason: **${reason}**`)
               }
               })
            cases.find({
                serverID: message.guild.id
                    }).sort([
                      ['descending']
                    ]).exec((err, res) => {
                let cases1 = new cases({
                    userID: member.id,
                    reason: reason,
                    action: "HackBan",
                    Moderator: message.author.id,
                    serverID: message.guild.id,
                    time: moment(message.createdAt).format('MM/DD/YYYY HH:mm:ss A'),
                    case: res.length + 1
                })
                cases1.save()
                let embed = new MessageEmbed()
                .setAuthor(`${message.guild.name} | HackBan`, message.guild.iconURL({dynamic: true}))
                .setColor("RED")
                .setDescription(`Case Number: \`#${res.length}\` \nModerator: **${message.author.tag}** (\`${message.author.id}\`) \nAllegation: **${member.tag}** (\`${member.id}\`)`)
                .addField("**Reason**", reason)
                .setFooter(moment(message.createdAt).format('MM/DD/YYYY HH:mm:ss A'))
                member.send(embed).catch(() => {})
            })
        })
      }

  })
}

module.exports.help = {
    name: "hackban",
    category: "moderation",
    aliases: ['hban'],
    description: "Ban a user, when they are not in the server to be safe if they ever try to join again!",
    example: "``hackban <user_id> [reason]``"
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
const { MessageEmbed } = require("discord.js");
const cases = require("../models/cases")
const servers = require("../models/servers")
const moment = require('moment')

module.exports.run = async (client , message, args) => {
  if(!args[0]) return message.reply("**❌ Please provide a user for the action!**")
    let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if(!user) return message.channel.send("❌ Seems like i can't find that user!")
    if(user.roles.highest.position >= message.member.roles.highest.position){
      return message.channel.send("❌ You can't ban person have roles higher than or same to you!")
 }
    if (user) {
      const guildBans = await message.guild.fetchBans();
      if(guildBans.has(user.id)){
          return message.reply("❌ That user is already banned!")
      }
      const member = message.guild.member(user);
      let reason = args.slice(1).join(" ")
      if(!reason){
        reason = 'No reason Provided!'
      }
      if (member) {
       
        member.ban({
          reason: reason,
        }).then(() => {
          servers.findOne({
            guildID: message.guild.id}, (err, res) => {
           let channel = message.guild.channels.cache.get(res.mod)
           if(channel){
            channel.send(`👢 **${member.user.tag}** has been banned by **${message.author.tag}**.\nReason **${reason}**`)
           }
           })
          message.channel.send(`👢 Successfully banned **${member.user.tag}**.\nReason **${reason}**`);
          cases.find({
            serverID: message.guild.id
                }).sort([
                  ['descending']
                ]).exec((err, res) => {
            let cases1 = new cases({
                userID: member.id,
                reason: reason,
                action: "Ban",
                Moderator: message.author.id,
                serverID: message.guild.id,
                time: moment(message.createdAt).format('MM/DD/YYYY HH:mm:ss A'),
                case: res.length + 1
            })
            cases1.save()
            let embed = new MessageEmbed()
            .setAuthor(`${message.guild.name} | Ban`, message.guild.iconURL({dynamic: true}))
            .setColor("RED")
            .setDescription(`Case Number: \`#${res.length}\` \nModerator: **${message.author.tag}** (\`${message.author.id}\`) \nAllegation: **${member.user.tag}** (\`${member.id}\`)`)
            .addField("**Reason**", reason)
            .setFooter(moment(message.createdAt).format('MM/DD/YYYY HH:mm:ss A'))
            member.send(embed).catch(() => {})
            })
        }).catch(err => {
          message.reply('I was unable to ban the member. Check if their roles are higher than mine or if they have administrative permissions!');
        });
      } else {
        message.reply('That user isn\'t in this guild!');
      }
    } else {
      message.reply('That user isn\'t in this guild!');
    }
}

module.exports.help = {
    name: "ban",
    category: "moderation",
    aliases: [],
    description: "Ban user from the server",
    example: "``ban <user_id> [reason]``"
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
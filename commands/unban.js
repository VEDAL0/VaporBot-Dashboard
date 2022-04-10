const { MessageEmbed } = require("discord.js")
const cases = require("../models/cases")
const servers = require("../models/servers")
const moment = require('moment')

module.exports.run = async (client , message, args) => {
    if(!args[0]) {
        let embed = new MessageEmbed()
        .setTitle("❌ Invalid Usage")
        .setDescription("**Right Usage**\n ``unban <user_id>``")
        .setFooter("< Required Parameters >")
        return message.channel.send(embed)
    }
  if(isNaN(args[0])){
      return message.channel.send("❌ Only by id!")
  }
  let test = args[0]
  if(test.length !== 18){
      return message.channel.send("❌ That's not id!")
  }
  const guildBans = await message.guild.fetchBans();
  if(guildBans.has(args[0])){
    const banuser = await client.users.fetch(args[0])
    message.guild.members.unban(banuser)
      message.channel.send(`✅ Successfully unbanned **${banuser}** from this server!`) 
      servers.findOne({
        guildID: message.guild.id}, (err, res) => {
       let channel = message.guild.channels.cache.get(res.mod)
       if(channel){
        channel.send(`✅ ${banuser} is unbanned by  **${message.author.tag}**`)
       }
       })
      cases.find({
        serverID: message.guild.id
            }).sort([
              ['descending']
            ]).exec((err, res) => {
        let cases1 = new cases({
            userID: args[0],
            reason: "No reason Provided!",
            action: "UnBan",
            Moderator: message.author.id,
            serverID: message.guild.id,
            time: moment(message.createdAt).format('MM/DD/YYYY HH:mm:ss A'),
            case: res.length + 1
        })
        cases1.save()
        let embed = new MessageEmbed()
        .setAuthor(`${message.guild.name} | Unban`, message.guild.iconURL({dynamic: true}))
        .setColor("GREEN")
        .setDescription(`Case Number: \`#${res.length}\` \nModerator: **${message.author.tag}** (\`${message.author.id}\`) \nAllegation: **${banuser.tag}** (\`${args[0]}\`)`)
        .setFooter(moment(message.createdAt).format('MM/DD/YYYY HH:mm:ss A'))
        banuser.send(embed).catch(() => {})
    })
  }else{
    return message.reply("That user is not banned!")
}
}

module.exports.help = {
    name: "unban",
    category: "moderation",
    aliases: ['uban'],
    description: "Unban user from the server!",
    example: "``unban <user_id>``"
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
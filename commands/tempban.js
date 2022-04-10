const CLOCK = require("../models/clock")
const servers = require("../models/servers");
const { MessageEmbed } = require("discord.js");
const cases = require("../models/cases")
const moment = require('moment')

module.exports.run = async (client , message, args) => {
    if(!args[0]) return message.reply("**❌ Please provide a user for the action!**")
    if(!args[1]) return message.reply("**❌ Please provide time (amount[minutes - hour - day- week])**")
    let tempuser = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if(!tempuser) return message.reply("Seems like i can't find that user!")
    if(!message.guild.members.cache.get(tempuser.user.id)) return message.reply("Seems like i can't find that user!")
    let usertime = require("ms")(args[1])
    if(usertime == undefined) return message.reply("Unknown date format try use (1m - 1h - 1d - 1w)")
    if(usertime <= 180000) return message.reply("Time can't be less or equal to 3 minutes!")
    let reason = args.slice(2).join(" ")
    if(!reason) reason = 'No reason provided!'
    if(tempuser.roles.highest.position >= message.member.roles.highest.position){
        return message.channel.send("❌ You can't temp ban person have roles higher than or same to you!")
    }
    servers.findOne({
guildID: message.guild.id}, async (err, serverman) => {
    if(!serverman) return message.reply("Error occured while excuting command!")
CLOCK.findOne({
    userID: tempuser.user.id,
    action: "TempBan",
    serverID: message.guild.id}, async (err, res) => {
if(res) {
    return message.reply(`:x: **${tempuser.user.tag}** is already temp banned!`)
}else{
let newaction = new CLOCK({
    userID: tempuser.user.id,
    time: usertime,
    timenow: Date.now(),
    action: "TempBan",
    serverID: message.guild.id
})
await newaction.save()
cases.find({
    serverID: message.guild.id
        }).sort([
          ['descending']
        ]).exec((err, res1) => {
    let cases1 = new cases({
        userID: tempuser.user.id,
        reason: reason,
        action: "TempBan",
        Moderator: message.author.id,
        serverID: message.guild.id,
        time: moment(message.createdAt).format('MM/DD/YYYY HH:mm:ss A'),
        case: res1.length + 1,
        duration: args[1]
    })
    cases1.save()
    let embed = new MessageEmbed()
    .setAuthor(`${message.guild.name} | TempBan`, message.guild.iconURL({dynamic: true}))
    .setColor("RED")
    .setDescription(`Case Number: \`#${res1.length}\` \nModerator: **${message.author.tag}** (\`${message.author.id}\`) \nAllegation: **${tempuser.user.tag}** (\`${tempuser.user.id}\`) \nDuration: \`${args[1]}\` `)
    .addField("**Reason**", reason)
    .setFooter(moment(message.createdAt).format('MM/DD/YYYY HH:mm:ss A'))
    tempuser.user.send(embed).catch(() => {})
    })
let member = message.guild.members.cache.get(tempuser.user.id)
let banmember = message.guild.member(member)
banmember.ban({
    reason: reason,
  }).then(() => {
    message.channel.send(`👢 Successfully **${tempuser.user.tag}** has been temp banned for **${args[1]}** !\nReason: **${reason}**`)
  })
.catch(() => {})
let channel = message.guild.channels.cache.get(serverman.mod)
if(channel) {
    channel.send(`👢 **${tempuser.user.tag}** has been temp banned for ${args[1]} ! , by **${message.author.tag}**\nReason: **${reason}**`)
}
}
})
})
    }
module.exports.help = {
    name: "tempban",
    category: "moderation",
    aliases: ['tban'],
    description: "Temp ban user and unban him after period of time!",
    example: "``tempban <@user> <time(m - h - d - w)> [reason]``"
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
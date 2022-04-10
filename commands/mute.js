const { MessageEmbed } = require("discord.js")
const servers = require("../models/servers")
const cases = require("../models/cases")
const CLOCK = require("../models/clock")
const moment = require('moment')

module.exports.run = (client , message, args) => {
    if(!args[0]) return message.reply("**❌ Please provide a user for the action!**")
    servers.findOne({
        guildID: message.guild.id}, (err , welchannel) => {
    if(welchannel.mutedrole === "String"){
        return message.channel.send("❌ You should configure muted role by from dashboard <https://vaporbot.xyz/>")
    }
    if(!message.guild.roles.cache.get(welchannel.mutedrole)){
        return message.channel.send("❌ I can't find the mute role try set another one from dashboard <https://vaporbot.xyz/>")
    }
let member1 = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
if(!member1) return message.channel.send("❌ Seems like i can't find the user!")
CLOCK.findOne({
    userID: member1.user.id,
    action: "Mute",
    serverID: message.guild.id}, async (err, res) => {
if(res) {
    return message.reply(`:x: **${tempuser.user.tag}** is already muted!`)
}else{
if(member1.roles.highest.position >= message.member.roles.highest.position){
    return message.channel.send("❌ You can't mute person have roles higher than or same to you!")
}
let reason = args.slice(1).join(" ")
if(!reason) reason = 'No reason provided!'
let role1 = message.guild.roles.cache.get(welchannel.mutedrole);
if(role1.position >= message.guild.me.roles.highest.position) return message.channel.send("Mute role is higher than my role or same to me!")
member1.roles.add(role1).catch(console.error).then(message.channel.send('🔇 Successfully Muted **' + member1.user.tag + '** , Reason: ``' + reason + "``"))
let newaction = new CLOCK({
    userID: member1.user.id,
    time: 00000,
    timenow: 00000,
    action: "Mute",
    serverID: message.guild.id
})
await newaction.save()
servers.findOne({
    guildID: message.guild.id}, (err, res) => {
   let channel = message.guild.channels.cache.get(res.mod)
   if(channel){
    channel.send('🔇 ``' + member1.user.tag + "`` has been muted by ``" + message.author.tag + "`` , Reason: ``" + reason + "``")
   }
   })

cases.find({
    serverID: message.guild.id
        }).sort([
          ['descending']
        ]).exec((err, res) => {
    let cases1 = new cases({
        userID: member1.user.id,
        reason: reason,
        action: "Mute",
        Moderator: message.author.id,
        serverID: message.guild.id,
        time: moment(message.createdAt).format('MM/DD/YYYY HH:mm:ss A'),
        case: res.length + 1
    })
    cases1.save()
    let embed = new MessageEmbed()
    .setAuthor(`${message.guild.name} | Mute`, message.guild.iconURL({dynamic: true}))
    .setColor("RED")
    .setDescription(`Case Number: \`#${res.length}\` \nModerator: **${message.author.tag}** (\`${message.author.id}\`) \nAllegation: **${member1.user.tag}** (\`${member1.user.id}\`)`)
    .addField("**Reason**", reason)
    .setFooter(moment(message.createdAt).format('MM/DD/YYYY HH:mm:ss A'))
    member1.send(embed).catch(() => {})
    })
}
})
})
}

module.exports.help = {
    name: "mute",
    category: "moderation",
    aliases: [],
    description: "Mute members from server",
    example: "``mute <@user> [reason]``"
}

module.exports.requirements = {
    userPerms: ["KICK_MEMBERS"],
    clientPerms: ["MANAGE_ROLES"],
    ownerOnly: false
}

module.exports.limits = {
    rateLimit: 2,
    cooldown: 1e4
}
const { MessageEmbed } = require("discord.js")
const cases = require("../models/cases")

module.exports.run = (client , message, args) => {
    if(!args[0]) return message.reply("❌ Invalid Usage Do: ``check <user_id>``\n``check <@user>``")
    let theuser = args.slice(0).join(" ")
    const member = message.mentions.users.first() || client.users.cache.get(theuser) || client.users.cache.find(u => u.username === theuser);        
    if(!member) member = message.author
    cases.findOne({
                    serverID: message.guild.id,
                userID: member.id}, (err, res) => {
                    cases.find({
                    serverID: message.guild.id,
                    userID: member.id}, (err, Numbers) => {
                    cases.find({
                        serverID: message.guild.id,
                        action: "Ban",
                    userID: member.id}, (err, ban) => {
                        cases.find({
                            serverID: message.guild.id,
                            action: "SoftBan",
                        userID: member.id}, (err, soft) => {
                        cases.find({
                            serverID: message.guild.id,
                            action: "Kick",
                        userID: member.id}, (err, kick) => {
                          cases.find({
                            serverID: message.guild.id,
                            action: "Warn",
                            userID: member.id}, (err, warns) => {
                                cases.find({
                                    serverID: message.guild.id,
                                    action: "Mute",
                                userID: member.id}, (err, mute) => {
                                    cases.find({
                                        serverID: message.guild.id,
                                        action: "Unmute",
                                    userID: member.id}, (err, unmute) => {
                                        cases.find({
                                            serverID: message.guild.id,
                                            action: "HackBan",
                                        userID: member.id}, (err, hackban) => {
                                            cases.find({
                                                serverID: message.guild.id,
                                                action: "UnBan",
                                            userID: member.id}, (err, unban) => {
                                                cases.find({
                                                    serverID: message.guild.id,
                                                    action: "TempMute",
                                                userID: member.id}, (err, tmute) => {
                                                    cases.find({
                                                        serverID: message.guild.id,
                                                        action: "TempBan",
                                                    userID: member.id}, (err, tban) => {
        if(!res){
            return message.reply("❌ That user does not have cases at this server!")
        }
let ucases = '';
for (i = 0; i < Numbers.length; i++) {
    ucases += `**${Numbers[i].case}** ,`
    }
    let uwarn = ''
    let ukick = ''
    let uban = ''
    let umute = ''
    let uunmute = ''
    let usoft = ''
    let hban = ''
    let unban1 = ''
    let tmutes = ''
    let tbans = ''
    if(!warns){
        uwarn = '0'
    }else{
        uwarn = warns.length
    }
    if(!mute){
        umute = '0'
    }else{
        umute = mute.length
    }
    if(!kick){
        ukick = '0'
    }else{
        ukick = kick.length
    }
    if(!ban){
        uban = '0'
    }else{
        uban = ban.length
    }
    if(!unmute){
        uunmute = '0'
    }else{
        uunmute = unmute.length
    }
    if(!soft){
        usoft = '0'
    }else{
        usoft = soft.length
    }
    if(!hackban){
        hban = '0'
    }else{
        hban = hackban.length
    }
    if(!unban){
        unban1 = '0'
    }else{
        unban1 = unban.length
    }
    if(!tmute){
        tmutes = '0'
    }else{
        tmutes = tmute.length
    }
    if(!tban){
        tbans = '0'
    }else{
        tbans = tban.length
    }
    client.users.fetch(res.userID).then(member => {
    let embed = new MessageEmbed()
    .setAuthor("📃 " + member.username + " Cases ", member.displayAvatarURL({dynamic: true}))
    .addField("Kick(s)", ukick, true)
    .addField("Ban(s)", uban, true)
    .addField("SoftBan(s)", usoft, true)
    .addField("Warn(s)", uwarn, true)
    .addField("Mute(s)", umute, true)
    .addField("Unmute(s)", uunmute, true)
    .addField("HackBan(s)", hban, true)
    .addField("UnBan(s)", unban1, true)
    .addField("TempMute(s)", tmutes, true)
    .addField("TempBan(s)", tbans, true)
    .addField(`All User Cases!, Do **case <number>** to view it`, `${ucases}`)
    .setFooter("Requested by " + message.author.tag, message.author.displayAvatarURL({dynamic: true}))
    message.channel.send(embed)
                })
            })
            })
        })
    })
})
                            })
    })
})
                        })
                    })
                    })
})
}


module.exports.help = {
    name: "check",
    category: "info",
    aliases: [],
    description: "Show you how much infractions , kicks , bans ,unbans he got at your server!",
    example: "``check <@user>``"
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

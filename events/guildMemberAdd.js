const servers = require("../models/servers.js");
const MUTED = require("../models/clock")


module.exports = async (client, member) => {
    servers.findOne({
        guildID: member.guild.id}, async (err , res) => {
            if(!res){
            }else{
                if(res){
                MUTED.findOne({
                    action: "TempMute",
                    serverID: member.guild.id,
                    userID: member.user.id}, (err, mute) => {
                        if(mute){
                    if(!member.guild.roles.cache.get(res.mutedrole)) return
                    let role = member.guild.roles.cache.get(res.mutedrole)
                 member.roles.add(role)
                        }
                })
                MUTED.findOne({
                    action: "Mute",
                    serverID: member.guild.id,
                    userID: member.user.id}, (err, mute) => {
                        if(mute){
                            if(!member.guild.roles.cache.get(res.mutedrole)) return
                            let role = member.guild.roles.cache.get(res.mutedrole)
                            member.roles.add(role)
                        }
                })
            }
                if(res){
                if(res.antiraid == "1"){
                    member.send(member.guild.name + " is at anti raid mode , you can't join server as this time!")
                    .catch(() => {member.kick("Anti Raid")})
                    .then(() => {member.kick("Anti Raid")})
                    return
                    }
                }
                if(res.welcome !== "String"){        
                if(!client.guilds.cache.get(member.guild.id).channels.cache.get(res.welcome)) return
                if(res.welcomemsg == "String"){
                    if(!client.guilds.cache.get(member.guild.id).channels.cache.get(res.welcome)) return
                let messages = 
                    [
                        `**Welcome ${member} to ${member.guild.name}**`,
                        `**Welcome ${member} to ${member.guild.name}**`,
                        `**Welcome ${member} to ${member.guild.name}**`,
                        `**Welcome ${member} to ${member.guild.name}** 🎉`,
                        `**${member} just arrived at ${member.guild.name}**`,
                        `**Let's welcome ${member}** 🎉`,
                        `**Welcome ${member} hope you don't leave us**`,
                        `**${member} hola ! 🎉**`,
                        `**${member} you are member number ${member.guild.memberCount}th** 🎉`,
                        `**Superman is here ${member}** 🎉`,
                        `**${member} thanks for joining** 🎉`,
                        `**${member.guild} now is your place ${member}** 🎉`,
                        `**This guild is lucky because they have ${member}**`,
                        `**Welcome ${member} want ice cream?** 🍦`,
                    ]
                    client.guilds.cache.get(member.guild.id).channels.cache.get(res.welcome).send(messages[Math.ceil(Math.random() * messages.length)] || `**${member} you are member number ${member.guild.memberCount}th** 🎉`,)
                }else{
                    if(!client.guilds.cache.get(member.guild.id).channels.cache.get(res.welcome)) return
if(res.welcomemsg !== "String"){
    if(!client.guilds.cache.get(member.guild.id).channels.cache.get(res.welcome)) return
let welcomemsg = res.welcomemsg
if(welcomemsg.includes("{member}")){
    welcomemsg = welcomemsg.replace("{member}", member)
}
if(welcomemsg.includes("{member.tag}")){
    welcomemsg = welcomemsg.replace("{member.tag}", member.user.tag)
}
if(welcomemsg.includes("{guild.name}")){
    welcomemsg = welcomemsg.replace("{guild.name}", member.guild.name)
}
if(welcomemsg.includes("{guild.memberCount}")){
    welcomemsg = welcomemsg.replace("{guild.memberCount}", member.guild.memberCount)
}
if(welcomemsg.includes("{member.username}")){
    welcomemsg = welcomemsg.replace("{member.username}", member.user.username)
}
                    client.guilds.cache.get(member.guild.id).channels.cache.get(res.welcome).send(welcomemsg)
                }

    }
                }

            if(res){    
        if(member.user.bot) {
            if(res.botautorole !== "String"){ 
                if(!client.guilds.cache.get(member.guild.id).roles.cache.get(res.botautorole)) return
                    member.roles.add(res.botautorole)
            }
        }else{  
            if(!member.user.bot) {
         if(res.autorole !== "String"){ 
            if(!client.guilds.cache.get(member.guild.id).roles.cache.get(res.autorole)) return
            member.roles.add(res.autorole)
        }
    }
    }
if(res.private !== "String"){
if(res.private){
let privatemsg = res.private
if(privatemsg.includes("{member}")){
    privatemsg = privatemsg.replace("{member}", member)
}
if(privatemsg.includes("{member.tag}")){
    privatemsg = privatemsg.replace("{member.tag}", member.user.tag)
}
if(privatemsg.includes("{guild.name}")){
    privatemsg = privatemsg.replace("{guild.name}", member.guild.name)
}
if(privatemsg.includes("{guild.memberCount}")){
    privatemsg = privatemsg.replace("{guild.memberCount}", member.guild.memberCount)
}
if(privatemsg.includes("{member.username}")){
    privatemsg = privatemsg.replace("{member.username}", member.user.username)
}
            member.send(privatemsg)
            .catch(() => {})
}
}
}
        }
    })
}
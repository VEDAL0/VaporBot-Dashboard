const servers = require("../models/servers.js");



module.exports = (client, member) => {
    if(member.guild){
    servers.findOne({
        guildID: member.guild.id}, (err , res) => {
            if(!res){
            }else{
                if(res){
                if(res.antiraid == "1") return
                }
                if(res.leave == "String"){        
            }else{
                if(res.leavemsg == "String"){
                if(!client.guilds.cache.get(member.guild.id).channels.cache.get(res.leave)) return
                let messages = 
                    [
                        `**Good Bye ${member}**`,
                        `**${member} left us alone**`,
                        `**Bye ${member} hope you back again!**`,
                        `**${member} just left**`,
                        `**${member} just left**`,
                        `**${member} just left**`,
                        `**We will miss you ${member} bye!!**`,
                        `**${member} good bye**`,
                        `**${member} left**`,
                        `**We are not lucky anymore with you ${member} bye!**`,
                    ]
                    client.guilds.cache.get(member.guild.id).channels.cache.get(res.leave).send(messages[Math.ceil(Math.random() * messages.length)] || `**Good Bye ${member}**`)
            }else{
                if(!client.guilds.cache.get(member.guild.id).channels.cache.get(res.leave)) return
                if(res.leavemsg !== "String"){
                let leavemsg = res.leavemsg
                if(leavemsg.includes("{member}")){
                    leavemsg = leavemsg.replace("{member}", member)
                }
                if(leavemsg.includes("{member.tag}")){
                    leavemsg = leavemsg.replace("{member.tag}", member.user.tag)
                }
                if(leavemsg.includes("{guild.name}")){
                    leavemsg = leavemsg.replace("{guild.name}", member.guild.name)
                }
                if(leavemsg.includes("{guild.memberCount}")){
                    leavemsg = leavemsg.replace("{guild.memberCount}", member.guild.memberCount)
                }
                if(leavemsg.includes("{member.username}")){
                    leavemsg = leavemsg.replace("{member.username}", member.user.username)
                }
                client.guilds.cache.get(member.guild.id).channels.cache.get(res.leave).send(leavemsg)
            }
        }
        }
        }
    })
}
}
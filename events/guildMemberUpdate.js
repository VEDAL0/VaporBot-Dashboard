const servers = require("../models/servers.js");
const { MessageEmbed } = require("discord.js");
const moment = require('moment')

module.exports = async (client, oldMember, newMember) => {
    const guild = newMember.guild;
    if(guild){
servers.findOne({
    guildID: guild.id}, async (err , res) => {
        if(!res){
        }else{
            if(res.audit == "String"){        
        }else{
            if(!client.guilds.cache.get(guild.id).channels.cache.get(res.audit)) return
            if(newMember.nickname !== oldMember.nickname){
                let oldnick = oldMember.nickname
                let newnick = newMember.nickname
                if(newnick == null){
                    newnick = newMember.user.username
                }else if(oldnick == null){
                    oldnick = newMember.user.username
                }
            let embed = new MessageEmbed()
            .setAuthor("🏷️ Nickname Update | " + newMember.user.username, newMember.user.displayAvatarURL({dynamic: true}))
            .addField("Old nickname", oldnick)
            .addField("New nickname", newnick)
            .setColor("GREEN")
            .setFooter(moment(oldMember.user.createdAt).format('MM/DD/YYYY HH:mm:ss A'))
                client.guilds.cache.get(guild.id).channels.cache.get(res.audit).send(embed)
            }
    }
}
})
    }
}
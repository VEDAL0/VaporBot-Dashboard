const servers = require("../models/servers.js");
const { MessageEmbed } = require("discord.js");


module.exports = (client, guild, member) => {
    if(guild){
servers.findOne({
    guildID: guild.id}, (err , res) => {
        if(!res){
        }else{
            if(res.audit == "String"){        
        }else{
            if(!client.guilds.cache.get(guild.id).channels.cache.get(res.audit)) return
            let embed = new MessageEmbed()
            .setDescription(`🗑️ **${member.tag}** has been unbanned from this server!`)
            .setColor("GREEN")
                client.guilds.cache.get(guild.id).channels.cache.get(res.audit).send(embed)
        }
    }
})
    }
}
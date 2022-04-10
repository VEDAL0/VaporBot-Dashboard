const servers = require("../models/servers.js");
const { MessageEmbed } = require("discord.js");


module.exports = (client, channel) => {
    if(channel.guild){
servers.findOne({
    guildID: channel.guild.id}, (err , res) => {
        if(!res){
        }else{
            if(res.audit == "String"){        
        }else{
            if(!client.guilds.cache.get(channel.guild.id).channels.cache.get(res.audit)) return
            let embed = new MessageEmbed()
            .setColor("GREEN")
            .setDescription("✏️ ``" + channel.name + "``" + " channel pinned messages has been updated!")
                client.guilds.cache.get(channel.guild.id).channels.cache.get(res.audit).send(embed)
        }
    }
})
    }
}
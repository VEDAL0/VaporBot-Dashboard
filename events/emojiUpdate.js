const servers = require("../models/servers.js");
const { MessageEmbed } = require("discord.js");
const moment = require('moment')

module.exports = (client, oldEmoji, newEmoji) => {
    if(newEmoji.guild){
servers.findOne({
    guildID: newEmoji.guild.id}, (err , res) => {
        if(!res){
        }else{
            if(res.audit == "String"){        
        }else{
            if(!client.guilds.cache.get(newEmoji.guild.id).channels.cache.get(res.audit)) return
            if(oldEmoji.name !== newEmoji.name){
            let embed = new MessageEmbed()
            .setAuthor("✏️ Emoji name update | " + newEmoji.name)
            .setDescription(`Old: **${oldEmoji.name}**\nNew: **${newEmoji.name}**`)
            .setColor("GREEN")
            .setFooter(moment(newEmoji.createdAt).format('MM/DD/YYYY HH:mm:ss A'))
                client.guilds.cache.get(newEmoji.guild.id).channels.cache.get(res.audit).send(embed)
        }
    }
    }
})
    }
}
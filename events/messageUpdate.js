const servers = require("../models/servers.js");
const { MessageEmbed } = require("discord.js");
const moment = require('moment')

module.exports = (client, oldMessage, newMessage) => {
    if(newMessage.guild){
servers.findOne({
    guildID: newMessage.guild.id}, (err , res) => {
        if(!res){
        }else{
            if(res.audit == "String"){        
        }else{
            if(!client.guilds.cache.get(newMessage.guild.id).channels.cache.get(res.audit)) return
            if(newMessage.content !== oldMessage.content){
            let embed = new MessageEmbed()
            .setAuthor("✏️ Message edited by " + newMessage.author.tag , newMessage.author.displayAvatarURL({dynamic: true}))
            .setDescription(`[Jump to message](${newMessage.url}), Edited at ${newMessage.channel}`)
            .addField(`Old message`, oldMessage.content + " ")
            .addField(`New message`, newMessage.content + " ")
            .setColor("GREEN")
            .setFooter(moment(newMessage.createdAt).format('MM/DD/YYYY HH:mm:ss A'))
            if(newMessage.author.bot) return
                client.guilds.cache.get(newMessage.guild.id).channels.cache.get(res.audit).send(embed).catch(() => {})
        }
    }
    }
})
    }
}
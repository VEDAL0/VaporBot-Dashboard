const servers = require("../models/servers.js");
const { MessageEmbed } = require("discord.js");
const moment = require('moment')

module.exports = (client, message) => {
if (client.snipe.has(message.guild.id)) {
client.snipe.delete(message.guild.id);
}
client.snipe.add(message.guild.id);
client.snipe[message.guild.id] = 
{
message: message.content,
name: message.author.tag,
channel: message.channel.name,
time: moment(message.createdAt).format('YYYY-MM-DD'),
image:message.attachments.first() ? message.attachments.first().proxyURL : null
};
servers.findOne({
    guildID: message.guild.id}, (err , res) => {
        if(!res){
        }else{
            if(res.audit == "String"){        
        }else{
            if(!client.guilds.cache.get(message.guild.id).channels.cache.get(res.audit)) return
            if(message.content){
            let embed = new MessageEmbed()
            .setAuthor("🗑️ Message Deleted | " + message.author.tag ,message.author.displayAvatarURL({dynamic: true}))
            .setDescription(`Deleted at ${message.channel}`)
            .addField("Content", message.content)
            .setColor("GREEN")
            .setFooter(moment(message.createdAt).format('MM/DD/YYYY HH:mm:ss A'))
            if(message.author.bot) return
                client.guilds.cache.get(message.guild.id).channels.cache.get(res.audit).send(embed)
        }
    }
    }
})
}
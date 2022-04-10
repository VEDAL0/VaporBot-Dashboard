const servers = require("../models/servers.js");
const { MessageEmbed } = require("discord.js");


module.exports = (client, emoji) => {
    if(emoji.guild){
servers.findOne({
    guildID: emoji.guild.id}, (err , res) => {
        if(!res){
        }else{
            if(res.audit == "String"){        
        }else{
            if(!client.guilds.cache.get(emoji.guild.id).channels.cache.get(res.audit)) return
            let embed = new MessageEmbed()
            .setDescription("🗑️ ``" + emoji.name + "``" + ` (${emoji})` + "emoji has been deleted!")
            .setColor("GREEN")
                client.guilds.cache.get(emoji.guild.id).channels.cache.get(res.audit).send(embed)
        }
    }
})
    }
}
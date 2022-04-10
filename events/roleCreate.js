const servers = require("../models/servers.js");
const { MessageEmbed } = require("discord.js");


module.exports = (client, role) => {
    if(role.guild){
servers.findOne({
    guildID: role.guild.id}, (err , res) => {
        if(!res){
        }else{
            if(res.audit == "String"){        
        }else{
            if(!client.guilds.cache.get(role.guild.id).channels.cache.get(res.audit)) return
            let embed = new MessageEmbed()
            .setDescription("🎉 ``" + role.name + "``" + " role is created!")
            .setColor("GREEN")
                client.guilds.cache.get(role.guild.id).channels.cache.get(res.audit).send(embed)
        }
    }
})
    }
}
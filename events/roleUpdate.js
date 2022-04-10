const { MessageEmbed } = require("discord.js");
const servers = require("../models/servers.js");
const moment = require('moment')


module.exports = async (client, oldRole, newRole) => {
    if(newRole.guild){
        servers.findOne({
            guildID: newRole.guild.id}, async (err , res) => {
                if(!res){
                }else{
                    if(res.audit == "String"){        
                }else{
                    if(!client.guilds.cache.get(newRole.guild.id).channels.cache.get(res.audit)) return
                    if(oldRole.name !== newRole.name){
                    let embed = new MessageEmbed()
                    .setTitle("✏️ Role Name Updated | " + newRole.name)
                    .setColor("GREEN")
                    .setDescription(`Role name changed from **${oldRole.name}** to **${newRole.name}**`)
                    .setFooter(moment(newRole.createdAt).format('MM/DD/YYYY HH:mm:ss A'))
                        client.guilds.cache.get(newRole.guild.id).channels.cache.get(res.audit).send(embed)
                }
                
            }
            }
        })
            }
}
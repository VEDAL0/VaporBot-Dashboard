const { MessageEmbed } = require("discord.js");
const servers = require("../models/servers.js");
const moment = require('moment')


module.exports = (client, oldChannel, newChannel) => {
    if(newChannel.guild){
        servers.findOne({
            guildID: newChannel.guild.id}, (err , res) => {
                if(!res){
                }else{
                    if(res.audit == "String"){        
                }else{
                    if(!client.guilds.cache.get(newChannel.guild.id).channels.cache.get(res.audit)) return
                    if(newChannel.name !== oldChannel.name){
                    let embed = new MessageEmbed()
                    .setAuthor("✏️ Channel Name Updated | " + newChannel.name, newChannel.guild.iconURL())
                    .setColor("GREEN")
                    .setDescription(`Channel name changed from\n **${oldChannel.name}** to **${newChannel.name}**\nChannel Type: **${newChannel.type}**`)
                    .setFooter(moment(newChannel.createdAt).format('MM/DD/YYYY HH:mm:ss A'))
                        client.guilds.cache.get(newChannel.guild.id).channels.cache.get(res.audit).send(embed)
                }
                if(newChannel.parent !== oldChannel.parent){
                    let oldcate = oldChannel.parent;
                    let newcate = newChannel.parent;
                    if(oldcate == null) oldcate = "No category!"
                    if(newcate == null) newcate = "No category!"
                    let embed = new MessageEmbed()
                    .setAuthor("✏️ Channel Parent Updated | " + newChannel.name, newChannel.guild.iconURL())
                    .setColor("GREEN")
                    .setDescription(`Channel category changed from\n **${oldcate}** to **${newcate}**`)
                    .setFooter(moment(newChannel.createdAt).format('MM/DD/YYYY HH:mm:ss A'))
                        client.guilds.cache.get(newChannel.guild.id).channels.cache.get(res.audit).send(embed)
                }
                if(newChannel.type !== oldChannel.type){
                    let embed = new MessageEmbed()
                    .setAuthor("✏️ Channel Type Updated | " + newChannel.name, newChannel.guild.iconURL({dynamic: true}))
                    .setColor("GREEN")
                    .setDescription(`Channel type changed from\n **${oldChannel.type}** to **${newChannel.type}**`)
                    .setFooter(moment(newChannel.createdAt).format('MM/DD/YYYY HH:mm:ss A'))
                        client.guilds.cache.get(newChannel.guild.id).channels.cache.get(res.audit).send(embed)
                }
            }
            }
        })
            }
}
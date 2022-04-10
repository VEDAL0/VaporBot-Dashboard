const { MessageEmbed } = require("discord.js")
const servers = require("../models/servers")
module.exports.run = (client , message, args) => {
    let prefix = 'v!'
    servers.findOne({
        guildID: message.guild.id}, (err, res) => {
            if(!res){
                 prefix = 'v!'
            }else{
                prefix = res.prefix
            }
    if(args[0] && client.commands.has(args[0])){
        const cmd = client.commands.get(args[0]);
        let cmdname = cmd.help.name.charAt(0).toUpperCase() + cmd.help.name.slice(1)
        let aliases = "No aliases for that command"
        if(cmd.help.aliases.length === 0){
            aliases = "No aliases for that command"
        }else{
            aliases = cmd.help.aliases.join("\n")
        }
        const embed = new MessageEmbed()
        .setAuthor(`${cmdname} command`)
        .setColor("GREEN")
        .setDescription(`**Prefix:** ${prefix}\n**Name:** ${cmd.help.name}\n**Description:** ${cmd.help.description}\n**Category:** ${cmd.help.category}`)
        .addField("Examples", cmd.help.example)
        .addField("Aliases", "``" + aliases + "``")
        .setFooter(`Syntax: <> = required, [] = optional`)
        return message.channel.send(embed)
    }
    let info = client.commands.filter(cmd => cmd.help.category == "info")
    let moderation = client.commands.filter(cmd => cmd.help.category == "moderation")
    let owner = client.commands.filter(cmd => cmd.help.category == "owner")
  const embed = new MessageEmbed()
  embed.setAuthor("Vapor help prompt", client.user.displayAvatarURL({dynamic: true}))
  embed.setThumbnail(message.guild.iconURL({dynamic: true}))
  embed.setColor("BLUE")
  embed.addField(`**Info**`, info.map(cmd => "``" + cmd.help.name + "``" ).join("** , **"))
  embed.addField(`**Moderation**`, moderation.map(cmd => "``" + cmd.help.name + "``" ).join("** , **"))
  if(client.config.owners.includes(message.author.id)){
      embed.addField(`**Owner**`, owner.map(cmd => "``" + cmd.help.name + "``" ).join("** , **"))
  }
  embed.setDescription("**Prefix: **" + "``" + prefix + "``\nMore things at [Dashboard](https://vaporbot.xyz/)")
  embed.setFooter("For more information do " + prefix + "help [command_name]" , client.user.displayAvatarURL({dynamic: true}))
  message.channel.send(embed);
        })
}

module.exports.help = {
    name: "help",
    category: "info",
    aliases: ['commands', 'cmds'],
    description: "Send you all commands!",
    example: "``help <command_name>``"
}

module.exports.requirements = {
    userPerms: [],
    clientPerms: ["EMBED_LINKS"],
    ownerOnly: false
}

module.exports.limits = {
    rateLimit: 2,
    cooldown: 1e4
}
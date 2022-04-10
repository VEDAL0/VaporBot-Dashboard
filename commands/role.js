const { MessageEmbed } = require("discord.js")



module.exports.run = (client , message, args) => {
let therole = args.slice(0).join(" ")
if(!therole) return message.reply("❌ Please define role name or mention or id!")
let role = message.mentions.roles.first() || message.guild.roles.cache.get(therole) || message.guild.roles.cache.find(r => r.name === therole)
if(!role) return message.channel.send("❌ Seems like i can't find that role")
let embed = new MessageEmbed()
.setAuthor(`📜 ${role.name}` + ` (${role.id})`, client.user.displayAvatarURL())
.setDescription(`\`Name: ${role.name}\nID: ${role.id}\nColor: ${role.hexColor}\nYou can edit it: ${role.editable}\nDeleted: ${role.deleted}\nHoisted: ${role.hoist}\nMentionable ${role.mentionable}\nPosition: ${message.guild.roles.cache.size - role.position}\``)
.addField("**Permissions**", "``" + role.permissions.toArray().join(" , ") + "``")
.setFooter("Role created at " + role.createdAt.toLocaleString())
message.channel.send(embed)
}

module.exports.help = {
    name: "role",
    category: "info",
    aliases: ['roleinfo'],
    description: "Show information about roles!",
    example: "``role <@role>``"
}

module.exports.requirements = {
    userPerms: [],
    clientPerms: ['EMBED_LINKS'],
    ownerOnly: false
}

module.exports.limits = {
    rateLimit: 2,
    cooldown: 1e4
}
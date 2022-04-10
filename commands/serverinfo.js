const { MessageEmbed } = require("discord.js");
const moment = require('moment')

module.exports.run = (client , message, args) => {
const { guild } = message;
let counts = 'No roles';
if(message.guild.roles.cache.size > 20){
    counts = ` ... and **${(message.guild.roles.cache.size - 20)}** more`
}else{
    counts = `.`
}
let embed = new MessageEmbed()
  .setAuthor(`${guild.name} (${guild.id})`, guild.iconURL({dynamic: true}))
  .setThumbnail(guild.iconURL({dynamic: true}))
  .setDescription(`**Created At: ${moment(guild.createdAt).format('MM/DD/YYYY HH:mm:ss A')}\nMembers: ${guild.memberCount}\nHumans: ${guild.members.cache.filter(member => !member.user.bot).size}\nBots: ${guild.members.cache.filter(member => member.user.bot).size}\nText-Channels: ${guild.channels.cache.filter(ch => ch.type === 'text').size}\nVoice-Channels: ${guild.channels.cache.filter(ch => ch.type === 'voice').size}\nBoosts: ${message.guild.premiumSubscriptionCount}\nLevel Perks: ${message.guild.premiumTier}\nRoles Count: ${guild.roles.cache.size}\nEmojis Count: ${guild.emojis.cache.size}\nRegion: ${guild.region}**`)
  .addField("Presence", `\`🔴 ${message.guild.members.cache.filter(member => member.presence.status == "dnd").size} | 🟢 ${message.guild.members.cache.filter(member => member.presence.status == "online").size} | 🟡 ${message.guild.members.cache.filter(member => member.presence.status == "idle").size} | ⚪ ${message.guild.members.cache.filter(member => member.presence.status == "offline").size}\``)
  .setColor('#5CC5FF')
  .addField("Roles",`${message.guild.roles.cache.filter(r => r.id !== message.guild.id).first(20).sort((a, b) => b.position - a.position).map(r => r).join(' **›** ')}${counts}`);
message.channel.send(embed);
}


module.exports.help = {
    name: "serverinfo",
    category: "info",
    aliases: ['si'],
    description: "Give some info about guild!",
    example: "``serverinfo``"
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
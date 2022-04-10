const servers = require("../models/servers")
module.exports.run = (client , message, args) => {
let member =  message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(m => m.username === args[0])
if(!member){
    return message.reply("\n❌ Seems like i can't find that user\nmaybe you didn't **provid** a valid user!")
}else{
    if(member.roles.highest.position >= message.member.roles.highest.position){
        return message.channel.send("❌ You can't give role to person have roles higher than or same to you!")
    }
let role = args.slice(1).join(" ")
let check = message.guild.roles.cache.find(r => r.name === role) || message.guild.roles.cache.get(role) || message.mentions.roles.first()
if(!check){
    return message.reply("❌ Seems like i can't find the role!")
}else{
    if(check.position >= message.guild.me.roles.highest.position) return message.channel.send("That role is higher than my role or same to me!")
    if(member.roles.cache.get(check.id)) return message.reply("That member already have that role!")
    member.roles.add(check)
    message.channel.send(`✅ ${check.name}` + " role has been given to **" + member.user.tag + "**" + " by **" + message.author.tag + "**")
servers.findOne({
 guildID: message.guild.id}, (err, res) => {
let channel = message.guild.channels.cache.get(res.mod)
if(channel){
    channel.send("✅ " + check.name + " role has been given to ``" + member.user.tag + "``" + " by ``" + message.author.tag + "``")
}
})
}
}



}

module.exports.help = {
    name: "addrole",
    category: "moderation",
    aliases: ['arole'],
    description: "Give roles to specfic user!",
    example: "``addrole <@user> <@role>``"
}

module.exports.requirements = {
    userPerms: ["MANAGE_ROLES"],
    clientPerms: ["MANAGE_ROLES"],
    ownerOnly: false
}

module.exports.limits = {
    rateLimit: 2,
    cooldown: 1e4
}
const servers = require("../models/servers")

module.exports.run = (client , message, args) => {
    let member =  message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(member.roles.highest.position >= message.member.roles.highest.position){
        return message.channel.send("❌ You can't remove role from person have roles higher than or same to you!")
    }
    if(!member){
        return message.reply("\n❌ Seems like i can't find that user\nmaybe you didn't **provide** a valid user!")
    }else{
    let role = args.slice(1).join(" ")
    let check = message.guild.roles.cache.find(r => r.name === role) || message.guild.roles.cache.get(role) || message.mentions.roles.first()
    if(!member.roles.cache.get(check.id)) return message.reply("❌ I can't find that role at his roles to remove!")
    if(!check){
        return message.reply("❌ Seems like i can't find the role!")
    }else{
        if(check.position >= message.guild.me.roles.highest.position) return message.channel.send("That role is higher than my role or same to me!")
        member.roles.remove(check)
        message.channel.send(`✅ ${check.name}` + " role has been removed from **" + member.user.tag + "**" + " by **" + message.author.tag + "**")
        servers.findOne({
            guildID: message.guild.id}, (err, res) => {
           let channel = message.guild.channels.cache.get(res.mod)
           if(channel){
            channel.send(`✅ ${check.name}` + " role has been removed from ``" + member.user.tag + "``" + " by ``" + message.author.tag + "``")
           }
           })
    }
    }
    
    
    
    }
    
    module.exports.help = {
        name: "removerole",
        category: "moderation",
        aliases: ['rrole'],
        description: "Remove roles from the specfic user!",
        example: "``removerole <@user> <@role>``"
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
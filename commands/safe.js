const cases = require("../models/cases")

module.exports.run = async (client , message, args) => {
    let theuser = args.slice(0).join(" ")
    let member = message.mentions.users.first() || client.users.cache.get(theuser) || client.users.cache.find(u => u.username === theuser);             
    if(!member) member = message.author;
                    cases.find({
                    userID: member.id}, (err, res) => {

        if(res.length === 0){
            return message.channel.send(`**${member.tag}** is 100% safe ✅ with no infractions!`)
        }else{
            let perc = 100 - (res.length + 5);
            if(perc === 0){
                perc = 0;
            }
            return message.channel.send(`**${member.tag}** is ${perc}% safe ✅ with ${res.length} infractions!`)
        }
                       
                    })
}


module.exports.help = {
    name: "safe",
    category: "info",
    aliases: ["scan"],
    description: "Shows you how much is that user safe!",
    example: "``safe <@user>``"
}

module.exports.requirements = {
    userPerms: [],
    clientPerms: ['EMBED_LINKS','SEND_MESSAGES'],
    ownerOnly: false
}

module.exports.limits = {
    rateLimit: 2,
    cooldown: 1e4
}

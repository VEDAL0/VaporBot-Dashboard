const cases = require("../models/cases")
const servers = require("../models/servers")

module.exports.run = (client , message, args) => {
if(!args[0]) return message.reply(":x: **Please define case number!**")
if(args[0]){
cases.findOneAndDelete({
    serverID: message.guild.id,
    case: args[0]}, (err, res) => {
        if(!res){
            return message.reply("Seems like i can't find that case!")
        }else{
            servers.findOne({
                guildID: message.guild.id}, (err, res) => {
               let channel = message.guild.channels.cache.get(res.mod)
               if(channel){
                   channel.send(`🗑️ Case number \`#${args[0]}\` has been deleted from server by **${message.author.tag}**.`)
               }
               })
            message.channel.send(`🗑️ Successfully deleted case number \`${args[0]}\``)
        }
})
}
}



module.exports.help = {
    name: "casedelete",
    category: "info",
    aliases: ["deletecase", 'dcase'],
    description: "Delete case",
    example: "``casedelete <case_number>``"
}

module.exports.requirements = {
    userPerms: ["MANAGE_GUILD"],
    clientPerms: ['EMBED_LINKS','SEND_MESSAGES'],
    ownerOnly: false
}

module.exports.limits = {
    rateLimit: 2,
    cooldown: 1e4
}
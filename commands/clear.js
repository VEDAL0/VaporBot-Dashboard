const servers = require("../models/servers")

module.exports.run = async (client , message, args) => {
    await message.delete().catch(() => {})
    if(isNaN(args[0])){
        return message.reply("❌ Only numbers are allowed at this command")
    }
    if(args[0] > 100){
        return message.reply("❌ Max is 100!")
    }
        if(!args[0]) return message.channel.send("❌ Please define amount of message to delete!")
            await message.channel.bulkDelete(args[0]).catch(() => {})
            message.channel.send("🗑️ Success i have bulkdelete " + args[0] + ' messages!').then(msg => msg.delete({ timeout: 3000 }))
            servers.findOne({
                guildID: message.guild.id}, (err, res) => {
               let channel = message.guild.channels.cache.get(res.mod)
               if(channel){
                channel.send(`🗑️ Bulkdeleted ${args[0]} messages at ${message.channel.name}`)
               }
               })
        }

module.exports.help = {
    name: "clear",
    category: "moderation",
    aliases: ['purge','prune'],
    description: "delete messages under 14 days old!",
    example: "``clear <number>``"
}

module.exports.requirements = {
    userPerms: ["MANAGE_MESSAGES"],
    clientPerms: ["MANAGE_MESSAGES"],
    ownerOnly: false
}

module.exports.limits = {
    rateLimit: 2,
    cooldown: 1e4
}

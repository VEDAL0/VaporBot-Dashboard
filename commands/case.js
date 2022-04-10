const { MessageEmbed } = require("discord.js")
const cases = require("../models/cases")

module.exports.run = (client , message, args) => {
if(!args[0]) return message.reply("❌ Please define case number\n``case <number>``")
cases.findOne({
serverID: message.guild.id,
case: args[0]}, (err , res) => {
    if(!res){
        return message.reply("❌ Can't find that case!")
    }
            cases.find({
                serverID: message.guild.id,
                userID: res.userID}).sort([
                      ['descending']
                    ]).exec((err, res2) => {
        let reason = '';
        let mod = '';
        let time = '';
        let duration = '';
        if(res.reason == ''){
            reason = 'No reason Provided'
        }else{
            reason = res.reason
        }
        if(res.time == undefined){
            time = 'No time'
        }else{
            time = res.time
        }
        if(res.duration == undefined){
            duration = 'No duration for this command'
        }else{
            duration = res.duration
        }
        if(res.Moderator == undefined){
            mod = 'Moderator was not defined, at this time'
        }else{
            client.users.fetch(res.Moderator).then(member => {
            mod = member.tag
            })
        }
        let number = res2.length - 1
        client.users.fetch(res.userID).then(member => {
    let embed = new MessageEmbed()
    .setAuthor("📃 Case Number #" + args[0], member.displayAvatarURL({dynamic: true}))
    .addField("Member ", member.tag + "(``" + res.userID + "``)")
    .addField("Reason: ", "``" + reason + "``")
    .addField("Action: ",  res.action, true)
    .addField("Time: ",  time, true)
    .addField("Moderator: ",  mod, true)
    .addField("Duration: ",  duration, true)
    .setDescription("That user have " + number + " Other cases in this server")
    .setFooter("Requested by " + message.author.tag, message.author.displayAvatarURL())
    message.channel.send(embed)
            })
        })
})
}


module.exports.help = {
    name: "case",
    category: "info",
    aliases: [],
    description: "Show you detailed reason for actions!",
    example: "``case <number>``"
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
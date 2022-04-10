const { MessageEmbed, version } = require("discord.js")
const moment = require('moment')
module.exports.run = async (client , message, args) => {
    let guilds = await client.shard.broadcastEval('this.guilds.cache.size').then(x => x.reduce((a, b) => b + a));
    let users =  await client.shard.broadcastEval('this.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)').then(x => x.reduce((a, b) => b + a));
    let channels = await client.shard.broadcastEval('this.guilds.cache.reduce((acc, guild) => acc + guild.channels.cache.size, 0)').then(x => x.reduce((a, b) => b + a));
    let embed = new MessageEmbed()
        .setAuthor("Bot stats", client.user.displayAvatarURL({dynamic: true}))
        .setDescription(`**Guilds Count: ${guilds}\nUsers Count: ${users}\nChannels Count: ${channels}\nShards Count: ${client.shard.count}\nBot Version: 1.6.3\nFrameWork Library: discord.js, ${version}\nLanguage: javascript\nPrimary Language: English\nCommands: ${client.commands.size}\nLatency: ${client.ws.ping}\nCreated On: ${moment(client.user.createdAt).format("MM/DD/YYYY HH:mm:ss A")}\n[Website Dashboard](https://vaporbot.xyz/)\n[Support Server](https://discord.gg/fmu4dEF)**`)
        .setThumbnail(client.user.displayAvatarURL())
        message.channel.send(embed)
}

module.exports.help = {
    name: "stats",
    category: "info",
    aliases: ['bi','bs'],
    description: "Send you stats about shards!",
    example: "``stats``"
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
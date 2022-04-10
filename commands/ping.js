module.exports.run = (client , message, args) => {
    message.channel.send(`🏓 Pong! , It took ${client.ws.ping}ms`);
}

module.exports.help = {
    name: "ping",
    category: "info",
    aliases: ['latency'],
    description: "give you bot respond latency in ms",
    example: "``ping``"
}

module.exports.requirements = {
    userPerms: [],
    clientPerms: [],
    ownerOnly: false
}

module.exports.limits = {
    rateLimit: 2,
    cooldown: 1e4
}
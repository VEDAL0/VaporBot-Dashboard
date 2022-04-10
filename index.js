const { ShardingManager } = require("discord.js");
const token = require("./config.js").token
const manager = new ShardingManager("./bot.js", {
    token,
    totalShards: 'auto'
})

manager.spawn();
manager.on("shardCreate", shard => console.log(`Shard #${shard.id} is active.`));
const { readdirSync } = require("fs")
const { join } = require("path")
const filePath2 = join(__dirname, "..", "events");
const Dashboard = require("../dashboard/dashboard")
const eventFiles2 = readdirSync(filePath2);


module.exports = async (client) => {
client.user.setActivity(`${await client.shard.broadcastEval('this.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)').then(x => x.reduce((a, b) => b + a))} User || vaporbot.xyz`, { type: 'WATCHING' })
if(client.shard.ids[0] === 0) console.log(`Signed in as ${client.user.username} || Loaded [${eventFiles2.length}] event(s) & [${client.commands.size}] command(s)`);
Dashboard(client);
}

const mongoose = require("mongoose")
const servers = require("../models/servers")
const ms = require('parse-ms');
const CLOCK = require("../models/clock")
const { MessageEmbed } = require("discord.js");
const { mongo_url } = require("../config.js")
const ratetime = new Set()

mongoose.connect(mongo_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true},(err) => {
    if (err) return console.error(err);
    console.log("MONGODB IS CONNECTED")
    })
module.exports = (client, message) => {
    if(message.author.bot) return;
    if(message.guild){
    if(!message.guild.me.hasPermission("SEND_MESSAGES")) return
    }
        servers.findOne({
            guildID: message.guild.id
        }, async (err, res) => {
let prefix = "v!";
if(!res){
     new servers({
            antispam: "0",
            maxwarns: "3",
            guildID: message.guild.id,
            mutedrole: "String",
            prefix: "v!",
            welcome: "String",
            leave: "String",
            audit: "String",
            autorole: "String",
            antiraid: "0",
            welcomemsg: "String",
            leavemsg: "String",
            private: "String",
            botautorole: "String",
        }).save()
    }else prefix = res.prefix;
    {
    if(res){
        if(res.antispam == 1) {
            if (message.author.bot) return; 
     let blacklisted = ['www.','http://','DISCORDAPP.','https://','DiscordApp.','discordapp.','.xyz','.com','.gg','.co']
        let foundInText = false;
        for (var i in blacklisted) {
          if (message.content.toLowerCase().includes(blacklisted[i].toLowerCase())) foundInText = true;
        }
          if (foundInText) {
            if(message.member.hasPermission("MANAGE_MESSAGES")) return
            message.delete();
                message.channel.send(`${message.author}` + ', Hey! spamming links or invites disabled!').then(msg => { msg.delete({timeout: 3000})})
          }
        }
    }
    }
    {
        if(res){
        if(res.antispam == 1) {
            if (message.author.bot) return; 
          let blacklisted1 = ['ASS','ass','Ass',"fuck","Fuck","shit","Shit","bitch","Bitch","nigga","Nigga","gay","Gay","dick","Dick","pussy","Pussy"]
          let foundInText4 = false;
          for (var i in blacklisted1) {
        if (message.content.toLowerCase().includes(blacklisted1[i].toLowerCase())) foundInText4 = true;
        }
        if (foundInText4) {
            if(message.member.hasPermission("MANAGE_MESSAGES")) return
        message.delete();
          message.channel.send(`${message.author}` + ', Hey! swearing is disabled!').then(msg => { msg.delete({timeout: 3000})})
        } 
    } 
        }
    }
setInterval(() => {
        CLOCK.find({
            action: "TempBan",
            serverID: message.guild.id}, (err, res11) => {
                if(res11.length === 0) return
                res11.map(userban => {
                    client.users.fetch(userban.userID).then(async user => {
                        const guildBans = await message.guild.fetchBans();
                    if(!guildBans.has(user.id)) return userban.deleteOne()
                })
                    if (userban.time - (Date.now() - userban.timenow) < 0) {
                        if(userban.userID){
                        client.users.fetch(userban.userID).then(async memberban => {
                            const guildBans = await message.guild.fetchBans();
                            if(!guildBans.has(memberban.id)) return userban.deleteOne()
                            message.guild.members.unban(memberban).catch(() => {})
                            userban.deleteOne()
                            memberban.send("🛠️ Temp ban period has been expired at ``" + message.guild.name + "``").catch(() => {})
                            if(res){
                                let channel = message.guild.channels.cache.get(res.mod);
                            if(channel){
                                channel.send("🛠️ Temp ban period has been expired for ``" + memberban.tag + "``").catch(() => {})
                            }
                        }
                        })
                    }
            }
                })
        })
    }, 60000);
        setInterval(() => {
CLOCK.find({
    action: "TempMute",
    serverID: message.guild.id}, (err, res1) => {
        if(res1.length === 0) return
        res1.map(user => {
            client.users.fetch(user.userID).then(user2 => {
                let user3 = message.guild.member(user2)
                if(!user3.roles.cache.get(res.mutedrole)) return user.deleteOne()
            })
            if (user.time - (Date.now() - user.timenow) < 0) {
                if(user.userID){
                client.users.fetch(user.userID).then(member => {
                    if(!message.guild.members.cache.get(member.id)) return user.deleteOne()
                    if(!message.guild.roles.cache.get(res.mutedrole)) return user.deleteOne()
                    let role = message.guild.roles.cache.get(res.mutedrole)
                    let user1 = message.guild.member(member)
                    if(!user1.roles.cache.get(res.mutedrole)) return user.deleteOne()
                    user1.roles.remove(role)
                    user.deleteOne()
                    member.send("🔊 Temp mute period has been expired at ``" + message.guild.name + "`` you are free to talk!").catch(() => {})
                    if(res){
                        let channel = message.guild.channels.cache.get(res.mod);
                    if(channel){
                        channel.send("🔊 Temp mute period has been expired for ``" + member.tag + "`` they are free to talk now!").catch(() => {})
                    }
                }
                })
            }
        }
        })
})
}, 60000);
setInterval(() => {
CLOCK.find({
    action: "Mute",
    serverID: message.guild.id}, (err, res1) => {
        if(res1.length === 0) return
        res1.map(user => {
            client.users.fetch(user.userID).then(user2 => {
                let user3 = message.guild.member(user2)
                if(!user3.roles.cache.get(res.mutedrole)) return user.deleteOne()
            })
        })
})
}, 60000);
    const args = message.content.split(/ +/g);
    const commands = args.shift().slice(prefix.length).toLowerCase();
    const cmd = client.commands.get(commands) || client.aliases.get(commands);

    if(!message.content.toLowerCase().startsWith(prefix)) return;

    if(!cmd) return;
    if(!message.channel.permissionsFor(message.guild.me).toArray().includes("SEND_MESSAGES")) return;

    if(cmd.requirements.ownerOnly && !client.config.owners.includes(message.author.id))
    return message.reply("Access Denied (Owner Only)")
    let embed = new MessageEmbed()
    .setAuthor("Lacking Permissions ❌", message.author.displayAvatarURL({dynamic: true}))
    .addField(`You are missing the following permissions`, missingPerms(message.member, cmd.requirements.userPerms))
    .setFooter(client.user.tag)
    if(cmd.requirements.userPerms && !message.member.permissions.has(cmd.requirements.userPerms)) return message.channel.send(embed)
    
    let embed1 = new MessageEmbed()
    .setAuthor("Lacking Permissions ❌", client.user.displayAvatarURL({dynamic: true}))
    .addField(`I am missing the following permissions`, missingPerms(message.guild.me, cmd.requirements.clientPerms))
    .setFooter(client.user.tag)
    if(cmd.requirements.clientPerms && !message.guild.me.permissions.has(cmd.requirements.clientPerms)) return message.channel.send(embed1)


    if(cmd.limits) {
        const current = client.limits.get(`${commands}-${message.author.id}`);     
        if(!current) client.limits.set(`${commands}-${message.author.id}`, 1);    
        else{
            if(current >= cmd.limits.rateLimit) {
                let timeout = ms(cmd.limits.cooldown - (Date.now() - ratetime[message.author.id + commands].times));
                return message.reply("Ratelimit , You need to wait " + "``" + `${timeout.hours}h ${timeout.minutes}m ${timeout.seconds}s`+ "``")
            }
            client.limits.set(`${commands}-${message.author.id}`, current + 1);
            ratetime.add(message.author.id + commands)
            ratetime[message.author.id + commands] = {
                times: Date.now()
            }
        }
        setTimeout(() => {
            client.limits.delete(`${commands}-${message.author.id}`);
            ratetime.delete(message.author.id + commands)
        }, cmd.limits.cooldown);
    }
cmd.run(client, message, args)
        })
}
const missingPerms = (member, perms) => {
    const missingPerms = member.permissions.missing(perms)
    .map(str => `\`${str.replace(/_/g, ' ').toLowerCase().replace(/\b(\w)/g, char => char.toUpperCase())}\``);

    return missingPerms.length > 1 ? 
    `${missingPerms.slice(0, -1).join(", ")} **,** ${missingPerms.slice(-1)[0]}` :
    missingPerms[0];
}

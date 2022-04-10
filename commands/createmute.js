const servers = require("../models/servers")


module.exports.run = async (client , message, args) => {
    message.channel.send("🔄 Creating role!").then(msg => {
        let check1 =  args.slice(0).join(" ") || "Muted";
        if(message.guild.roles.cache.find(r => r.name === check1)) return msg.edit(":x: There's a role called ``" + check1 + "`` already try set it from dashboard\nOr do ``createmute [role_name]``")
        message.guild.roles.create({
            data: {
                name: args.slice(0).join(" ") || 'Muted',
                color: 'BLACK',
              },
              reason: 'Member requested to create mute role',
        }).then(role => {
        setTimeout(() => {
            msg.edit("✅ Success created ``" + check1 + "`` Role!")
        }, 3000)
            setTimeout(() => {
                msg.edit("🔄 Editing role permissions!")
                role.setPermissions(0)
            }, 6000)
            setTimeout(() => {
                msg.edit("✅ Success added role permission!")
            }, 9000)
                setTimeout(() => {
                    msg.edit("🔄 Adding role to channels overwrite permissions!")
                    message.guild.channels.cache.map(channel => {
                        channel.updateOverwrite(role.id, {
                            SEND_MESSAGES: false,
                            ADD_REACTIONS: false,
                            EMBED_LINKS: false,
                            ATTACH_FILES: false,
                            CONNECT: false
                          })
                        })
                }, 13000)
                setTimeout(() => {
                        msg.edit("✅ Success added channel permissions to mute role!\n🔄 Now i am fixing role bugs please give me a moment")
                        servers.findOne({
                            guildID: message.guild.id}, async (err, res) => {
                                if(!res){
                                    const newserver = new servers({
                                        antispam: "0",
                                        maxwarns: "3",
                                        guildID: message.guild.id,
                                        mutedrole: role.id,
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
                                    });
                                     newserver.save()
                                }else{
                                    res.mutedrole = role.id
                                    await res.save()
                                }
                            })
                    }, 20000)
                    setTimeout(() => {
                        msg.edit("✅ Success configured the role!\n🗑️ Message will be delete in 10 seconds!")
                    }, 27000)
                        setTimeout(() => {
                            msg.delete().catch(() => {})
                        }, 37000)
                    })
        .catch(() => {
            msg.edit(":x: Error occured while creating Muted Role!, retry again")
            setTimeout(() => {
            return msg.delete().catch(() => {})
        }, 5000)
        })
    })
}

module.exports.help = {
    name: "createmute",
    category: "moderation",
    aliases: ['cmute'],
    description: "Create a mute role for your server!",
    example: "``createmute [role_name]``"
}

module.exports.requirements = {
    userPerms: ["MANAGE_ROLES","MUTE_MEMBERS"],
    clientPerms: ["MANAGE_ROLES","MANAGE_CHANNELS"],
    ownerOnly: false
}

module.exports.limits = {
    rateLimit: 2,
    cooldown: 1e4
}
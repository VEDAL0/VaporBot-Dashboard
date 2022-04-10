// We import modules.
const url = require("url");
const path = require("path");
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const Strategy = require("passport-discord").Strategy;
const config = require("../config.js")
const ejs = require("ejs");
const bodyParser = require("body-parser");
const Discord = require("discord.js");
const GuildSettings = require("../models/servers");
const ERRORS = require("../models/errors")
const CASES = require("../models/cases")
const USERS = require("../models/users")
const ratelimit = new Set()
// We instantiate express app and the session store.
const app = express();
const MemoryStore = require("memorystore")(session);

// We export the dashboard as a function which we call in ready event.
module.exports = async (client) => {
  // We declare absolute paths.
  const dataDir = path.resolve(`${process.cwd()}${path.sep}dashboard`); // The absolute path of current this directory.
  const templateDir = path.resolve(`${dataDir}${path.sep}templates`); // Absolute path of ./templates directory.

  // Deserializing and serializing users without any additional logic.
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((obj, done) => done(null, obj));

  // We set the passport to use a new discord strategy, we pass in client id, secret, callback url and the scopes.
  /** Scopes:
   *  - Identify: Avatar's url, username and discriminator.
   *  - Guilds: A list of partial guilds.
  */
  passport.use(new Strategy({
    clientID: config.id,
    clientSecret: config.clientSecret,
    callbackURL: `${config.domain}/callback`,
    scope: ["identify", "guilds"]
  },
  (accessToken, refreshToken, profile, done) => { // eslint-disable-line no-unused-vars
    // On login we pass in profile with no logic.
    process.nextTick(() => done(null, profile));
  }));
  // We initialize the memorystore middleware with our express app.
  app.use(session({
    store: new MemoryStore({ checkPeriod: 86400000 }),
    secret: "#@%#&^$^$%@$^$&%#$%@#$%$^%&$%^#$%@#$%#E%#%@$FEErfgr3g#%GT%536c53cc6%5%tv%4y4hrgrggrgrgf4n",
    resave: false,
    saveUninitialized: false,
  }));

  // We initialize passport middleware.
  app.use(passport.initialize());
  app.use(passport.session());

  // We bind the domain.
  app.locals.domain = config.domain.split("//")[1];

  // We set out templating engine.
  app.engine("html", ejs.renderFile);
  app.set("view engine", "html");

  // We initialize body-parser middleware to be able to read forms.
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  // We declare a renderTemplate function to make rendering of a template in a route as easy as possible.
  const renderTemplate = (res, req, template, data = {}) => {
    // Default base data which passed to the ejs template by default. 
    const baseData = {
      bot: client,
      path: req.path,
      user: req.isAuthenticated() ? req.user : null
    };
    // We render template using the absolute path of the template and the merged default data with the additional data provided.
    res.render(path.resolve(`${templateDir}${path.sep}${template}`), Object.assign(baseData, data));
  };
  // We declare a checkAuth function middleware to check if an user is logged in or not, and if not redirect him.
  const checkAuth = (req, res, next) => {
    // If authenticated we forward the request further in the route.
    if (req.isAuthenticated()) return next();
    // If not authenticated, we set the url the user is redirected to into the memory.
    req.session.backURL = req.url;
    // We redirect user to login endpoint/route.
    res.redirect("/login");
  }

  // Login endpoint.
  app.get("/login", (req, res, next) => {
    // We determine the returning url.
    if (req.session.backURL) {
      req.session.backURL = req.session.backURL; // eslint-disable-line no-self-assign
    } else if (req.headers.referer) {
      const parsed = url.parse(req.headers.referer);
      if (parsed.hostname === app.locals.domain) {
        req.session.backURL = parsed.path;
      }
    } else {
      req.session.backURL = "/";
    }
    // Forward the request to the passport middleware.
    next();
  },
  passport.authenticate("discord"));

  // Callback endpoint.
  app.get("/callback", passport.authenticate("discord", { failureRedirect: "/" }), /* We authenticate the user, if user canceled we redirect him to index. */ (req, res) => {
    // If user had set a returning url, we redirect him there, otherwise we redirect him to index.
    if (req.session.backURL) {
      const url = req.session.backURL;
      req.session.backURL = null;
      res.redirect(url);
    } else {
      res.redirect("/");
    }
  });

  // Logout endpoint.
  app.get("/logout", function (req, res) {
    // We destroy the session.
    req.session.destroy(() => {
      // We logout the user.
      req.logout();
      // We redirect user to index.
      res.redirect("/");
    });
  });

  // Index endpoint.
  app.get("/", (req, res) => {
      renderTemplate(res, req, "index.ejs", {alert: null, error: null});
  });
  app.get("/bug", (req, res) => {
    
    renderTemplate(res, req, "bug.ejs", {alert: null, error: null});
  });
  app.get("/profile", checkAuth, async (req, res) => {
    let users = await USERS.findOne({userID: req.user.id})
    USERS.findOne({userID: req.user.id}, (err, res) =>{
if(!res){
  new USERS({
    userID: req.user.id,
    bio: "Iam a very mysterious person!"
  }).save()
}
    })
    let infractions = await CASES.find({userID: req.user.id})
    renderTemplate(res, req, "profile.ejs", {cases: infractions, profile: users, alert: null, error: null});
  });
  app.post("/profile", checkAuth, async (req, res) => {
    let users = await USERS.findOne({userID: req.user.id})
    let alertmsg = "";
    let errormsg = "";
    USERS.findOne({userID: req.user.id}, async (err, res) =>{
      if(!res){
        await new USERS({
          userID: req.user.id,
          bio: req.body.changebio || "Iam a very mysterious person!"
        }).save()
      }
          })
    let infractions = await CASES.find({userID: req.user.id})
    if(req.body.changebio){
      if(req.body.changebio.length > 50){
        errormsg = "Max length for bio is 50 characters!"
        return renderTemplate(res, req, "profile.ejs", {cases: infractions, profile: users, alert: alertmsg, error: errormsg});
      }else if(req.body.changebio.length < 10){
        errormsg = "Bio can't be less than 10 characters!"
        return renderTemplate(res, req, "profile.ejs", {cases: infractions, profile: users, alert: alertmsg, error: errormsg});
      }else{
        if(users){
        users.bio = req.body.changebio
        await users.save()
        alertmsg = "Your bio has been updated successfully!"
        users = await USERS.findOne({userID: req.user.id})
        return renderTemplate(res, req, "profile.ejs", {cases: infractions, profile: users, alert: alertmsg, error: errormsg});
        }else{
          users = await USERS.findOne({userID: req.user.id})
          alertmsg = "Your bio has been updated successfully!"
          return renderTemplate(res, req, "profile.ejs", {cases: infractions, profile: users, alert: alertmsg, error: errormsg});
        }
      }
    }

    if(req.body.captcha == "delete"){
      if(req.body.requestdelete){
            if(!users){
              errormsg = "You don't have data in our site!"
              return renderTemplate(res, req, "profile.ejs", {cases: infractions, profile: users, alert: alertmsg, error: errormsg});
          }else{
            await USERS.findOneAndDelete({userID: req.user.id})
            alertmsg = "Your data has been deleted!"
            users = await USERS.findOne({userID: req.user.id})
            return await renderTemplate(res, req, "profile.ejs", {cases: infractions, profile: users, alert: alertmsg, error: errormsg});
          }
      }
    }else{
  errormsg = "You didn't complete captcha!"
  return renderTemplate(res, req, "profile.ejs", {cases: infractions, profile: users, alert: alertmsg, error: errormsg});
    }
  
    renderTemplate(res, req, "profile.ejs", {cases: infractions, profile: users, alert: alertmsg, error: errormsg});
  });
  app.post("/bug", checkAuth, async (req, res) => {
    // We validate the request, check if guild exists, member is in guild and if member has minimum permissions, if not, we redirect it back.
    let alertmsg = "";
    let errormsg = "";
    if(ratelimit.has(req.user.id + "bug")){
      errormsg = "Ratelimited, come back after 1 min"
}else{
    // We retrive the settings stored for this guild.
    if(req.body.reportbug.length > 500){
      errormsg = "Max characters exceeded! (500 characters)"
    }else if(req.body.reportbug.length < 25){
      errormsg = "Brief report in more than 25 characters"
    }else{
      ratelimit.add(req.user.id + "bug")
        const newbug = new ERRORS({
        userID: req.user.id,
        bug: req.body.reportbug
      });
      newbug.save().catch(()=>{});
      alertmsg = "Your report has been submited and will be reviewed!"
      setTimeout(() => {
        ratelimit.delete(req.user.id + "bug")
    }, 60000);
  }
    }
    renderTemplate(res, req, "bug.ejs", { alert: `${alertmsg}`, error: `${errormsg}` });
  });
  // Dashboard endpoint.
  app.get("/dashboard", checkAuth, (req, res) => {
    renderTemplate(res, req, "dashboard.ejs", { perms: Discord.Permissions });
  });
  app.get("/privacy", (req, res) => {
    renderTemplate(res, req, "privacy.ejs");
  });
  app.get("/terms", (req, res) => {
    renderTemplate(res, req, "terms.ejs");
  });
  app.get("/commands", (req, res) => {
    renderTemplate(res, req, "commands.ejs");
  });
  app.get("/panel", async (req, res) => {
if(!req.isAuthenticated()) return res.redirect("/");
    if(!config.owners.includes(req.user.id)) return res.redirect("/");
    const bugres = await ERRORS.find({}, { _id: false, auth: false })
    bugres.filter(bug => bug)
    renderTemplate(res, req, "panel.ejs", {alert: null, error: null, reportbug: bugres});
  });
  // Settings endpoint.
  app.get("/dashboard/:guildID/actions", checkAuth, async (req, res) => {
    // We validate the request, check if guild exists, member is in guild and if member has minimum permissions, if not, we redirect it back.
    const guild = client.guilds.cache.get(req.params.guildID);
    if (!guild) return res.redirect("/dashboard");
    const member = guild.members.cache.get(req.user.id);
    if (!member) return res.redirect("/dashboard");
    if (!member.permissions.has("MANAGE_GUILD")) return res.redirect("/dashboard");

    // We retrive the settings stored for this guild.
    var storedSettings = await GuildSettings.findOne({ guildID: guild.id });
    if (!storedSettings) {
      // If there are no settings stored for this guild, we create them and try to retrive them again.
      const newSettings = new GuildSettings({
        antispam: "0",
        maxwarns: "3",
        guildID: guild.id,
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
      });
      await newSettings.save().catch(()=>{});
      storedSettings = await GuildSettings.findOne({ guildID: guild.id });
    }        
    const caseres = await CASES.find({serverID: req.params.guildID}, { _id: false, auth: false })
    caseres.filter(cases => cases)
    renderTemplate(res, req, "actions.ejs", { guild, settings: storedSettings, alert: null, error: null, cases: caseres});

  });
  app.get("/dashboard/:guildID/logs", checkAuth, async (req, res) => {
    // We validate the request, check if guild exists, member is in guild and if member has minimum permissions, if not, we redirect it back.
    const guild = client.guilds.cache.get(req.params.guildID);
    if (!guild) return res.redirect("/dashboard");
    const member = guild.members.cache.get(req.user.id);
    if (!member) return res.redirect("/dashboard");
    if (!member.permissions.has("MANAGE_GUILD")) return res.redirect("/dashboard");

    // We retrive the settings stored for this guild.
    var storedSettings = await GuildSettings.findOne({ guildID: guild.id });
    if (!storedSettings) {
      // If there are no settings stored for this guild, we create them and try to retrive them again.
      const newSettings = new GuildSettings({
        antispam: "0",
        maxwarns: "3",
        guildID: guild.id,
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
      });
      await newSettings.save().catch(()=>{});
      storedSettings = await GuildSettings.findOne({ guildID: guild.id });
    }        
    renderTemplate(res, req, "logs.ejs", { guild, settings: storedSettings, alert: null, error: null});
  });
  app.get("/dashboard/:guildID/welcome", checkAuth, async (req, res) => {
    // We validate the request, check if guild exists, member is in guild and if member has minimum permissions, if not, we redirect it back.
    const guild = client.guilds.cache.get(req.params.guildID);
    if (!guild) return res.redirect("/dashboard");
    const member = guild.members.cache.get(req.user.id);
    if (!member) return res.redirect("/dashboard");
    if (!member.permissions.has("MANAGE_GUILD")) return res.redirect("/dashboard");

    // We retrive the settings stored for this guild.
    var storedSettings = await GuildSettings.findOne({ guildID: guild.id });
    if (!storedSettings) {
      // If there are no settings stored for this guild, we create them and try to retrive them again.
      const newSettings = new GuildSettings({
        antispam: "0",
        maxwarns: "3",
        guildID: guild.id,
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
      });
      await newSettings.save().catch(()=>{});
      storedSettings = await GuildSettings.findOne({ guildID: guild.id });
    }        
    renderTemplate(res, req, "welcomer.ejs", { guild, settings: storedSettings, alert: null, error: null});
  });
  app.get("/dashboard/:guildID", checkAuth, async (req, res) => {
    // We validate the request, check if guild exists, member is in guild and if member has minimum permissions, if not, we redirect it back.
    const guild = await client.guilds.cache.get(req.params.guildID);
    if (!guild) return res.redirect("/dashboard");
    const member = await client.guilds.cache.get(guild.id).members.cache.get(req.user.id);
    if (!member) return res.redirect(`/dashboard/${guild.id}`); await client.users.fetch(req.user.id);
    if (!member.permissions.has("MANAGE_GUILD")) return res.redirect("/dashboard");

    // We retrive the settings stored for this guild.
    var storedSettings = await GuildSettings.findOne({ guildID: guild.id });
    if (!storedSettings) {
      // If there are no settings stored for this guild, we create them and try to retrive them again.
      const newSettings = new GuildSettings({
        antispam: "0",
        maxwarns: "3",
        guildID: guild.id,
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
      });
      await newSettings.save().catch(()=>{});
      storedSettings = await GuildSettings.findOne({ guildID: guild.id });
    }
    const cases = await CASES.find({serverID: guild.id}, { _id: false, auth: false })
    cases.filter(cases => cases)

    renderTemplate(res, req, "settings.ejs", {infractions: cases, guild, settings: storedSettings, alert: null });
  });
  app.get("/dashboard/:guildID/automod", checkAuth, async (req, res) => {
    // We validate the request, check if guild exists, member is in guild and if member has minimum permissions, if not, we redirect it back.
    const guild = client.guilds.cache.get(req.params.guildID);
    if (!guild) return res.redirect("/dashboard");
    const member = guild.members.cache.get(req.user.id);
    if (!member) return res.redirect("/dashboard");
    if (!member.permissions.has("MANAGE_GUILD")) return res.redirect("/dashboard");

    // We retrive the settings stored for this guild.
    var storedSettings = await GuildSettings.findOne({ guildID: guild.id });
    if (!storedSettings) {
      // If there are no settings stored for this guild, we create them and try to retrive them again.
      const newSettings = new GuildSettings({
        antispam: "0",
            maxwarns: "3",
            guildID: guild.id,
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
      });
      await newSettings.save().catch(()=>{});
      storedSettings = await GuildSettings.findOne({ guildID: guild.id });
    }
    renderTemplate(res, req, "automod.ejs", { guild, settings: storedSettings, alert: null });
  });
  app.get("/dashboard/:guildID/others", checkAuth, async (req, res) => {
    // We validate the request, check if guild exists, member is in guild and if member has minimum permissions, if not, we redirect it back.
    const guild = client.guilds.cache.get(req.params.guildID);
    if (!guild) return res.redirect("/dashboard");
    const member = guild.members.cache.get(req.user.id);
    if (!member) return res.redirect("/dashboard");
    if (!member.permissions.has("MANAGE_GUILD")) return res.redirect("/dashboard");

    // We retrive the settings stored for this guild.
    var storedSettings = await GuildSettings.findOne({ guildID: guild.id });
    if (!storedSettings) {
      // If there are no settings stored for this guild, we create them and try to retrive them again.
      const newSettings = new GuildSettings({
        antispam: "0",
        maxwarns: "3",
        guildID: guild.id,
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
      });
      await newSettings.save().catch(()=>{});
      storedSettings = await GuildSettings.findOne({ guildID: guild.id });
    }
    renderTemplate(res, req, "others.ejs", { guild, settings: storedSettings, alert: null, error: null });
  });
  app.get("/dashboard/:guildID/roles", checkAuth, async (req, res) => {
    // We validate the request, check if guild exists, member is in guild and if member has minimum permissions, if not, we redirect it back.
    const guild = client.guilds.cache.get(req.params.guildID);
    if (!guild) return res.redirect("/dashboard");
    const member = guild.members.cache.get(req.user.id);
    if (!member) return res.redirect("/dashboard");
    if (!member.permissions.has("MANAGE_GUILD")) return res.redirect("/dashboard");

    // We retrive the settings stored for this guild.
    var storedSettings = await GuildSettings.findOne({ guildID: guild.id });
    if (!storedSettings) {
      // If there are no settings stored for this guild, we create them and try to retrive them again.
      const newSettings = new GuildSettings({
        antispam: "0",
        maxwarns: "3",
        guildID: guild.id,
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
      });
      await newSettings.save().catch(()=>{});
      storedSettings = await GuildSettings.findOne({ guildID: guild.id });
    }
    renderTemplate(res, req, "roles.ejs", { guild, settings: storedSettings, alert: null, error: null });
  });
  app.post("/dashboard/:guildID/automod", checkAuth, async (req, res) => {
    // We validate the request, check if guild exists, member is in guild and if member has minimum permissions, if not, we redirect it back.
    const guild = client.guilds.cache.get(req.params.guildID);
    if (!guild) return res.redirect("/dashboard");
    const member = guild.members.cache.get(req.user.id);
    if (!member) return res.redirect("/dashboard");
    if (!member.permissions.has("MANAGE_GUILD")) return res.redirect("/dashboard");
    // We retrive the settings stored for this guild.
    var storedSettings = await GuildSettings.findOne({ guildID: guild.id });
    if (!storedSettings) {
      // If there are no settings stored for this guild, we create them and try to retrive them again.
      const newSettings = new GuildSettings({
        antispam: "0",
        maxwarns: "3",
        guildID: guild.id,
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
      });
      await newSettings.save().catch(()=>{});
      storedSettings = await GuildSettings.findOne({ guildID: guild.id });
    }
    // We set the prefix of the server settings to the one that was sent in request from the form.                                          
    if(req.body.antispam){
      if(req.body.antispam == "Disabled"){
        storedSettings.antispam = "0"
        storedSettings.save().catch(() => {})
      }else{
      storedSettings.antispam = req.body.antispam
      storedSettings.save().catch(() => {})
      }
  }
  if(req.body.antiraid){
    if(req.body.antiraid == "Disabled"){
      storedSettings.antiraid = "0"
      storedSettings.save().catch(() => {})
    }else{
    storedSettings.antiraid = req.body.antiraid
    storedSettings.save().catch(() => {})
    }
}
    // We save the settings.
    await storedSettings.save().catch(() => {});

    // We render the template with an alert text which confirms that settings have been saved.
    renderTemplate(res, req, "automod.ejs", { guild, settings: storedSettings, alert: "Success saved changes!" });
     });
     app.post("/dashboard/:guildID/roles", checkAuth, async (req, res) => {
      // We validate the request, check if guild exists, member is in guild and if member has minimum permissions, if not, we redirect it back.
      const guild = client.guilds.cache.get(req.params.guildID);
      if (!guild) return res.redirect("/dashboard");
      const member = guild.members.cache.get(req.user.id);
      if (!member) return res.redirect("/dashboard");
      if (!member.permissions.has("MANAGE_GUILD")) return res.redirect("/dashboard");
      // We retrive the settings stored for this guild.
      var storedSettings = await GuildSettings.findOne({ guildID: guild.id });
      if (!storedSettings) {
        // If there are no settings stored for this guild, we create them and try to retrive them again.
        const newSettings = new GuildSettings({
          antispam: "0",
          maxwarns: "3",
          guildID: guild.id,
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
        });
        await newSettings.save().catch(()=>{});
        storedSettings = await GuildSettings.findOne({ guildID: guild.id });
      }
      // We set the prefix of the server settings to the one that was sent in request from the form.                                          
      let errormsg = ""
      let alertmsg = ""
      if(req.body.muterolesettings){
      if(req.body.muterolesettings == "None"){
      }else if(req.body.muterolesettings == "remove"){
      storedSettings.mutedrole = "String"
      await storedSettings.save().catch(() => {});
      }else{
      storedSettings.mutedrole = req.body.muterolesettings
      await storedSettings.save().catch(() => {});
      }
    }
    if(req.body.autorole){
      if(req.body.autorole == "None"){
      }else if(req.body.autorole == "remove"){
      storedSettings.autorole = "String"
      await storedSettings.save().catch(() => {});
      }else{
      storedSettings.autorole = req.body.autorole
      await storedSettings.save().catch(() => {});
      }
    }
    if(req.body.botautorole){
      if(req.body.botautorole == "None"){
      }else if(req.body.botautorole == "remove"){
      storedSettings.botautorole = "String"
      await storedSettings.save().catch(() => {});
      }else{
      storedSettings.botautorole = req.body.botautorole
      await storedSettings.save().catch(() => {});
      }
    }
      // We save the settings.
  
      // We render the template with an alert text which confirms that settings have been saved.
      renderTemplate(res, req, "roles.ejs", { guild, settings: storedSettings, alert: `Success saved settings!`, error: `${errormsg}` });
       });
       app.post("/dashboard/:guildID/logs", checkAuth, async (req, res) => {
        // We validate the request, check if guild exists, member is in guild and if member has minimum permissions, if not, we redirect it back.
        const guild = client.guilds.cache.get(req.params.guildID);
        if (!guild) return res.redirect("/dashboard");
        const member = guild.members.cache.get(req.user.id);
        if (!member) return res.redirect("/dashboard");
        if (!member.permissions.has("MANAGE_GUILD")) return res.redirect("/dashboard");
        // We retrive the settings stored for this guild.
        var storedSettings = await GuildSettings.findOne({ guildID: guild.id });
        if (!storedSettings) {
          // If there are no settings stored for this guild, we create them and try to retrive them again.
          const newSettings = new GuildSettings({
            antispam: "0",
            maxwarns: "3",
            guildID: guild.id,
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
          });
          await newSettings.save().catch(()=>{});
          storedSettings = await GuildSettings.findOne({ guildID: guild.id });
        }
        // We set the prefix of the server settings to the one that was sent in request from the form.                                          
        let errormsg = ""
        let alertmsg = ""
        {
    if(req.body.auditchannel){
      if(req.body.auditchannel == "None"){
        storedSettings.audit = "String"
        storedSettings.save().catch(() => {})
      }else{
      storedSettings.audit = req.body.auditchannel
      storedSettings.save().catch(() => {})
      }
  }
  if(req.body.modchannel){
    if(req.body.modchannel == "None"){
      storedSettings.mod = "String"
      storedSettings.save().catch(() => {})
    }else{
    storedSettings.mod = req.body.modchannel
    storedSettings.save().catch(() => {})
    }
}
      alertmsg = "Success saved logs!"
}
        // We save the settings.
    
        // We render the template with an alert text which confirms that settings have been saved.
        renderTemplate(res, req, "logs.ejs", { guild, settings: storedSettings, alert: `${alertmsg}`, error: `${errormsg}` });
         });
         app.post("/dashboard/:guildID/welcome", checkAuth, async (req, res) => {
          // We validate the request, check if guild exists, member is in guild and if member has minimum permissions, if not, we redirect it back.
          const guild = client.guilds.cache.get(req.params.guildID);
          if (!guild) return res.redirect("/dashboard");
          const member = guild.members.cache.get(req.user.id);
          if (!member) return res.redirect("/dashboard");
          if (!member.permissions.has("MANAGE_GUILD")) return res.redirect("/dashboard");
          // We retrive the settings stored for this guild.
          var storedSettings = await GuildSettings.findOne({ guildID: guild.id });
          if (!storedSettings) {
            // If there are no settings stored for this guild, we create them and try to retrive them again.
            const newSettings = new GuildSettings({
              antispam: "0",
              maxwarns: "3",
              guildID: guild.id,
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
            });
            await newSettings.save().catch(()=>{});
            storedSettings = await GuildSettings.findOne({ guildID: guild.id });
          }
          // We set the prefix of the server settings to the one that was sent in request from the form.                                          
          let errormsg = ""
          let alertmsg = ""
          {
          if(req.body.leavechannel){
            if(req.body.leavechannel == "None"){
              storedSettings.leave = "String"
              storedSettings.save().catch(() => {})
            }else{
            storedSettings.leave = req.body.leavechannel
            storedSettings.save().catch(() => {})
            }
        }
        if(req.body.welcomechannel){
          if(req.body.welcomechannel == "None"){
            storedSettings.welcome = "String"
            storedSettings.save().catch(() => {})
          }else{
          storedSettings.welcome = req.body.welcomechannel
          storedSettings.save().catch(() => {})
          }
      }
      if(!req.body.welcomemsg){
        storedSettings.welcomemsg = "String"
        storedSettings.save().catch(() => {})
      }
      if(req.body.welcomemsg){
        if(req.body.welcomemsg.length < 10){
          errormsg = "Welcome msg can't be less than 10 letters"
          return renderTemplate(res, req, "welcomer.ejs", { guild, settings: storedSettings, alert: `${alertmsg}`, error: `${errormsg}` });
        }else if(req.body.welcomemsg.length > 500){
          errormsg = "welcome msg can't be more than 500 letters"
          return renderTemplate(res, req, "welcomer.ejs", { guild, settings: storedSettings, alert: `${alertmsg}`, error: `${errormsg}` });
        }else{
        storedSettings.welcomemsg = req.body.welcomemsg
        storedSettings.save().catch(() => {})
        }
    }
    if(!req.body.leavemsg){
      storedSettings.leavemsg = "String"
      storedSettings.save().catch(() => {})
    }
      if(req.body.leavemsg){
       if(req.body.leavemsg.length < 10){
          errormsg = "Leave msg can't be less than 10 letters"
          return renderTemplate(res, req, "welcomer.ejs", { guild, settings: storedSettings, alert: `${alertmsg}`, error: `${errormsg}` });
        }else if(req.body.leavemsg.length > 500){
          errormsg = "Leave msg can't be more than 500 letters"
          return renderTemplate(res, req, "welcomer.ejs", { guild, settings: storedSettings, alert: `${alertmsg}`, error: `${errormsg}` });
        }else{
        storedSettings.leavemsg = req.body.leavemsg
        storedSettings.save().catch(() => {})
        }
    }
    if(!req.body.privatemsg){
      storedSettings.private = "String"
      storedSettings.save().catch(() => {})
    }
    if(req.body.privatemsg){
      if(req.body.privatemsg.length < 10){
         errormsg = "Private welcome msg can't be less than 10 letters"
         return renderTemplate(res, req, "welcomer.ejs", { guild, settings: storedSettings, alert: `${alertmsg}`, error: `${errormsg}` });
       }else if(req.body.privatemsg.length > 500){
         errormsg = "Private welcome msg can't be more than 500 letters"
         return renderTemplate(res, req, "welcomer.ejs", { guild, settings: storedSettings, alert: `${alertmsg}`, error: `${errormsg}` });
       }else{
       storedSettings.private = req.body.privatemsg
       storedSettings.save().catch(() => {})
       }
   }
    alertmsg = "Success saved updates!"
  }
          // We save the settings.
      
          // We render the template with an alert text which confirms that settings have been saved.
          renderTemplate(res, req, "welcomer.ejs", { guild, settings: storedSettings, alert: `${alertmsg}`, error: `${errormsg}` });
           });
     app.post("/dashboard/:guildID/others", checkAuth, async (req, res) => {
      // We validate the request, check if guild exists, member is in guild and if member has minimum permissions, if not, we redirect it back.
      const guild = client.guilds.cache.get(req.params.guildID);
      if (!guild) return res.redirect("/dashboard");
      const member = guild.members.cache.get(req.user.id);
      if (!member) return res.redirect("/dashboard");
      if (!member.permissions.has("MANAGE_GUILD")) return res.redirect("/dashboard");
      // We retrive the settings stored for this guild.
      var storedSettings = await GuildSettings.findOne({ guildID: guild.id });
      if (!storedSettings) {
        // If there are no settings stored for this guild, we create them and try to retrive them again.
        const newSettings = new GuildSettings({
          antispam: "0",
          maxwarns: "3",
          guildID: guild.id,
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
        });
        await newSettings.save().catch(()=>{});
        storedSettings = await GuildSettings.findOne({ guildID: guild.id });
      }
    
      // We set the prefix of the server settings to the one that was sent in request from the form.
      let errormsg = ""
      let alertmsg = ""
     {
      if(req.body.prefix){
      if(req.body.prefix.length < 1){
         errormsg = "Prefix can't be empty"
        return  renderTemplate(res, req, "others.ejs", { guild, settings: storedSettings, alert: `${alertmsg}`, error: `${errormsg}` });
      }else if(req.body.prefix.length > 5){
       errormsg = "Prefix length can't be more than 5 letters!"
        return  renderTemplate(res, req, "others.ejs", { guild, settings: storedSettings, alert: `${alertmsg}`, error: `${errormsg}` });
      }else{
        storedSettings.prefix = req.body.prefix; 
        if(guild.channels.cache.get(storedSettings.mod)){
          guild.channels.cache.get(storedSettings.mod).send(`✏️ Server prefix has been changed to \`${req.body.prefix}\``)
          }
        // We save the settings.
        await storedSettings.save().catch(() => {});
        }    
      }    
      if(req.body.maxwarns){
      if(req.body.maxwarns.length > 2){
        errormsg = "Max warns is 99"
        return  renderTemplate(res, req, "others.ejs", { guild, settings: storedSettings, alert: `${alertmsg}`, error: `${errormsg}` });
      }else if(isNaN(req.body.maxwarns)){
         errormsg = "Only numbers are allowed at maxwarns"
         return  renderTemplate(res, req, "others.ejs", { guild, settings: storedSettings, alert: `${alertmsg}`, error: `${errormsg}` });
      }else{
        storedSettings.maxwarns = req.body.maxwarns;      // We save the settings.
        await storedSettings.save().catch(() => {});
        }    
      }    
      if(req.body.nickname){
        if(req.body.nickname.length > 25){
          errormsg = "Nickname can't be longer than 25 letter!"
          return  renderTemplate(res, req, "others.ejs", { guild, settings: storedSettings, alert: `${alertmsg}`, error: `${errormsg}` });
        }else{
          guild.me.setNickname(req.body.nickname)
          }    
        }             
       
      alertmsg = "Success saved changes!"
    }            

      // We render the template with an alert text which confirms that settings have been saved.
      renderTemplate(res, req, "others.ejs", { guild, settings: storedSettings, alert: `${alertmsg}`, error: `${errormsg}` });
       });
       app.post("/panel", checkAuth , async (req, res) => {
        // We validate the request, check if guild exists, member is in guild and if member has minimum permissions, if not, we redirect it back.
    if(!config.owners.includes(req.user.id)) return res.redirect("/");
        // We retrive the settings stored for this guild.
        let alertmsg = ""
        let errormsg = ""
        if(req.body.commandreload){
        try{
          delete require.cache[require.resolve(`../commands/${req.body.commandreload}.js`)] // 
          client.commands.delete(req.body.commandreload)
          const pull = require(`../commands/${req.body.commandreload}.js`)
          client.commands.set(req.body.commandreload, pull)
          alertmsg = `Success reloaded ${req.body.commandreload} !`
        }catch (e){
          errormsg = `Error occured while reloading !`
        }
      }else if(req.body.acceptbug){
        ERRORS.findOneAndDelete({userID: req.body.acceptbug},(err, res) => {
if(!res){
  errormsg = `Error occured while accepting bug !`
}else{
  alertmsg = `Success accepted the bug (which means fixed)!`
}
        })
      }

      const bugres = await ERRORS.find({}, { _id: false, auth: false })
      bugres.filter(bug => bug)
  
        // We render the template with an alert text which confirms that settings have been saved.
        renderTemplate(res, req, "panel.ejs", { alert: `${alertmsg}`,error: `${errormsg}`, reportbug: bugres });
         });
  app.post("/dashboard/:guildID/actions", checkAuth , async (req, res) => {
          // We validate the request, check if guild exists, member is in guild and if member has minimum permissions, if not, we redirect it back.
          const guild = client.guilds.cache.get(req.params.guildID);
          if (!guild) return res.redirect("/dashboard");
          const member = guild.members.cache.get(req.user.id);
          if (!member) return res.redirect("/dashboard");
          if (!member.permissions.has("MANAGE_GUILD")) return res.redirect("/dashboard");
          // We retrive the settings stored for this guild.
          var storedSettings = await GuildSettings.findOne({ guildID: guild.id });
          if (!storedSettings) {
            // If there are no settings stored for this guild, we create them and try to retrive them again.
            const newSettings = new GuildSettings({
              antispam: "0",
              maxwarns: "3",
              guildID: guild.id,
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
            });
            await newSettings.save().catch(()=>{});
            storedSettings = await GuildSettings.findOne({ guildID: guild.id });
          }
          // We retrive the settings stored for this guild.
          let alertmsg = ""
          let errormsg = ""
         if(req.body.deletecase){
          CASES.findOneAndDelete({
            serverID: req.params.guildID,
            case: req.body.deletecase},(err, res) => {
  if(!res){
    errormsg = `Error occured while deleting case !`
  }else{
    if(guild.channels.cache.get(storedSettings.mod)){
    guild.channels.cache.get(storedSettings.mod).send(`🗑️ Case number \`#${req.body.deletecase}\` has been deleted!`)
    }
    alertmsg = `Success deleted case number ${req.body.deletecase}!`
  }
          })
        }
  
        const caseres = await CASES.find({serverID: req.params.guildID}, { _id: false, auth: false })
        caseres.filter(cases => cases)
    
          // We render the template with an alert text which confirms that settings have been saved.
          renderTemplate(res, req, "actions.ejs", { guild, settings: storedSettings, alert: `${alertmsg}`,error: `${errormsg}`, cases: caseres });
        });
    // Settings endpoint.
    app.post("/dashboard/:guildID", checkAuth, async (req, res) => {
        // We validate the request, check if guild exists, member is in guild and if member has minimum permissions, if not, we redirect it back.
        const guild = client.guilds.cache.get(req.params.guildID);
        if (!guild) return res.redirect("/dashboard");
        const member = guild.members.cache.get(req.user.id);
        if (!member) return res.redirect("/dashboard");
        if (!member.permissions.has("MANAGE_GUILD")) return res.redirect("/dashboard");
        // We retrive the settings stored for this guild.
        var storedSettings = await GuildSettings.findOne({ guildID: guild.id });
        if (!storedSettings) {
          // If there are no settings stored for this guild, we create them and try to retrive them again.
          const newSettings = new GuildSettings({
            antispam: "0",
            maxwarns: "3",
            guildID: guild.id,
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
          });
          await newSettings.save().catch(()=>{});
          storedSettings = await GuildSettings.findOne({ guildID: guild.id });
        }
      
        // We set the prefix of the server settings to the one that was sent in request from the form.
        // We save the settings.
        await storedSettings.save().catch(() => {});
        if(req.body.leaveserver){
        client.guilds.cache.get(req.body.leaveserver).leave()
        return res.redirect("/")
        }
    const cases = await CASES.find({serverID: guild.id}, { _id: false, auth: false })
    cases.filter(cases => cases)
        // We render the template with an alert text which confirms that settings have been saved.
        renderTemplate(res, req, "settings.ejs", { infractions: cases ,guild, settings: storedSettings, alert: "Success kicked the bot" });
         });
app.listen(config.port, null, null, () => console.log(`Dashboard is ready at ${config.port}.`));
};

const Discord = require("discord.js");
const client = new Discord.Client();
const ms = require("ms");
const fs = require("fs");

client.login("NDY2Mjc1NTkyNDMwNTUxMDQw.DiZsgA.DnTVjJnlo87_0FD75AKwputBn9k");

var prefix = "-";

client.on('ready', () => {
  console.log(`${client.user.tag} logged in`);
  client.user.setActivity("|-help|", {type: "PLAYING"});
});


client.on("message", async message => {
let xpAdd = Math.floor(Math.random() * 7) + 8;
  console.log(xpAdd);
let xp = require("./xp.json");
  if(!xp[message.author.id]){
    xp[message.author.id] = {
      xp: 0,
      level: 1
    };
  }


  let curxp = xp[message.author.id].xp;
  let curlvl = xp[message.author.id].level;
  let nxtLvl = xp[message.author.id].level * 300;
  xp[message.author.id].xp =  curxp + xpAdd;
  if(nxtLvl <= xp[message.author.id].xp){
    xp[message.author.id].level = curlvl + 1;
    let lvlup = new Discord.RichEmbed()
    .setTitle("Level Up!")
    .setColor("#9217d8")
    .addField("New Level", curlvl + 1);

    message.channel.send(lvlup).then(msg => {msg.delete(5000)});
  }
  fs.writeFile("./xp.json", JSON.stringify(xp), (err) => {
    if(err) console.log(err)
  });
});

client.on('message', message => {
	let warns = JSON.parse(fs.readFileSync("./warnings.json", "utf8"));
	let xp = require("./xp.json");
  if(message.content.startsWith(prefix)) {
  if(message.author.bot||message.channel.type!=="text") return;  
  if(message.content.toLowerCase().startsWith(prefix+"clean")) return commands.clean(message);
    else if(message.content.toLowerCase().startsWith(prefix+"kick")) return commands.kick(message);
	else if(message.content.toLowerCase().startsWith(prefix+"help")) return commands.help(message);
	else if(message.content.toLowerCase().startsWith(prefix+"ban")) return commands.ban(message);
	else if(message.content.toLowerCase().startsWith(prefix+"softban")) return commands.softban(message);
	else if(message.content.toLowerCase().startsWith(prefix+"mute")) return commands.mute(message);
	else if(message.content.toLowerCase().startsWith(prefix+"unmute")) return commands.unmute(message);
	else if(message.content.toLowerCase().startsWith(prefix+"level")) return commands.level(message, xp);
	else if(message.content.toLowerCase().startsWith(prefix+"warnings")) return commands.warnlevel(message, warns);
	else if(message.content.toLowerCase().startsWith(prefix+"warn")) return commands.warn(message, warns);
	else if(message.content.toLowerCase().startsWith(prefix+"info")) return commands.serverInfo(message);
	else if(message.content.toLowerCase().startsWith(prefix+"wr")) return commands.warnReset(message, warns);
	else if(message.content.toLowerCase().startsWith(prefix+"announce")) return commands.announce(message);
    else return message.reply("Couldn't find this command.");
  }
});

var commands = {
	//
	//help command
	//
	help: function(message) {
		message.author.send("",{embed:new Discord.RichEmbed()
	  .setColor('#fc4144')
      .setTitle("Xem Moderation commands.")
	  .addField("**1. Clean**", "Cleans amount of message up to 100. __(Exmaple: -clean 100.)__")
	  .addField("**2. Kick**", "Kick a player. __(Exmaple: -Kick @Name Bad language.)__")
	  .addField("**3. Ban**", "Ban a player. __(Example: -ban @Name Test.)__")
	  .addField("**4. SoftBan**", "Ban a player and then unban them to delete their messages. __(Example: -softban @name Spamming.)__")
	  .addField("**5. Mute**", "Mutes a player for amount of time (s,m,h,d,y). __(Exmaple: -Mute @name 10m spamming.)__")
	  .addField("**6. Unmute**", "Unmutes a player. __(Exmaple: -unmute @name.)__")
	  .addField("**7. Level**", "Check your level and xp. __(Exmaple: -level.)__")
	  .addField("**8. Warn**", "Warns a player. __(Exmaple: -warn @name Breaking the rules.)__")
	  .addField("**9. Warnings**", "Check the amount of warnings of a player. __(Example: -warnings @name.)__")
	  .addField("**10. WarnReset**", "Reset the warnings of a player. __(Example: -wr @name.)__")
	  .addField("**11. ServerInfo**", "Show the server info. __(Example: -info.)__")
	  .addField("**12. Announcement**", "Announce a message in the #announcement channel. __(Example: -announce TEXT.)__")
    });
	message.reply("I sent you a PM")	
	},
  //
  //warn reset command
  //
  warnReset: function(message, warns) {
	if(!checkRole(message, "Administration")) return message.channel.send("You dont have permissions.");
  let wUser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0])
  if(!wUser) return message.reply("Couldn't find them yo");
  warns[wUser.id].warns = 0;
  message.reply(`<@${wUser.id}> now has **0** warnings.`);
    fs.writeFile("./warnings.json", JSON.stringify(warns), (err) => {
    if (err) console.log(err)
  });
  },
	//
	//clean command
	//
	clean: function(message) {
	if(!checkRole(message, "Administration")) return message.channel.send("",{embed:new Discord.RichEmbed()
	  .setColor('#b81010')
      .setTitle("Error")
	  .setDescription("You don't have permission to use this command!")
	  .setFooter("© Acolyte Services 2017-2018.", message.guild.iconURL)
    });
    var args = message.content.split(" ").slice(1);
	if(parseInt(args[0]) > 100) return message.reply("you have limit of 100 messages to delete");
    async function purge() {
      message.delete();
      var messages = await message.channel.fetchMessages({limit:parseInt(args[0])});
      message.channel.bulkDelete(messages, true);
    }
    purge();
  },
  //
  //server info command
  //
  serverInfo: function(message) {
	var sicon = message.guild.iconURL;
    var embed = new Discord.RichEmbed() 
		.setAuthor("Server Information", sicon)
        .setColor("#3fccc7")
        .setThumbnail(sicon)
        .addField("Server Name", message.guild.name, true)
        .addField("Server Owner", `\`${message.guild.owner.user.tag}\``)
        .addField("Members", message.guild.members.size, true)
        .addField("Roles", message.guild.roles.size)
        .addField("Created On",(message.guild.createdAt), true)
		message.channel.send(embed);
  },
  //
  //kick command
  //
  kick: function(message) {
	  if(!checkRole(message, "Administration")) return message.channel.send("You dont have permissions."); 
	let kUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!kUser) return message.channel.send("Can't find user!");
	var args = message.content.split(" ");
    let kReason = args.slice(2).join(" ");
    if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("No can do pal!");
    if(kUser.hasPermission("MANAGE_MESSAGES")) return message.channel.send("That person can't be kicked!");

    let kickEmbed = new Discord.RichEmbed()
    .setDescription("~Kick~")
    .setColor("#e0ef0b")
    .addField("Kicked User", `${kUser} with ID ${kUser.id}`)
    .addField("Kicked By", `<@${message.author.id}> with ID ${message.author.id}`)
    .addField("Kicked In", message.channel)
    .addField("Tiime", message.createdAt)
    .addField("Reason", kReason);

    let kickChannel = message.guild.channels.find(`name`, "mod-logs");
    if(!kickChannel) return message.channel.send("Can't find mod-logs channel.");

    message.guild.member(kUser).kick(kReason);
    kickChannel.send(kickEmbed);

    return;  
  },
    //
	//announce command
	//
  announce: function(message) {
   if(!checkRole(message, "Administration")) return message.channel.send("You dont have permission to use this command.");
  var announceChannel = message.guild.channels.find("name","announcements");
  announceChannel.send(message.content.split(" ").slice(1).join(" "))
},
  //
 //xp level command
 //
  level: function(message, xp) {
	if(!xp[message.author.id]){
   xp[message.author.id] = {
     xp: 0,
     level: 1
  };
}
  let curxp = xp[message.author.id].xp;
  let curlvl = xp[message.author.id].level;
  let nxtLvlXp = curlvl * 300;
  let difference = nxtLvlXp - curxp;

  let lvlEmbed = new Discord.RichEmbed()
  .setAuthor(`${message.author.tag}`, message.author.avatarURL)
  .setColor("#9217d8")
  .addField("Level", curlvl, true)
  .addField("XP", curxp, true)
  .setFooter(`${difference} XP til level up`, message.author.displayAvatarURL);
                                //remove the // below if you want the message to be deleted after few secends.
  message.channel.send(lvlEmbed)//.then(msg => {msg.delete(5000)});

  },
  //
  //ban command
  //
  ban: function(message) {
	  if(!checkRole(message, "Administration")) return message.channel.send("You dont have permissions."); 
	  let bUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!bUser) return message.channel.send("Can't find user!");
	var args = message.content.split(" ");
    let bReason = args.slice(2).join(" ");
    if(!message.member.hasPermission("MANAGE_MEMBERS")) return message.channel.send("No can do pal!");
    if(bUser.hasPermission("MANAGE_MESSAGES")) return message.channel.send("That person can't be kicked!");

    let banEmbed = new Discord.RichEmbed()
    .setDescription("~Ban~")
    .setColor("#bc0000")
    .addField("Banned User", `${bUser} with ID ${bUser.id}`)
    .addField("Banned By", `<@${message.author.id}> with ID ${message.author.id}`)
    .addField("Banned In", message.channel)
    .addField("Time", message.createdAt)
    .addField("Reason", bReason);

    let incidentchannel = message.guild.channels.find(`name`, "mod-logs");
    if(!incidentchannel) return message.channel.send("Can't find mod-logs channel.");

    message.guild.member(bUser).ban(bReason);
    incidentchannel.send(banEmbed);


    return;
  },
  //
  //soft ban command
  //
  softban: function(message) {
	if(!checkRole(message, "Administration")) return message.channel.send("You dont have permissions.");  
	let skUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!skUser) return message.channel.send("Can't find user!");
	var args = message.content.split(" ");
    let skReason = args.slice(2).join(" ");
    if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("No can do pal!");
    if(skUser.hasPermission("MANAGE_MESSAGES")) return message.channel.send("That person can't be kicked!");

    let skickEmbed = new Discord.RichEmbed()
    .setDescription("~SoftBan~")
    .setColor("#e56b00")
    .addField("SoftBanned User", `${skUser} with ID ${skUser.id}`)
    .addField("SoftBanned By", `<@${message.author.id}> with ID ${message.author.id}`)
    .addField("SoftBanned In", message.channel)
    .addField("Tiime", message.createdAt)
    .addField("Reason", skReason);

    let skickChannel = message.guild.channels.find(`name`, "mod-logs");
    if(!skickChannel) return message.channel.send("Can't find mod-logs channel.");

    message.guild.member(skUser).kick(skReason);
    skickChannel.send(skickEmbed);
	message.channel.fetchMessages({limit:100}).then(messages => {
		messages.forEach((msg, id) => {
			if(msg.author.id == message.mentions.users.first().id)
			{
				msg.delete();
			}
		});
	});
	
 },
 //
 //unmute command
 //
 unmute: function(message) {
	if(!checkRole(message, "Administration")) return message.channel.send("You dont have permissions.");  
    var id = message.mentions.members.first().id;
	  if(!id) return;
	  message.guild.members.find("id", id).removeRole(message.guild.roles.find("name","muted"));	
 },
 //
 //mute command
 //
 mute:  async function(message) {
	//note about the mute command: if the bot will shut down while people are in mute, the timer will stop and they wont be unmuted and you will have to do the
    //unmute command or to take it manually.	
  if(!checkRole(message, "Administration")) return message.channel.send("You dont have permissions.");	 
  let tomute = message.mentions.members.first();
  if(!tomute) return message.reply("Couldn't find user.");
  if(tomute.hasPermission("MANAGE_MESSAGES")) return message.reply("Can't mute them!");
  let muterole = message.guild.roles.find(`name`, "muted");
  if(!muterole){
    try{
      muterole = await message.guild.createRole({
        name: "muted",
        color: "#000000",
        permissions:[]
      })
      message.guild.channels.forEach(async (channel, id) => {
        await channel.overwritePermissions(muterole, {
          SEND_MESSAGES: false,
          ADD_REACTIONS: false
        });
      });
    }catch(e){
      console.log(e.stack);
    }
  }
  var args = message.content.replace(/\s\s+/g, ' ').split(" ");
  console.log(args);
  let mutetime = args[2];
  if(!mutetime) return message.reply("You didn't specify a time!");
  await tomute.addRole(muterole.id);
  message.reply(`<@${tomute.id}> has been muted for ${ms(ms(mutetime))}`);

  setTimeout(function(){
    tomute.removeRole(muterole.id);
    message.channel.send(`<@${tomute.id}> has been unmuted!`);
  }, ms(mutetime));
 },
  //
  //warn command
  //
  warn: async function(message, warns) {
	
  if(!checkRole(message, "Administration")) return message.channel.send("You dont have permissions.");
  let wUser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0])
  if(!wUser) return message.reply("Couldn't find them yo");
  if(wUser.hasPermission("MANAGE_MESSAGES")) return message.reply("They waaaay too kewl");
  var args = message.content.split(" ");
  let reason = args.slice(2).join(" ");
  if(!reason) return message.reply("No warn reason has been added.");
  if(!warns[wUser.id]) warns[wUser.id] = {
    warns: 0
  };

  warns[wUser.id].warns++;

  fs.writeFile("./warnings.json", JSON.stringify(warns), (err) => {
    if (err) console.log(err)
  });

  let warnEmbed = new Discord.RichEmbed()
  .setDescription("~Warn~")
  .setColor("#03a526")
  .addField("Warned User", `<@${wUser.id}>`)
  .addField("Warned In", message.channel)
  .addField("Number of Warnings", warns[wUser.id].warns)
  .addField("Reason", reason);

  let warnchannel = message.guild.channels.find(`name`, "mod-logs");
  if(!warnchannel) return message.reply("Couldn't find channel");

  warnchannel.send(warnEmbed);
   if(warns[wUser.id].warns == 1){
	  message.mentions.users.first().send(`You have been **warned** in the ${message.guild.name} server because of: **${reason}**.\nThis is your **${warns[wUser.id].warns}** warning.`);
  }
  if(warns[wUser.id].warns == 2){
	  message.mentions.users.first().send(`You have been **warned** in the ${message.guild.name} server because of: **${reason}**.\nThis is your **${warns[wUser.id].warns}** warning.\nNext warning will cause 10m mute.`);
  }
  if(warns[wUser.id].warns == 3){
	var Bargs = message.content.replace(/\s\s+/g, ' ').split(" ");
    let wordtime = Bargs[2];
    let muterole = message.guild.roles.find(`name`, "muted");
    if(!muterole) return message.reply("You should create that role dude.");
    message.mentions.users.first().send(`You have been **warned** in the ${message.guild.name} server because of: **${reason}**.\nThis is your **${warns[wUser.id].warns}** warning.\nNext warning will cause 30m mute.`);
    let mutetime = "10m";
    await(wUser.addRole(muterole.id));
    message.channel.send(`<@${wUser.id}> has been temporarily muted`);

    setTimeout(function(){
      wUser.removeRole(muterole.id)
      message.reply(`<@${wUser.id}> has been unmuted.`)
    }, ms(mutetime))
  }
  if(warns[wUser.id].warns == 4){
	var Bargs = message.content.replace(/\s\s+/g, ' ').split(" ");
    let wordtime = Bargs[2];
    let muterole = message.guild.roles.find(`name`, "muted");
    if(!muterole) return message.reply("You should create that role dude.");
message.mentions.users.first().send(`You have been **warned** in the ${message.guild.name} server because of: **${reason}**.\nThis is your **${warns[wUser.id].warns}** warning.\nNext warning will cause 1h mute.`);
    let mutetime = "30m";
    await(wUser.addRole(muterole.id));
    message.channel.send(`<@${wUser.id}> has been temporarily muted`);

    setTimeout(function(){
      wUser.removeRole(muterole.id)
      message.reply(`<@${wUser.id}> has been unmuted.`)
    }, ms(mutetime))
  }
  if(warns[wUser.id].warns == 5){
	var Bargs = message.content.replace(/\s\s+/g, ' ').split(" ");
    let wordtime = Bargs[2];
    let muterole = message.guild.roles.find(`name`, "muted");
    if(!muterole) return message.reply("You should create that role dude.");
message.mentions.users.first().send(`You have been **warned** in the ${message.guild.name} server because of: **${reason}**.\nThis is your **${warns[wUser.id].warns}** warning.\nNext warning will cause 3h mute.`);
    let mutetime = "1h";
    await(wUser.addRole(muterole.id));
    message.channel.send(`<@${wUser.id}> has been temporarily muted`);

    setTimeout(function(){
      wUser.removeRole(muterole.id)
      message.reply(`<@${wUser.id}> has been unmuted.`)
    }, ms(mutetime))
  }
  if(warns[wUser.id].warns == 6){
	var Bargs = message.content.replace(/\s\s+/g, ' ').split(" ");
    let wordtime = Bargs[2];
    let muterole = message.guild.roles.find(`name`, "muted");
    if(!muterole) return message.reply("You should create that role dude.");
message.mentions.users.first().send(`You have been **warned** in the ${message.guild.name} server because of: **${reason}**.\nThis is your **${warns[wUser.id].warns}** warning.\nNext warning will cause 10h mute.`);
    let mutetime = "3h";
    await(wUser.addRole(muterole.id));
    message.channel.send(`<@${wUser.id}> has been temporarily muted`);

    setTimeout(function(){
      wUser.removeRole(muterole.id)
      message.reply(`<@${wUser.id}> has been unmuted.`)
    }, ms(mutetime))
  }
  if(warns[wUser.id].warns == 7){
	var Bargs = message.content.replace(/\s\s+/g, ' ').split(" ");
    let wordtime = Bargs[2];
    let muterole = message.guild.roles.find(`name`, "muted");
    if(!muterole) return message.reply("You should create that role dude.");
message.mentions.users.first().send(`You have been **warned** in the ${message.guild.name} server because of: **${reason}**.\nThis is your **${warns[wUser.id].warns}** warning.\nNext warning will cause 1d mute.`);
    let mutetime = "10h";
    await(wUser.addRole(muterole.id));
    message.channel.send(`<@${wUser.id}> has been temporarily muted`);

    setTimeout(function(){
      wUser.removeRole(muterole.id)
      message.reply(`<@${wUser.id}> has been unmuted.`)
    }, ms(mutetime))
  }
  if(warns[wUser.id].warns == 8){
	var Bargs = message.content.replace(/\s\s+/g, ' ').split(" ");
    let wordtime = Bargs[2];
    let muterole = message.guild.roles.find(`name`, "muted");
    if(!muterole) return message.reply("You should create that role dude.");
message.mentions.users.first().send(`You have been **warned** in the ${message.guild.name} server because of: **${reason}**.\nThis is your **${warns[wUser.id].warns}** warning.\nNext warning will cause a **kick**.`);
    let mutetime = "1d";
    await(wUser.addRole(muterole.id));
    message.channel.send(`<@${wUser.id}> has been temporarily muted`);

    setTimeout(function(){
      wUser.removeRole(muterole.id)
      message.reply(`<@${wUser.id}> has been unmuted.`)
    }, ms(mutetime))
  }
  if(warns[wUser.id].warns == 9){
    message.guild.member(wUser).kick(reason);
    message.reply(`<@${wUser.id}> has been kicked.`)
	message.mentions.users.first().send(`You have been **warned** and **kicked** from the ${message.guild.name} server because of: **${reason}**.\nThis is your **${warns[wUser.id].warns}**  and **final** warning.\nNext warning will cause a **ban**`);
    }
  if(warns[wUser.id].warns == 10){
    message.guild.member(wUser).ban(reason);
    message.reply(`<@${wUser.id}> has been banned.`)
	message.mentions.users.first().send(`You have been **banned** from the ${message.guild.name} server because of: **10 warnings.**.\nThanks for being in the server, but unfortunately you are not welcome here anymore.`);
    }
  },
  //
  //warn level command
  //
  warnlevel: function(message, warns) {
	if(!checkRole(message, "Administration")) return message.channel.send("You dont have permissions.");
  let wUser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0])
  if(!wUser) return message.reply("Couldn't find them yo");
  let warnlevel = warns[wUser.id].warns;
   
    
  message.reply(`<@${wUser.id}> has ${warnlevel} warnings.`);  
  }  
}
function getFirstMention(message) {
  var mentions = message.mentions.users.filter(user=>{if(user !== client.user) return user;}).first();
  return message.guild ? message.guild.member(mentions) : false;
}
function checkRole(message,role) {
  return message.member.roles.find("name",role);
}

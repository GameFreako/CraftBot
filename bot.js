const Discord = require('discord.js');
const fs = require('fs');
const Sequelize = require('sequelize');
const client = new Discord.Client();

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: './.data/data.db',
});

const Guilds = sequelize.define('guilds', {
  id: {
	  type: Sequelize.INTEGER,
	  unique: true,
    primaryKey: true,
  },
  prefix: {
    type: Sequelize.STRING,
    defaultValue: 'MC:',
    allowNull: false,
  },
	ip: {
    type: Sequelize.STRING,
    defaultValue: 'hypixel.net',
    allowNull: false,
  },
	port: {
    type: Sequelize.INTEGER,
    defaultValue: 25565,
    allowNull: false
  }
});

const Favicons = sequelize.define('favicons', {
  host: {
	  type: Sequelize.STRING,
	  unique: true,
    primaryKey: true,
  },
  port: {
    type: Sequelize.INTEGER,
    defaultValue: 25565,
    allowNull: false,
  },
	favicon: {
    type: Sequelize.STRING
  }
});

client.once('ready', () => {
  exports.Guilds = Guilds;
  exports.Favicons = Favicons;
	Guilds.sync();
  Favicons.sync();
});



var welcomeMsg = "Hi, I'm CraftBot! If you need to find out the prefix for your server, just ping me in it! If you would like to configure guild settings, use the MC:config Command! I hope we will be great friends! :3";
var byeMsg = "I've been removed from your server. I apologize if I did something wrong, but if you have any feedback please contact the developer! I hope we can still be friends :3"
var run = true;


function updatePresence() {
  client.user.setActivity(client.guilds.size + ' Guilds!', {type: 'WATCHING'})
  setTimeout(updatePresence2, 14000);
}

function updatePresence2() {
  client.user.setActivity('Minecraft', {type: 'PLAYING' });
  setTimeout(updatePresence, 14000);
}



client.on('ready', () => {
  console.log('Ready');
  updatePresence();
});

client.on('guildCreate', (guild) => {
  if (guild.owner) {
    guild.owner.send(welcomeMsg);
  } else if (guild.systemChannel) {
    guild.systemChannel.send(welcomeMsg);
  } else {
    guild.channels.first().send(welcomeMsg);
  };
  try {
    Guilds.create({
      id: guild.id,
    });
  } catch (error) {
    guild.owner.send('Hi! It appears something went terribly wrong when inviting me to the guild! It is recommended to re-invite me as soon as possible. If the problem persists, contact the developer, please! ERR: ' + error);
    throw error;
  }
});

client.on('guildDelete', (guild) => {
  guild.owner.send(byeMsg);
  Guilds.destroy({Where: { id: guild.id }});
});

client.on('message', async (msg) => {
  //var prefix = "MC:" -- static prefix : now make it reference configuration! 3:
  var da = await Guilds.findOne({where:{id:msg.guild.id}});
  var prefix = da.prefix;
  if (msg.author.bot) return;
  if (msg.mentions.users.first()) {
    if (msg.mentions.users.first().id == client.user.id) {
      msg.delete();
      msg.channel.send('Hi! On this server, the prefix is ' + prefix);
      return;
  }};
  if (!msg.content.startsWith(prefix)) return;
  var cmd = msg.content.split(prefix)[1].split(' ')[0];
  var args = msg.content.slice(1+prefix.length+cmd.length, msg.content.length).split(' ');
  console.log(`[CMD] ${cmd} ~ ${args}`);
  msg.delete().catch();
  try {
    require(`./commands/${cmd}.js`).execute(msg, args, client);
  } catch (error) {
    if (error == `Error: Cannot find module './commands/${cmd}.js'`) {
      msg.channel.send(`That command does not exist!`);
    } else {
      msg.channel.send(`An unknown error has occured. Please send this to the developer! ${error}`);
    }
  }
  });


if (run) client.login(process.env.token)
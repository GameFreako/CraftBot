
const mc = require('minecraft-protocol');
const { Client, RichEmbed } = require('discord.js');

exports.execute = async function(msg, args) {
  var Guilds = require('../bot.js').Guilds;
  var Favicons = require('../bot.js').Favicons;
  var data = await Guilds.findOne({ where: { id: msg.guild.id } });
  if (!data || !data.port || !data.ip) {
    msg.channel.send('Something went very, very, wrong. It is recommended you get in touch with the developer. ERR_DATA/IP/PORT_NOT_DEFINED_SERVER.JS');
  }
  var port = data.port;
  var ip = data.ip;
  var fd = await Favicons.findOne({ where: { host: ip, port: port }});
  mc.ping({host: ip, port: port}, function(err, res) {
    if (err) throw err;
    if (fd) {
      Favicons.update({ favicon: res.favicon }, { where: { host: ip, port: port }});
    } else {
      Favicons.create({ host: ip, port: port, favicon: res.favicon });
    };
    var embed = new RichEmbed;
//    embed.setAuthor(ip.split('.')[ip.split('.').length-2], `https://craftbot.glitch.me/favicon?host=${ip}&port=${port}`);
    if (res.favicon) {
      var buffer = new Buffer(res.favicon, 'base64');
      embed.attachFile({'attachment': buffer, 'name': 'favicon.png'});
    }
//    embed.attachFile(res.favicon.split(',')[1]);
    console.log(res);
    embed.setAuthor(ip.split('.')[ip.split('.').length-2], `attachment://favicon.png`);
    if (!res.description.extra) { var desc = res.description.replace(/§a/gi, '').replace(/§b/gi, '').replace(/§c/gi, '').replace(/§d/gi, '').replace(/§e/gi, '').replace(/§f/gi, '').replace(/§0/gi, '').replace(/§1/gi, '').replace(/§2/gi, '').replace(/§3/gi, '').replace(/§4/gi, '').replace(/§5/gi, '').replace(/§6/gi, '').replace(/§7/gi, '').replace(/§8/gi, '').replace(/§9/gi, '').replace(/§l/gi, '').replace(/§m/gi, '').replace(/§n/gi, '').replace(/§i/gi, '')
    } else {
      var desc = "Failed to determine the MOTD."
    }
    embed.setDescription(desc);
    embed.addField('Players', `${res.players.online}/${res.players.max}`);
    embed.setFooter(res.version.name);
    msg.channel.send(embed);
  });
};

exports.command = {
  description: 'Show information about the configured server.',
  config: 'Minecraft Server IP'
}
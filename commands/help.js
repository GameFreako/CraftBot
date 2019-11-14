const { Client, RichEmbed } = require('discord.js');

exports.execute = function(msg, args) {
  var embed = new RichEmbed;
  embed.setTitle('Command List');
  embed.setColor(0x000000);
  var d = new Date();
  embed.setTimestamp(d.now);
  var i;
  var cmds = require('../commands.json');
  for (i=0;i<cmds.length;i++) {
    var cmd = cmds[i].split(':')[0];
    var desc = cmds[i].split(':')[1];
    embed.addField(cmd, desc, true);
  }
  msg.channel.send(embed);
};
exports.execute = async function(msg, args) {
  var Guilds = require('../bot.js').Guilds;
  var data = await Guilds.findOne({ where: { id: msg.guild.id } });
  if (!data) {
    msg.channel.send('Something went very, very, wrong. It is recommended you get in touch with the developer. ERR_DATA_NOT_DEFINED_CONFIG.JS');
  }
  var target = args[0].toLowerCase();
  var value2 = args.join(' ');
  var value = value2.slice(args[0].length+1, value2.length);
  console.log(target + ' ~ ' + value2 + ' ~ ' + value);
  switch(target) {
    case "prefix":
      await Guilds.update({ prefix: value }, {where: { id: msg.guild.id }});
      msg.channel.send('The prefix has been updated to ' + value);
      break;
    case "ip":
      await Guilds.update({ ip: value }, {where: { id: msg.guild.id }});
      msg.channel.send('The IP has been updated to ' + value);
      break;
    case "port":
      await Guilds.update({ port: value }, {where: { id: msg.guild.id }});
      msg.channel.send('The port has been updated to ' + value);
      break;
    default:
      msg.channel.send('Failed to find that key, configuraiton values: IP, PORT, PREFIX');
  }
};

exports.command = {
  description: 'change options of the server',
}
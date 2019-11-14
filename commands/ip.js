exports.execute = async function(msg, args) {
  var Guilds = require('../bot.js').Guilds;
  var data = await Guilds.findOne({ where: { id: msg.guild.id } });
  if (!data) {
    msg.channel.send('Something went very, very, wrong. It is recommended you get in touch with the developer. ERR_DATA_NOT_DEFINED_IP.JS');
  }
  var ip = 'The server IP address is: '+data.ip;
  var port = data.port;
  if (port !== 25565) ip=ip+':'+port;
  msg.channel.send(ip);
};

exports.command = {
  description: 'display the IP of the server',
  config: 'Minecraft Server IP'
}
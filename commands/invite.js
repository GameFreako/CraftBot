exports.execute = async function(msg, args, client) {
  client.generateInvite(8).then(invite => {msg.channel.send(invite);});
};

exports.command = {
  description: 'display the IP of the server',
  config: 'Minecraft Server IP'
}
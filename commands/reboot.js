const Discord = require("discord.js");
const client = new Discord.Client();
const config = require('./config.json');

module.exports.run = (client, message) => {
    var resetBot = function(channel) {
        // send channel a message that you're resetting bot [optional]
        channel.send('Перезагрузка...')
        .then(msg => client.destroy())
        .then(() => client.login(config.token));
        }

    if ("001" == message.author.id || "002" == message.author.id) {
        resetBot(message.channel);
    }
}
 
module.exports.help = {
  name: "reboot"
}
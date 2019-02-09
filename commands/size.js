const Discord = require("discord.js");
const client = new Discord.Client();

module.exports.run = (client, message, guild) => {
    message.channel.sendMessage("Servers: " + client.guilds.size + " Users: " + client.users.size)
/*    client.guilds.forEach((guild) => {
      message.channel.sendMessage(" - " + guild.name)

      // List all channels
      guild.channels.forEach((channel) => {
        message.channel.sendMessage(` -- ${channel.name} (${channel.type}) - ${channel.id}`)
      })
    }) */
}
 
module.exports.help = {
  name: "size"
}
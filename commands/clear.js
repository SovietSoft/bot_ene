const Discord = require("discord.js");

module.exports.run = (client, message, args) => {

  if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("Недостаточно прав!");
  if(!args[0]) return message.channel.send("Введите количество сообщений.");
  message.channel.bulkDelete(args[0]).then(() => {
  message.channel.send(`Удалено ${args[0]} сообщений.`).then(msg => msg.delete(2000));
});

}

module.exports.help = {
  name: "clear"
}
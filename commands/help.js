const Discord = require("discord.js");

module.exports.run = (client, message) => {
    let newsEmbed = new Discord.RichEmbed()
    .setDescription("Команды")
    .setColor("#15f153")
    .setThumbnail("https://cdn.discordapp.com/attachments/539091559237419019/539445970832719883/emblem-websecurity.png")
    .addField("e!report @tag [причина репорта]", "Сообщить о нарушении")
    .addField("e!clear [количество сообщений]", "Очистить чат")
    .addField("e!server-security", "Информация о сервере")
    .addField("e!news", "Новости разработки")
    .addField("e!invite", "Пригласить бота на сервер")
    .addField("e!news", "посмотреть новости разработки");
    message.delete().catch(O_o=>{});
    message.reply(newsEmbed);
}
 
module.exports.help = {
  name: "help"
}
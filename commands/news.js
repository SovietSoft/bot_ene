const Discord = require("discord.js");

module.exports.run = (client, message) => {
    let newsEmbed = new Discord.RichEmbed()
    .setDescription("Новости")
    .setColor("#15f153")
    .addField("Смена ролей", "Теперь моя сестрица Suzune, решила отдохнуть, надеюсь, что с ней всё будет в порядке")
    .addField("Улучшения системы", "спустя месяц работы, я научилась много новому и улучшила свою производительость");
    message.delete().catch(O_o=>{});
    message.reply(newsEmbed);
}
 
module.exports.help = {
  name: "news"
}
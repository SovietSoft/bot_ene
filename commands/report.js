const Discord = require("discord.js");
const reportl = new Discord.WebhookClient('id', 'code');

module.exports.run = (client, message, args) => {
    let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!rUser) return message.channel.send("Не могу найти данного пользователя.");
    let rreason = args.join(" ").slice(22);

    let reportEmbed = new Discord.RichEmbed()
    .setDescription("Репорт")
    .setColor("#15f153")
    .addField("Репорт на", `${rUser} его ID: ${rUser.id}`)
    .addField("Репорт отправил", `${message.author} его ID: ${message.author.id}`)
    .addField("Канал:", message.channel)
    .addField("Время", message.createdAt)
    .addField("Текст:", rreason);
    message.delete().catch(O_o=>{});
    message.reply("Репорт был отправлен.");
    reportl.send(reportEmbed)
}
 
module.exports.help = {
  name: "report"
}
const Discord = require('discord.js');
const defense = new Discord.WebhookClient('id', 'code');
var w = 0;

module.exports = (client, oldmsg, newmsg) => {
  
    if (newmsg.content.includes("discord.gg") ||  newmsg.content.includes(".gg") ||  newmsg.content.includes("/invite") ||  newmsg.content.includes("d i s c o r d . g g" ) ||  newmsg.content.includes(". g g" )) {
      if (newmsg.member.hasPermission('ADMINISTRATOR')) {
        console.log("owner send invite url")
      }
      else 
      {
        let reportEmbed = new Discord.RichEmbed()
        .setDescription("Внимание!")
        .setColor("#FF0000")
        .addField("Нарушитель:", newmsg.author)
        .addField("URL: ", newmsg.content)
        .addField("Канал:", newmsg.channel)
        .addField("Время", newmsg.createdAt)
        defense.send(reportEmbed)
        newmsg.author.send("На сервере запрещенно отправлять ссылки с приглашением на сервер.")
    
        w++;
        client.user.setGame(w + " Attack")

        console.log("deleted " + newmsg.content + " from " + newmsg.author)
        newmsg.delete(1);
        newmsg.channel.sendMessage("Пользователь: " + newmsg.author + ", Рекламирует сервер Discord")
      }
    }
  }

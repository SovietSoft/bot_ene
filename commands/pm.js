module.exports.run = async (bot, message, args) => {
  if ("001" == message.author.id || "002" == message.author.id) {
    message.delete();
    let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!rUser) return message.channel.send("Не могу найти данного пользователя.");
    
    if(!args.join(" ")){
      return message.channel.send(":x: " + "| Введите текст")
    }
      rUser.send(args.join(" "));
    }
  }
  module.exports.help = {
      name: "pm"
  }
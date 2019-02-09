const Discord = require('discord.js') // подключение discord.js к файлу

module.exports.run = async (client, message, args) => {
    let verifilv = ['Отсутствует', 'Низкий', 'Средний', 'Высокий', 'Очень высокий']
    var y = message.guild.members.filter(m => m.presence.status == 'offline' && !m.user.bot).array().length;
    var z = message.guild.members.filter(m => m.presence.status != 'offline' && !m.user.bot).array().length;
    var x = z/y;
    b = Math.round(x*100);
    let embed = new Discord.RichEmbed() // встроенное сообщение
        .setAuthor(message.guild.name, message.guild.iconURL) // параметры: имя: string, картинка: string, url: string
        .addField('Уровень модерации', verifilv[message.guild.verificationLevel], true)
        .addField('Процент онлайна', b)
        .setFooter('Сервер создан') // параметры: текст: string, картинка: string
        .setTimestamp(new Date(message.guild.createdTimestamp)) // конверт времени
        .setColor(0x7289DA) // цвет
    await message.channel.send(embed) // отправка в канал
}

module.exports.help = {
    name: 'server-security' // название команды
}
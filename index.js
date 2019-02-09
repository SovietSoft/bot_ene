const Discord = require('discord.js');
const fs = require('fs') // подключаем fs к файлу
const client = new Discord.Client();
client.discord = Discord;
const config = require('./config.json');
var request = require("request");
const defense = new Discord.WebhookClient('id', 'code');
const Sequelize = require('sequelize');
client.APIWEB = "WEB_CODE";
client.URLWEB = "http://localhost/webapi.php"

// anti-spam system
const antispam = require("discord-anti-spam"); //the main function for the anti spam

antispam(client, {
    warnBuffer: 6, //Maximum amount of messages allowed to send in the interval time before getting warned.
    maxBuffer: 10, // Maximum amount of messages allowed to send in the interval time before getting banned.
    interval: 2000, // Amount of time in ms users can send a maximum of the maxBuffer variable before getting banned.
    warningMessage: "Пожалуйста, хватит спамить, иначе мне придётся вас забанить.", // Warning message send to the user indicating they are going to fast.
    banMessage: " Был забанен за спам.", // Ban message, always tags the banned user in front of it.
    maxDuplicatesWarning: 10, // Maximum amount of duplicate messages a user can send in a timespan before getting warned
    maxDuplicatesBan: 15, // Maximum amount of duplicate messages a user can send in a timespan before getting banned
    deleteMessagesAfterBanForPastDays: 7 // Delete the spammed messages after banning for the past x days.
});
//anti-spam end

// db sql
const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	operatorsAliases: false,
	// SQLite only
	storage: 'database.sqlite',
});

const Tags = sequelize.define('tags', {
	name: {
		type: Sequelize.STRING,
		unique: true,
	},
	description: Sequelize.TEXT,
	username: Sequelize.STRING,
	usage_count: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
});
// db sql


client.login(config.token)
client.on('ready', () => {
  console.log(`Бот работает под ником: ${client.user.tag}!`);
  Tags.sync();
  //console.log(`${client.user.username} в режиме онлайн`);
  //console.log("==============")
  //client.guilds.forEach(name => console.log(name.name))
  //console.log("==============")
});

client.commands = new Discord.Collection() // создаём коллекцию для команд

fs.readdir('./commands', (err, files) => { // чтение файлов в папке commands
    if (err) console.log(err)

    let jsfile = files.filter(f => f.split('.').pop() === 'js') // файлы не имеющие расширение .js игнорируются
    if (jsfile.length <= 0) return console.log('Команды не найдены!') // если нет ни одного файла с расширением .js

    console.log(`Loaded ${jsfile.length} commands`)
    jsfile.forEach((f, i) => { // добавляем каждый файл в коллекцию команд
        let props = require(`./commands/${f}`)
        client.commands.set(props.help.name, props)
    })
})

fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
    delete require.cache[require.resolve(`./events/${file}`)];
  });
});

client.on("message", (message) => {
    if(message.author.bot) return;
    if (message.content.includes("discord.gg") ||  message.content.includes(".gg") ||  message.content.includes("/invite") ||  message.content.includes("d i s c o r d . g g" ) ||  message.content.includes(". g g" )) {
      if (message.member.hasPermission('ADMINISTRATOR')) return;

        console.log("deleted " + message.content + " from " + message.author)
        let reportEmbed = new Discord.RichEmbed()
        .setDescription("Внимание!")
        .setColor("#FF0000")
        .addField("Нарушитель:", message.author)
        .addField("URL: ", message.content)
        .addField("Канал:", message.channel)
        .addField("Время", message.createdAt)
        defense.send(reportEmbed)
        message.author.send("На сервере запрещенно отправлять ссылки с приглашением на сервер.")
        message.delete(1);
        message.channel.sendMessage("Пользователь: " + message.author + ", Рекламирует сервер Discord")
    }
      request({
        url: client.URLWEB + "?key=" + client.APIWEB + "&a=check&user=" + message.author.id,
        json: true
    }, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        if (response.body.status == 1) {
            message.author.send("Вы были забанены системой SovietSoft, подробнее на нашем форуме: forum.sovietsoft.ru")
            var reason = "Забанен системой SovietSoft"
            message.member.ban(reason)
        }
      }
    })
    let prefix = config.prefix
    if(!message.content.startsWith(prefix)) return;
    let messageArray = message.content.split(' ') // разделение пробелами
    let command = messageArray[0] // команда после префикса
    let args = messageArray.slice(1) // аргументы после команды

    let command_file = client.commands.get(command.slice(prefix.length)) // получение команды из коллекции
    if (command_file) command_file.run(client, message, args)
  


    if (message.content.startsWith(config.prefix)) {
      const input = message.content.slice(config.prefix.length).split(' ');
      const command = input.shift();
      const commandArgs = input.join(' ');
  
      if (command === 'addtag') {
        const splitArgs = commandArgs.split(' ');
        const tagName = splitArgs.shift();
        const tagDescription = splitArgs.join(' ');
  
        try {
          // equivalent to: INSERT INTO tags (name, descrption, username) values (?, ?, ?);
          const tag = Tags.create({
            name: tagName,
            description: tagDescription,
            username: message.author.username,
          });
          return message.reply(`Префикс \`${tagName}\` добавлен.`);
        } catch (e) {
          if (e.name === 'SequelizeUniqueConstraintError') {
            return message.reply('That tag already exists.');
          }
          return message.reply('Something went wrong with adding a tag.');
        }
      } else if (command === 'tag') {
        const tagName = commandArgs;
  
        // equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
        const tag = Tags.findOne({ where: { name: tagName } });
        if (tag) {
          // equivalent to: UPDATE tags SET usage_count = usage_count + 1 WHERE name = 'tagName';
          tag.increment('usage_count');
          return message.channel.send(tag.get('description'));
        }
        return message.reply(`Could not find tag: ${tagName}`);
      } else if (command === 'edittag') {
        const splitArgs = commandArgs.split(' ');
        const tagName = splitArgs.shift();
        const tagDescription = splitArgs.join(' ');
  
        // equivalent to: UPDATE tags (descrption) values (?) WHERE name = ?;
        const affectedRows = Tags.update({ description: tagDescription }, { where: { name: tagName } });
        if (affectedRows > 0) {
          return message.reply(`Tag ${tagName} was edited.`);
        }
        return message.reply(`Could not find a tag with name ${tagName}.`);
      } else if (command === 'taginfo') {
        const tagName = commandArgs;
  
        // equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
        const tag = Tags.findOne({ where: { name: tagName } });
        if (tag) {
          return message.channel.send(`${tagName} был создан пользователем: ${tag.username} в ${tag.createdAt} и был использов: ${tag.usage_count} раз.`);
        }
        return message.reply(`Could not find tag: ${tagName}`);
      } else if (command === 'showtags') {
        // equivalent to: SELECT name FROM tags;
        const tagList = Tags.findAll({ attributes: ['name'] });
        const tagString = tagList.map(t => t.name).join(', ') || 'No tags set.';
        return message.channel.send(`Лист префиксов: ${tagString}`);
      } else if (command === 'removetag') {
        // equivalent to: DELETE from tags WHERE name = ?;
        const tagName = commandArgs;
        const rowCount = Tags.destroy({ where: { name: tagName } });
        if (!rowCount) return message.reply('That tag did not exist.');
  
        return message.reply('Префикс удалён.');
      }
    }
})

client.on("guildMemberAdd", (member) => {
    request({
      url: client.URLWEB + "?key=" + client.APIWEB + "&a=check&user=" + member.id,
      json: true
  }, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      if (response.body.status == 1) {
          message.author.send("Вы были забанены системой SovietSoft, если хотите получить разбан, пишите на наш форум: forum.sovietsoft.ru")
          var reason = "Забанен системой SovietSoft"
          member.ban(reason)
      }
    }
  })
  if (member.user.username.includes(".gg" || "https//discord" || "invite")) {
    member.send("Я заметила подозрительную ссылку в твоём ники, поэтому изменила твой ник на `Nick_URL`")
    member.guild.members.get(member.id).setNickname("Nick_URL");
  }
});

client.on("guildCreate", guild => {
    console.log("Nowy serwer, " + guild.name)
    client.user.setGame(client.guilds.size + " servers")
      request({
        url: client.URLWEB + "?key=" + client.APIWEB + "&a=status&server=" + client.guilds.size,
        json: true
    }, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        if (response.body.status == 1) {
            console.log("сервер " + guild.name + " был добавлен в базу данных")
        } else {
            console.log("Ошибка")
        }
      }
    })
      request({
        url: client.URLWEB + "?key=" + client.APIWEB + "&a=check&user=" + guild.owner.id,
        json: true
    }, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        if (response.body.status == 1) {
        guild.owner.sendMessage("Извините, но вы находитесь в чёрном списке, поэтому я вынуждена покинуть ваш сервер")
            // 
            request({
              url: client.URLWEB + "?key=" + client.APIWEB + "&a=server&id=" + guild.id,
              json: true
          }, function (error, response, body) {
          
              if (!error && response.statusCode === 200) {
                  if (response.body.status == 1) {
                      console.log("Сервер добавлен в ЧС")
                      guild.leave();
                  } else {
                      console.log("Ошибка")
                  }
              }
          })

        } else {
            console.log("Ошибка с чс владельца")
        }
      }
    })
      request({
        url: client.URLWEB + "?key=" + client.APIWEB + "&a=server_check&id=" + guild.id,
        json: true
    }, function (error, response, body) {
    
        if (!error && response.statusCode === 200) {
            if (response.body.status == 1) {
              guild.owner.sendMessage("Извините, но ваш сервер находится в чёрном списке")
              guild.leave();
            } else {
                console.log("Ошибка")
            }
        }
    })
  });
  

  client.on("guildDelete", guild => {
    console.log("Бот вышел, " + guild.name)
    client.user.setGame(client.guilds.size + " servers")
      request({
        url: client.URLWEB + "?key=" + client.APIWEB + "&a=status&server=" + client.guilds.size,
        json: true
    }, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        if (response.body.status == 1) {
            console.log("сервер " + guild.name + " был удалён из базы данных")
        } else {
            console.log("Ошибка")
        }
      }
    })
  });

client.on("error", (e) => console.error(e));
client.on("warn", (e) => console.warn(e));
client.on("debug", (e) => console.info(e));
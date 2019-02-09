    const Discord = require('discord.js');
    module.exports.run = async (bot, message, args) => {
        const embed = {
        "title": "Пригласить бота на сервер",
        "description": "[Invite Bot](https://discordapp.com/oauth2/authorize?client_id=535864425811279903&scope=bot&permissions=8)",
        "color": 7251686
        };
        message.author.send({ embed });
    } 
        
    module.exports.help = {
        name: "invite"
    }
const Discord = require('discord.js');
const config = require('./config.json');
const { ifError } = require('assert');
const { randomBytes } = require('crypto');
const fs = require('fs');
const { Server } = require('http');

const client = new Discord.Client();
const xpfile = require("./xp.json");
const coinfile = require("./coins.json");
const disbut = require('discord-buttons');
disbut(client);

const message = ['Test',`Prefix: ${config.prefix}`,'Road to 3k Follower']
let current = 1;

//--------------------------------------------------------------------------------------------

client.on("ready", () => {
    console.log(`Logged in your Bot / Prefix: ${config.prefix} / Token: ${config.token}`)

    client.user.setActivity(message[0] , {type: "LISTENING"})

    setInterval( () => {
        if(message[current]) {
            client.user.setActivity(message[current] , {type: "LISTENING"})
            current++;
        }else{
            current = 0;
            client.user.setActivity(message[current] , {type: "LISTENING"})
        }
    }, 5*2000)
})

client.on("guildMemberAdd", function(member) {
    let channel = member.guild.channels.cache.find(ch => ch.name === "welcome");
    let embed = new Discord.MessageEmbed()
        .setColor("#abe009")
        .setDescription(`${member.displayName} ist`)
        .setImage("https://media.discordapp.net/attachments/864238436532617216/885624868689813544/standard_23.gif")

        channel.send(embed)
})


client.on("guildMemberRemove", function(member) {
    let channel = member.guild.channels.cache.find(ch => ch.name === "welcome");
    let embed = new Discord.MessageEmbed()
        .setColor("#abe009")
        .setDescription(`${member.displayName} hat`)
        .setImage("https://media.discordapp.net/attachments/864238436532617216/885624272859570186/standard_22.gif")

        channel.send(embed)
})

//befehle
client.on("message", async message => {
//credits
    if(message.content == config.prefix + 'credits' && message.guild && !message.member.user.bot){
        var embed = new Discord.MessageEmbed()
        .setColor("#6f03fc")
        .setImage("https://media.discordapp.net/attachments/864238436532617216/868761361772077066/standard_1.gif")
        .setTitle("Credits")
        .setDescription("Dieser Bot wurde von **PalkirZwei** erstellt\nDies ist der Youtube Tutorial-Bot")
        .addField("Webseite","https://palkirzwei.de/")
        .addField("patreon","https://www.patreon.com/user?u=57071500")
        .addField('Discord-Server' , 'https://dsc.gg/palkirzwei')
        .addField('Instagram' , 'https://www.instagram.com/palkir2/')
        .addField('Gaming und Mehr' , 'https://www.youtube.com/user/Palkir2')
        .addField('Outdoor-Videos' , 'https://www.youtube.com/channel/UCIOyOy7BHtnben3yAcf3r1A')
        .addField('Dashcam-Videos' , 'https://www.youtube.com/channel/UC7IqRydYejRpUGZbCxKN_-A')

        message.channel.send(embed)
    }

    //help
    if(message.content == config.prefix + 'help' && message.guild && !message.member.user.bot){
        var embed = new Discord.MessageEmbed()
        .setColor("#ff2600")
        .setImage("https://media.discordapp.net/attachments/864238436532617216/869340756492570665/standard_7.gif")
        .setTitle("Die Bot-hilfe")
        .setDescription("Hier erhälst du zum Bot einige Befehle")
        .addField("Prefix",config.prefix)
        .addField(config.prefix+"help","ruft die Bot-hilfe auf")
        .addField(config.prefix+"credits","Alle nützlichen Informationen zum Entwickler des Bots")
        .addField(config.prefix+"leer","leer")
        .addField(config.prefix+"leer","leer")
        .addField(config.prefix+"leer","leer")
        .addField(config.prefix+"leer","leer")
        .addField(config.prefix+"leer","leer")
        .addField(config.prefix+"leer","leer")
        .addField(config.prefix+"leer","leer")

        message.channel.send(embed)
    }
})

// XP System
client.on("message", function(message){
    if(message.author.bot) return;
    var addXP = Math.floor(Math.random() * 8) + 3;

    if(!xpfile[message.author.id]){
      xpfile[message.author.id] = {
        xp: 0,
        level: 1,
        reqxp: 100
      }

      fs.writeFile("./xp.json",JSON.stringify(xpfile),function(err){
        if(err) console.log(err)
      })
    }

    xpfile[message.author.id].xp += addXP

    if(xpfile[message.author.id].xp > xpfile[message.author.id].reqxp){
      xpfile[message.author.id].xp -= xpfile[message.author.id].reqxp // xp abziehen
      xpfile[message.author.id].reqxp *= 1.25 //xp die man brauch erhöhen
      xpfile[message.author.id].reqxp = Math.floor(xpfile[message.author.id].reqxp) //reqxp runden
      xpfile[message.author.id].level += 1 // 1 level hinzugügen

      let embed = new Discord.MessageEmbed()
      .setImage('https://media.discordapp.net/attachments/864238436532617216/869312955257344020/standard_6.gif')
      .setColor("#88ff00")
      .setDescription(`${message.author.username}`+" Du bist nun auf **Level** "+xpfile[message.author.id].level)
      message.channel.send(embed)
    }

    fs.writeFile("./xp.json",JSON.stringify(xpfile),function(err){
      if(err) console.log(err)
    })

    //Level
    if(message.content.startsWith(config.prefix +'level')){
      let user = message.mentions.users.first() || message.author

      let embed = new Discord.MessageEmbed()
      .setImage('https://media.discordapp.net/attachments/864238436532617216/869312034955747398/standard_5.gif')
      .setTitle("Level System")
      .setDescription(`${message.author.username}`+" Du hast folgende Werte:")
      .setColor("#ff7300")
      .addField("Level:",xpfile[message.author.id].level)
      .addField("XP:",xpfile[message.author.id].xp+"/"+xpfile[message.author.id].reqxp)
      .addField("XP bis zum nächsten Level:",xpfile[message.author.id].reqxp)
      message.channel.send(embed)
    }
})
//flip
if(!coinfile[message.author.id]){
  coinfile[message.author.id] = {
    coins: 100
  }
}

fs.writeFile("./coins.json",JSON.stringify(coinfile), err => {
  if(err){
    console.log(err)
  }


if(message.content.startsWith(config.prefix +'flip')){
  if(!coinfile[message.author.id]){
    coinfile[message.author.id] = {
      coins: 100
    }
  }

  let bounty = message.content.split(" ").slice(1, 2).join("");
  let val = message.content.split(" ").slice(2, 3).join("");

  bounty = Number(bounty)

  if(isNaN(bounty)) return message.reply("Du hast keine **Zahl** für die Coins angegeben. Du hast **"+ bounty+"** angegeben!");
 
  if(!bounty) return message.reply("Du hast keine **Coins** angegeben!");

  if(!val) return message.reply("Du hast kein **Kopf** oder **Zahl** angegeben!");

  if(coinfile[message.author.id].coins < bounty) return message.reply("Du hast zu **wenige** Coins");

  coinfile[message.author.id].coins -= bounty;

  coinfile[message.author.id].coins = Number(coinfile[message.author.id].coins)
  
  let chance = Math.floor(Math.random() *2);

  if(chance == 0){
    if(val.toLowerCase() == "kopf"){
      message.reply("Und es ist... **Kopf**! Dein Wetteinsatz verdoppelt sich.");

      bounty = bounty *2

      coinfile[message.author.id].coins += bounty;
      coinfile[message.author.id].coins = Number(coinfile[message.author.id].coins)
    }else{
      if(val.toLowerCase() == "zahl"){
        message.reply("Und es ist... **Kopf**! Du hast verloren.");
  }else{
    coinfile[message.author.id].coins += bounty;

    coinfile[message.author.id].coins = Number(coinfile[message.author.id].coins)
    message.reply("Du hast **Kopf** oder **Zahl** falsch geschrieben oder an die falsche Stelle gesetzt");
  }
}
}else{
  if(val.toLowerCase() == "zahl"){
    message.reply("Und es ist... **Zahl**! Dein Wetteinsatz verdoppelt sich.");
    
    bounty = bounty *2

    coinfile[message.author.id].coins += bounty;

    coinfile[message.author.id].coins = Number(coinfile[message.author.id].coins)

  }else{
    if(val.toLowerCase() == "kopf"){
      message.reply("Und es ist... **Zahl**! Du hast verloren.");
  }else{
    coinfile[message.author.id].coins += bounty;

    coinfile[message.author.id].coins = Number(coinfile[message.author.id].coins)

    message.reply("Du hast **Kopf** oder **Zahl** falsch geschrieben oder an die falsche Stelle gesetzt");
  }

}
}

fs.writeFile("./coins.json",JSON.stringify(coinfile), err =>{
  if(err){
    console.log(err);
  }
})
}

if(message.content == config.prefix + 'coins'){
  let embed = new Discord.MessageEmbed()
  .setTitle("Coins von "+ message.author.username)
  .setColor("#bf720d")
  .setImage("https://media.discordapp.net/attachments/864238436532617216/869345338950058055/standard_8.gif")
  .setDescription("Deine Coins: " + coinfile[message.author.id].coins)

  message.channel.send(embed)
}

})


client.login(config.token)

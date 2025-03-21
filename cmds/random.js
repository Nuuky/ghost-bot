'use strict'
const Global = require('../global/')
const Json = require("../json/")

module.exports = class RandomCommand {

    constructor(bot, msg) {
        this.msg = msg;
        this.guild = bot.tempGuilds[msg.guild.id];
    }

    async run(query) {
        const lang = this.guild.lang;
        const prefix = this.guild.prefix;
        const args = query.split(" ");
        const hours = Json.grw.hours;

        const randomWeather = Global.Fn.getRandomData("weather")
        const randomTime = Global.Fn.getRandomData("hours")
        const randomMaps = Json.grw.maps[Global.Fn.randomNumber(0, Json.grw.maps.length - 1)]
        const embed = {
            "title": (args[0] && args[1]) ? `[${args[0].toString()}] vs [${args[1].toString()}]` : '',
            "description": `**${randomMaps.name[lang].toUpperCase()}**
            \n🕑 ${randomTime}h               ${randomWeather.emoji} ${randomWeather.name[lang]}`,
            "color": Global.Fn.getMode(randomMaps.mode).color,
            "thumbnail": {
                "url": randomMaps.url
            }
        };
        Global.Msg.embed(this.msg, embed, 60);
    }
}
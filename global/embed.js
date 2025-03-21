'use strict'

const Json = require("../json/");
const Fn = require("./functions");

module.exports = {

    vote: (omsg, plObj, mapObj, lang, prefix) => {
        const trans = Json.langs[lang];
        // Array map to str by Mode
        const displayMap = (strMode) => {
            let toStr = "";
            mapObj.mapsArr.forEach((map, id) => {
                if(Json.grw.maps[id].mode == strMode) {
                    if(map.picked) {
                        toStr += `${id}: __**${Json.grw.maps[id].name[lang]}**__\n`
                    }
                    else if(map.banned) {
                        //toStr += `${id}: ~~*${Json.grw.maps[id].name[lang]}*~~\n`
                    } 
                    else {
                        toStr += `${id}: ${Json.grw.maps[id].name[lang]}\n`
                    }
                }
            })
            return toStr
        }

        // Making fields (In case one is empty)
        const fieldsMaker = () => {
            let arrFields = [],fieldObj;
          const blankField = {
                name: '\u200B',
                value: '\u200B',
                inline: false
            }
            arrFields.push(blankField);
            let j = 0;
            for(let i = 0; i < Json.grw.modes.length; i++) {
                if(displayMap(Json.grw.modes[i].name["en"]) !== "") {
                    fieldObj = {
                        name: Json.grw.modes[i].name[lang],
                        value: displayMap(Json.grw.modes[i].name["en"]),
                        inline: true
                    }
                    arrFields.push(fieldObj);
                  
                    if((j+1)%3 == 0) {
                        arrFields.push(blankField);
                    }
                    j++
                }
            }
            arrFields.push(blankField);
            return arrFields
        }

        let obj = {};

        obj["title"] = plObj.title;
        obj["description"] = `${trans.vote.embed.voteDesc}: ` + (plObj.teams ? `[${plObj.playerTurn().team}]` : plObj.playerTurn().team);
        obj["footer"] = {
            text: `${(mapObj.ban > 0) ? prefix + "ban" : prefix + "pick"} ${trans.vote.embed.voteFoot[0]} | ${prefix}${trans.vote.embed.voteFoot[1]} | ${prefix}${trans.vote.embed.voteFoot[2]}`
        }
        obj["color"] = (mapObj.ban > 0) ? "16711741" : "26879";
        obj["fields"] = fieldsMaker();

        return obj
    },

    map: (plObj, mapObj, numMap, dispMap, lang, prefix) => {
        const randomWeather = Fn.getRandomData("weather")
        const randomTime = Fn.getRandomData("hours")
        const map = Json.grw.maps[dispMap.id];
        const trans = Json.langs[lang];
        const hours = Json.grw.hours;

        let obj = {};
        obj["title"] = plObj.title;
        obj["description"] = `----------------------------`;
        obj["image"] = {
            url: map.url
        };
        obj["color"] = Fn.getMode(map.mode).color;
        obj["fields"] = [
            {
                name: `Map #${numMap + 1}`,
                value: (dispMap.team) ? dispMap.team : "None",
                inline: true
            },
            {
                name: trans.vote.embed.mapParam,
                value:  `\n\n
                        🕑 - ${randomTime}h\n\n${randomWeather.emoji} - ${randomWeather.name[lang]}
                        `,
                inline: true
            },
            {
                name: map.name[lang],
                value: Fn.getMode(map.mode).name[lang],
                inline: true
            }
        ];

        if(mapObj.manualDisplay && numMap < mapObj.mapNumb-1) obj["footer"] = {text:  `${prefix}${trans.vote.embed.mapFoot[0]} | ${prefix}${trans.vote.embed.mapFoot[1]} | ${prefix}${trans.vote.embed.voteFoot[2]}`};
        if(mapObj.manualDisplay && numMap == mapObj.mapNumb-1) obj["footer"] = {text:  `${trans.vote.embed.mapFoot[2]} | ${prefix}${trans.vote.embed.voteFoot[2]}`};
        
        return obj
    }
}
require('console-stamp')(console, { pattern: 'dd/mm/yyyy HH:MM:ss.l' });

const gamedig = require('gamedig');
const Discord = require('discord.js');
const client = new Discord.Client();

client.login('TOKEN');

command = '!bss';

client.on("ready", () => {
    console.log("ready!")
    client.user.setActivity("!bss help", {
        type: "PLAYING"
    });
});

client.on('message', message => {
    if (message.content.startsWith(command)) {
        //remove author command invoke message (requires channel permission "MANAGE_MESSAGES")
        //message.delete().catch(err=>client.funcs.log(err, "error"));
        
        if (message.content == command || message.content == command + " " || message.content == command + " help") {
              // console.log(embed);
              helpembed = new Discord.RichEmbed()
                .setColor(5151967)
                .addField("Server Status Checker for Battalion1944", "Usage: `" + command + " <IP>[:port] [password]`" +
                    "\n*Port is optional and defaults to 7777+3, password is optional and purely cosmetic only works on passworded servers*")
                .addField("Author", "phit#4970")
                .setTimestamp();
              message.reply("", {embed: helpembed});
        } else {
            arguments = message.content.substr(command.length).trim();
            aarguments = arguments.split(" ");
            if (aarguments.length == 0) {
                aarguments.push(arguments);
            }
            
            aaddresss = aarguments[0].split(":");
            ip = aaddresss[0];
            port = aaddresss[1] || 7780;
            password = aarguments[1] || "";
            getStatus(ip, port)
                .then((response) => {
                    // Playerlist doesn't seem to work currently..
                    
                    //var playerList = "";
                    //console.log(response);
                    // if (response.players.length > 0){
                        // for (i in response.players){
                            // if (i < response.players.length - 1){
                                // playerList += response.players[i].replace(new RegExp("_", 'g'), "\\_") + ", ";
                            // } else {
                                // playerList += response.players[i].replace(new RegExp("_", 'g'), "\\_");
                            // }
                        // }
                    // }
                    
                    if (response.raw.rules.bat_has_password_s == "Y") {
                        if (password != "") {
                            password = " password " + password;
                        } else {
                            password = " password INSERTHERE";
                        }
                    }

                    richembed = new Discord.RichEmbed()
                        .setColor(7844437)
                        .setThumbnail("https://phit.link/battalion/" + response.raw.rules.bat_map_s.replace(/ /g,"_").toLowerCase() + ".png")
                        .setTimestamp()
                        .addField(response.raw.rules.bat_name_s,
                            //"\nPlayers: (" + response.raw.numplayers + "/" + response.maxplayers + ") " + playerList +
                            "\nPlayers: " + response.raw.rules.bat_player_count_s + "/" + response.raw.rules.bat_max_players_i +
                            "\nMap: " + response.raw.rules.bat_map_s +
                            "\nMode: " + response.raw.rules.bat_gamemode_s +
                            "\n\n`connect " + response.query.host + ":" + response.raw.port + password + "`");
                    message.reply("", {embed: richembed});
                    console.log("[" + ip + "] replied online!");
                }).catch((error) => {
                    console.error(error);
                    richembed = new Discord.RichEmbed()
                        .setColor(16711680)
                        .setTimestamp()
                        .addField(ip + " :x:",
                            "Server is offline or address is invalid..");

                    message.reply("", {embed: richembed});
                    console.log("[" + ip + "] replied offline!");
                });
        }
    }
});

function getStatus(ip, port) {
    port = port || 7780;   
    console.log("[" + ip + "] getting status for " + ip + ":" + port)
    return gamedig.query({
        type: 'protocol-valve',
        socketTimeout: 2000,
        host: ip,
        port: port
    })
}

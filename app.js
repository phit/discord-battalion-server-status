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
                    "\n\n*Optional port is the Query port NOT gameserver port, defaults to 7777+3*\n*Optional password is purely cosmetic only works for passworded servers*")
                .addField("Author", "phit#4970")
                .setTimestamp();
              message.reply("", {embed: helpembed});
        } else {
            // get rid of spaces around
            arguments = message.content.substr(command.length).trim();
            // split arguments
            aarguments = arguments.split(" ");
            if (aarguments.length == 0) {
                aarguments.push(arguments);
            }
            
            // split address for port and ip
            aaddresss = aarguments[0].split(":");
            ip = aaddresss[0];
            port = aaddresss[1] || 7780;
            
            // check for existence of cosmetic password
            password = aarguments[1] || "";
            
            // lets check if its up
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
                    
                    // server is passworded, adding password to connect command
                    if (response.raw.rules.bat_has_password_s == "Y") {
                        if (password != "") {
                            password = " password " + password;
                        } else {
                            password = " password INSERTHERE";
                        }
                    }

                    // build reply embed
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

                    // reply!
                    message.reply("", {embed: richembed});
                    console.log("[" + ip + "] replied online!");
                }).catch((error) => {
                    // error in query
                    console.error(error);
                    
                    // assume user error
                    richembed = new Discord.RichEmbed()
                        .setColor(16711680)
                        .setTimestamp()
                        .addField(ip + " :x:",
                            "Server is offline or address is invalid..\nIf you entered a port, remember to use the Query port.");

                    // reply!
                    message.reply("", {embed: richembed});
                    console.log("[" + ip + "] replied offline!");
                });
        }
    }
});

function getStatus(ip, port) {
    // fallback to default port
    port = port || 7780;   
    console.log("[" + ip + "] getting status for " + ip + ":" + port)
    // run the query
    return gamedig.query({
        type: 'protocol-valve',
        socketTimeout: 2000,
        host: ip,
        port: port
    })
}

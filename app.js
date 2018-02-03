const gamedig = require('gamedig');
const Discord = require('discord.js');
const client = new Discord.Client();

client.login('TOKEN');

command = '!bss';

client.on('message', message => {
    if (message.content.startsWith(command)) {
        //remove author command invoke message (requires channel permission "MANAGE_MESSAGES")
        //message.delete().catch(err=>client.funcs.log(err, "error"));
        
        if (message.content == command || message.content == command + " " || message.content == command + " help") {
              // console.log(embed);
              helpembed = new Discord.RichEmbed()
                .setColor(5151967)
                .addField("Server Status Checker for Battalion1944", "Usage: `" + command + " <IP>[:port]`" +
                    "\n*Port is optional and defaults to 7777+3*")
                .addField("Author", "phit#4970")
                .setTimestamp();
              message.reply("", {embed: helpembed});
        } else {
            address = message.content.substr(command.length);
            address = address.trim();
            split = address.split(":")
            ip = split[0]
            port = split[1] || 7780;
            getStatus(ip, port)
                .then((response) => {
                    // Playerlist doesn't seem to work currently..
                    
                    //var playerList = "";
                    console.log(response);
                    // if (response.players.length > 0){
                        // for (i in response.players){
                            // if (i < response.players.length - 1){
                                // playerList += response.players[i].replace(new RegExp("_", 'g'), "\\_") + ", ";
                            // } else {
                                // playerList += response.players[i].replace(new RegExp("_", 'g'), "\\_");
                            // }
                        // }
                    // }
                    
                    password = "";
                    if (response.raw.rules.bat_has_password_s == "Y") {
                        password = " password INSERTHERE"
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
                }).catch((error) => {
                    console.log(error);
                    richembed = new Discord.RichEmbed()
                        .setColor(16711680)
                        .setTimestamp()
                        .addField(ip + " :x:",
                            "Server is offline or address is invalid..");

                    message.reply("", {embed: richembed});
                });
        }
    }
});

function getStatus(ip, port) {
    port = port || 7780;   
    console.log("getting status " + ip + " " + port)
    return gamedig.query({
        type: 'protocol-valve',
        socketTimeout: 2000,
        host: ip,
        port: port
    })
}

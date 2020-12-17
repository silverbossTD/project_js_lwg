//Dont't use this shit
//It sucks
let lobbies = [];
let players = [];
function setup() {
    lobbies = [];
    players = [];
    //add Lobbies
    $("#playersWindowTextArea > div > .playerNameInList").each(function(i, obj) {
        players.push(obj.innerText);
    });
    //add Players
    $("#gamesWindowTextArea > p").each(function(i, obj) {
        lobbies.push(obj.title);
    });
    //Remove lobbies
    for(let i = 0;i < lobbies.length; i++) {
    dem = 0;
    for(let j = 0; j < players.length; j++) {
        if(lobbies[i].search(players[j]) > 0) {
            dem++;
        }
    }
        if(dem === 0) {
            console.log("Number lobby: " + i + " ; count: " + dem);
            network.send("chat<<$/killgame " + i);
        }
    }
}


var killLobbies;

const killBtn = document.createElement('button');
killBtn.innerHTML = "Kill Lobbies";

document.getElementById('playerGoldWrap').appendChild(killBtn);

killBtn.onclick = function() {
    displayInfoMsg("<button onclick='onKillLobbies()'>Turn On</button><br><button onclick='offKillLobbies()'>Turn Off</button>");
}   

function onKillLobbies() {
	killLobbies = setInterval(() => setup(), 2000);
    }

function offKillLobbies() {
	clearInterval(killLobbies);
}

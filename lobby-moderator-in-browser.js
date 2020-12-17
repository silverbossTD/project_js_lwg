function lobbyPolice(username, pw) {
  const SERVER_ADDRESS = "wss://us1.littlewargame.com:8083";

  let players = [];
  let lobbies = [];

  function socket() {
    let s = new WebSocket(SERVER_ADDRESS);

    s.addEventListener('open', () => {
      s.send("login-user<<$" + username + "<<$" + pw + "<<$1");
    });

    s.addEventListener('message', e => {
      const splitMsg = e.data.split("<<$");
      switch (splitMsg[0]) {
        case "logged-in":
          console.log(...splitMsg);
          // s.send("chat<<$Hello motherfuckers.");
          break;
        case "player-list":
          console.log({players, lobbies});
          console.log(...splitMsg);
          players = splitMsg.slice(1).map(x => x.slice(0, x.indexOf('<')));
          console.log({players, lobbies});
          break;
        case "player-joined": 
          if (splitMsg[1].indexOf(players) === -1) 
            players.push(splitMsg[1]);
          console.log({players, lobbies});
          break;
        case "player-left":
          const idx = players.indexOf(splitMsg[1]);
          if (idx !== -1)
            players.splice(idx, 1);
          console.log({players, lobbies});
          break;
        case "games-list":
          lobbies = splitMsg.slice(1).map(x => (a => ({id: a[0], host: a[6]}))(x.split('<')));
          console.log({players, lobbies});
          const infidels = lobbies.filter(l => players.indexOf(l.host) === -1);
          if (infidels.length > 0) {
            console.log("Kill the infidels!", infidels);
            for (const h of infidels)
              s.send("chat<<$/killgame " + h.id);
          }
          break;
      }
    });
    return s;
  }


  let s = socket();

  // reconnect every 15 seconds to refresh player list, because bugged out connections don't send "player-left" message
  setInterval( () => {
    // code 1000 = normal disconnect (without error)
    s.close(1000);
    setTimeout(() => {s = socket();});
  }, 15000);
}


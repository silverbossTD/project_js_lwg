function isArchon() {
    return "archonmagic" in game.data.unitData;
}
function getArchonSize() {
    return isArchon() ? game.data.unitData.archonmagic.hp : 0;
}
function getArchonPlayerNr(e) {
    return 0 == getArchonSize() ? e : getArchonSize() * Math.floor((e - 1) / getArchonSize()) + 1;
}
(Game.prototype.loadMap = function (e, a, t, n, s, i, r) {
    if (!a) {
        a = [{ name: networkPlayerName, controller: CONTROLLER.COMPUTER, team: 1 }];
        for (var l = 1; l < MAX_PLAYERS; l++) a.push({ name: "Computer", controller: CONTROLLER.COMPUTER, team: l + 1, nr: l + 1 });
        a.push({ name: networkPlayerName, controller: CONTROLLER.HUMAN, team: 0, isPlayingPlayer: !0 });
    }
    if (
        ((this.x = parseInt(e.x)),
        (this.y = parseInt(e.y)),
        (this.name = e.name),
        (this.description = e.description),
        (this.data = e),
        (this.aiRandomizer = t || Math.ceil(1e5 * Math.random())),
        (this.replayTicksCounter = n || -1),
        (this.minimap = new Minimap(this, 0, -MINIMAP_HEIGHT)),
        initCustomImgsObj(),
        e.graphics)
    )
        for (key2_ in e.graphics) {
            var o = new Image();
            customImgs[key2_] = [];
            for (l = 0; l < MAX_PLAYERS + 2; l++) customImgs[key2_][l] = o;
            (o.onload = function () {
                for (key3_ in customImgs)
                    if (customImgs[key3_] && customImgs[key3_][0] == customImgs[key3_][1]) {
                        for (var e = ImageTransformer.replaceColors(customImgs[key3_][0], searchColors, playerColors), a = 0; a < e.length; a++) customImgs[key3_][a + 1] = e[a];
                        customImgs[key3_][MAX_PLAYERS + 1] = ImageTransformer.getGreyScaledImage(customImgs[key3_][0]);
                    }
            }),
                (o.src = e.graphics[key2_]);
        }
    this.updateGlobalVars(e.globalVars), (this.teams = []);
    for (l = 0; l < MAX_PLAYERS + 1; l++) this.teams.push(new Team(l));
    (this.players = [new Player("Neutral", CONTROLLER.NONE, 0, 0)]), (this.archonPlayers = {});
    var d = MAX_PLAYERS + 1;
    for (l = 0; l < a.length; l++) {
        var g = a[l],
            m = g.nr ? g.nr : l + 1;
        if ((g.controller == CONTROLLER.SPECTATOR && ((m = d), d++), (isArchon() && (m - 1) % getArchonSize() == 0) || !isArchon())) {
            var p = g.controller == (CONTROLLER.COMPUTER && !network_game) ? g.ai_index : -1,
                c = new Player(g.name, g.controller, m, g.controller == CONTROLLER.SPECTATOR ? 0 : g.team, this.aiRandomizer, p, g.customAI, g.clan, g.skins, g.dances);
            c.controller == CONTROLLER.HUMAN && PLAYING_PLAYER != c && (c.controller, CONTROLLER.REMOTE), (this.players[m] = c);
        } else this.archonPlayers[g.name] = getArchonPlayerNr(m);
    }
    for (l = 0; l < a.length; l++) a[l].isPlayingPlayer && (PLAYING_PLAYER = this.players[getArchonPlayerNr(a[l].nr ? a[l].nr : l + 1)]);
    (ticksCounter = 0), (TICK_TIME = 50), (replaySpeedIndex = 1), (incomingOrders = {}), (outgoingOrders = []), (playerLefts = {}), (TICKS_DELAY = network_game ? 6 : 2), (keyManager = new KeyManager());
    for (var u = 0; u <= this.x + 1; u++) {
        (this.fields[u] = []), (this.fields2x2[u] = []), (this.blockArray[u] = []);
        for (var h = 0; h <= this.y + 1; h++) (this.fields[u][h] = new Field(u, h)), (this.fields2x2[u][h] = new Field(u, h, !0)), (this.blockArray[u][h] = !0), (u < 1 || u > this.x || h < 1 || h > this.y) && (this.blockArray[u][h] = !1);
    }
    (interface_.buttons = []),
        _.each(lists, function (e, a) {
            "imgs" != a &&
                _.each(e, function (a, t) {
                    "none" != t && delete e[t];
                });
        }),
        (this.unitTypes = []);
    for (l = 0; l < basicUnitTypes.length; l++) this.unitTypes.push(new UnitType(basicUnitTypes[l]));
    this.buildingTypes = [];
    for (l = 0; l < basicBuildingTypes.length; l++) this.buildingTypes.push(new BuildingType(basicBuildingTypes[l]));
    this.upgrades = [];
    for (l = 0; l < basicUpgrades.length; l++) this.upgrades.push(new Upgrade(basicUpgrades[l]));
    this.commands = [];
    for (l = 0; l < basicCommands.length; l++) this.commands.push(new Command(basicCommands[l]));
    this.modifiers = [];
    for (l = 0; l < basicModifiers.length; l++) this.modifiers.push(new Modifier(basicModifiers[l]));
    for (key in ((this.graphics = []), unit_imgs)) (unit_imgs[key].id_string = key), this.graphics.push(new Graphic(unit_imgs[key]));
    for (key in building_imgs) (building_imgs[key].id_string = key), (building_imgs[key].file = building_imgs[key].file ? building_imgs[key].file : buildingSheet), this.graphics.push(new Graphic(building_imgs[key]));
    for (key in imgs) this.graphics.push(new Graphic(imgs[key]));
    _.each(this.buildingTypes.concat(this.unitTypes, this.commands, this.upgrades, this.modifiers, this.graphics), function (e) {
        e.addToLists();
    });
    var y = this;
    _.each(e.unitData, function (e, a) {
        if ("amove" != a) {
            if (!lists.types[a]) {
                var t = null;
                e.isUnit
                    ? ((t = new UnitType(e)), y.unitTypes.push(t))
                    : e.isBuilding
                    ? ((t = new BuildingType(e)), y.buildingTypes.push(t))
                    : e.isCommand
                    ? ((t = new Command(e)), y.commands.push(t))
                    : e.isUpgrade
                    ? ((t = new Upgrade(e)), y.upgrades.push(t))
                    : e.isModifier
                    ? ((t = new Modifier(e)), y.modifiers.push(t))
                    : e.isGraphic && ((t = new Graphic(e)), y.graphics.push(t)),
                    (t.id_string = a),
                    t.addToLists();
            }
            var n = e.isGraphic ? lists.imgs[a].getDataFields() : lists.types[a].getDataFields();
            _.each(e, function (e, t) {
                if (n[t])
                    if (n[t].isObject) {
                        var s = {};
                        _.each(e, function (e, a) {
                            s[a] = e;
                        }),
                            (lists.types[a][t] = s);
                    } else if (n[t].isArray) {
                        var i = [];
                        if ("[object Array]" === Object.prototype.toString.call(e)) for (var r = 0; r < e.length; r++) i.push(checkField(n[t], e[r]));
                        else i.push(checkField(n[t], e));
                        lists.types[a][t] = i;
                    } else (lists.types[a][t] = checkField(n[t], e)), "selection" == n[t].type && n[t].all_values && !_.contains(n[t].all_values, lists.types[a][t]) && (lists.types[a][t] = n[t].default_);
            });
        }
    }),
        _.each(e.graphicObjects, function (e, a) {
            if (!lists.imgs[a]) {
                var t = new Graphic(e);
                (t.id_string = a), y.graphics.push(t), t.addToLists();
            }
            var n = lists.imgs[a].getDataFields();
            _.each(e, function (e, t) {
                if (n[t])
                    if ("complex" == n[t].type) {
                        var s = {};
                        _.each(e, function (e, a) {
                            s[a] = e;
                        }),
                            (lists.imgs[a][t] = s);
                    } else (lists.imgs[a][t] = checkField(n[t], e)), "selection" == n[t].type && n[t].all_values && !_.contains(n[t].all_values, lists.types[a][t]) && (lists.imgs[a][t] = n[t].default_);
            });
        });
    for (var f = 0; f < interface_.buttons.length; f++) interface_.buttons[f].init(interface_.buttons[f].command, interface_.buttons[f].learn);
    calculateTypesTickValues(),
        _.each(this.commands.concat(this.upgrades, this.buildingTypes, this.unitTypes, this.modifiers, this.graphics, tileTypes, cliffs, cliffs_winter, egypt_cliffs, grave_cliffs, ramp_tiles, ramp_tiles_egypt, ramp_tiles_grave), function (
            e
        ) {
            e.replaceReferences();
        }),
        (mapEditorData = new MapEditorData()),
        game_state == GAME.EDITOR && editor && editor.createButtons();
    var b = getThemeByName(e.theme);
    if (!b && this.data.defaultTiles && this.data.defaultTiles[0]) for (l = 0; l < mapThemes.length; l++) mapThemes[l].defaultTiles.contains(this.data.defaultTiles[0]) && (b = mapThemes[l]);
    if ((b || (b = mapThemes[0]), (this.theme = b), this.data.defaultTiles))
        for (u = 1; u <= this.x + DEAD_MAP_SPACE; u++) for (h = 1; h <= this.y + DEAD_MAP_SPACE; h++) new Tile({ x: u, y: h, type: this.data.defaultTiles[Math.floor(Math.random() * this.data.defaultTiles.length)].toUnitType() });
    this.makeCliffsArray(), this.makeCliffs();
    for (l = 0; l < e.tiles.length; l++) new Tile({ x: e.tiles[l].x, y: e.tiles[l].y, type: e.tiles[l].type.toUnitType(), dontRefreshNBs: !0 });
    (this.defaultTilesCanvas.width = ((this.x + DEAD_MAP_SPACE) * FIELD_SIZE) / SCALE_FACTOR), (this.defaultTilesCanvas.height = ((this.y + 2 + DEAD_MAP_SPACE) * FIELD_SIZE) / SCALE_FACTOR);
    var v = this.defaultTilesCanvas.getContext("2d"),
        k = this.minimap.groundTiles.getContext("2d");
    if (this.data.defaultTiles)
        for (u = 1; u <= this.x + DEAD_MAP_SPACE; u++)
            for (h = -1; h <= this.y + DEAD_MAP_SPACE; h++) {
                var w = this.data.defaultTiles[Math.floor(Math.random() * this.data.defaultTiles.length)].toUnitType();
                v.drawImage(w.img.file[0], w.img.img.x, w.img.img.y, 16, 16, 16 * (u - 1), 16 * (h - 1 + 2), 16, 16),
                    (k.fillStyle = w.minimapColor),
                    k.fillRect(Math.floor((u - 1) * this.minimap.x_scale), Math.floor((h - 1) * this.minimap.y_scale), Math.ceil(this.minimap.x_scale * w.sizeX), Math.ceil(this.minimap.y_scale * w.sizeY));
            }
    this.generateGroundTextureCanvas(),
        this.generateTilesCanvasses(),
        this.sortTiles(),
        (this.reduceDelayOnNextTick = !1),
        (this.increaseDelayOnNextTick = !1),
        (this.chat = i || {}),
        (FIELD_SIZE = 16 * SCALE_FACTOR),
        this.minimap.refreshTilesCanvas();
    for (f = 0; f < this.buildings.length; f++) this.buildings[f].type.takesGold && this.buildings[f].owner == PLAYING_PLAYER && this.buildings[f];
    $("#showLadderPointsDiv").html(""), $("#chatHistorytextContainer").html(""), (xpNfo = ""), $("#visionDropdown").html("<option id='visionAll' selected='selected' value='0'>All [" + getKeyName(obsKeys[0]) + "]</option>");
    for (l = 1; l < this.players.length; l++)
        if (this.players[l] && this.players[l].controller != CONTROLLER.SPECTATOR && playerColors[l - 1]) {
            var L = playerColors[l - 1][4];
            $("#visionDropdown")[0].innerHTML += "<option style='color: rgb(" + L[0] + ", " + L[1] + ", " + L[2] + ");' value='" + l + "'>" + this.players[l].name + " [" + l + "]</option>";
        }
    ($("#visionDropdown")[0].selectedIndex = 0),
        ($("#spectatorDropdown")[0].selectedIndex = 0),
        refreshPlayerSettingsHTML(e.players ? e.players : getDefaultPlayerSettings(e.countPlayers ? e.countPlayers : MAX_PLAYERS)),
        env.setFromTheme(b),
        (this.replay_mode = null != n),
        (game_paused = !1),
        (show_fps = !1),
        (this.chat_muted = !1),
        network_game && interface_.chatMsg("press [ENTER] to chat", !0),
        (this.rainTime = r || getRainTimeFromSeed(t));
}),
    (Network.prototype.onmessage = function (e, a) {
        var t = e.data,
            n = t.split("<<$");
        if ("server-info" == n[0]) displayInfoMsg(n[1]);
        else if (game_state == GAME.LOGIN) {
            if ("really-log-in" == n[0]) {
                const e = $("#loginWindowUsername")[0];
                if (e) {
                    var s = e.value == getUserNameFromCookie();
                    $("#loginWindowState").html(`<br />There seem to be existing sessions for this account. Continuing will log out any existing sessions. <button onclick='formLogin("${s ? "yes" : "no"}");'>login</button>`);
                } else console.log("Autologin failed, logging in as guest"), network.send("logout<<$pls"), instantLogin(!0);
            } else if ("logged-in" == n[0]) {
                console.log("logged in"), (LOGIN_STATE = "PLAYER"), saveLogin();
                try {
                    $("#loginWindowPassword")[0].value = "";
                } catch (e) {}
                networkPlayerName = n[1];
                const e = n[2];
                (game_state = GAME.LOBBY),
                    tryShowChangeLog(),
                    writeCookie(),
                    (this.authedAndLogged = !0),
                    (iAmMod = "1" == n[3]),
                    (iAmAdmin = "1" == n[4]),
                    (iAmMod2 = "1" == n[11]),
                    (league = parseInt(n[5])),
                    (ignores = n[6].length > 0 ? n[6].toLowerCase().split(",") : []),
                    (exp = parseInt(n[7])),
                    (myAccId = parseInt(n[13])),
                    updatePlayerClanInfo(networkPlayerName, e),
                    ($("#playerGoldWrap")[0].title = goldDescription),
                    (gold = n[9]),
                    $("#playerGoldWrap").html(
                        "<span id='playerGold'>" + currencyFormatter(gold) + "</span> <img src='imgs/gold2.png' class='pixelated' style='width: 32px;' /> <button onclick='showBuyGoldWindow(myAccId);'>Get more!</button>"
                    ),
                    rfSBTN(),
                    league >= 0
                        ? $("#mainLeagueLink").html(getLeagueLink(league, !1, 4))
                        : ($("#mainLeagueLink").html("<div id='noRankingYetDiv'>You have no ladder rank yet. Play <span id='rankedGamesLeft'>" + Math.max(5 - n[7], 1) + "</span> ranked matches to get placed into a division</div>"),
                          $("#mainLeagueLink").prop("title", "")),
                    ($("#playerGoldWrap")[0].style.visibility = "visible"),
                    "0" == n[9] && ((game_state = GAME.ACCEPT_AGB), showAGB2()),
                    parseInt(n[11]) > Date.now() / 1e3 && ($("#div-gpt-ad-1571242603068-0").remove(), $("#pleaseNoAdblockDiv").remove(), (premium_until = parseInt(n[11])));
                try {
                    $("#accGuestMsgDiv")[0].style.visibility = "hidden";
                } catch (e) {}
                addLoginButton("guestLoginPromptButton", "Log Out", !0),
                    ($("#accInfoWindow")[0].innerHTML +=
                        "<div id='mainExpDiv' title='This is your current experience and the experience you need to reach the next level. You get experience from games you play. If you level up, new features will get unlocked.'></div>"),
                    addLoginButton("guestLoginPromptButton", "Log Out"),
                    refreshMainExpDiv(),
                    showPlayerInfo(!0);
            } else if ("logged-in-guest" == n[0])
                console.log("logged in guest"),
                    (LOGIN_STATE = "GUEST"),
                    (networkPlayerName = n[1]),
                    (game_state = GAME.LOBBY),
                    tryShowChangeLog(),
                    writeCookie(),
                    (this.authedAndLogged = !1),
                    $("#playerNameDisplay").html(networkPlayerName),
                    $("#friendsSubdiv").html("<div id='friends_guest_div'>If you register an account, you can add other players as friends</div>"),
                    addLoginButton("guestLoginPromptButton", "Log In"),
                    $("#accGuestMsgDiv")[0] ? ($("#accGuestMsgDiv")[0].style.visibility = "") : $("#accInfoWindow").append("<div id='accGuestMsgDiv'>Log in to get Exp and gold rewards as well as access to friends and ranked play!</div>"),
                    showPlayerInfo(!1);
            else if ("register-state" == n[0] && n[1]) {
                console.log(`register-state: ${n[1]}`), $("#loginWindowUsername")[0] ? ($("#loginWindowState")[0].innerHTML = n[1]) : (console.log("Autologin failed, logging in as guest"), network.send("logout<<$pls"), instantLogin(!0));
            }
            ("logged-in" != n[0] && "logged-in-guest" != n[0]) ||
                dontShowFaq ||
                ($("#faqContainer")[0].innerHTML =
                    "<span id='faqLink'>&nbsp;New here? Read the <a class='underline' onclick='fadeIn($(\"#faqWindow\")); soundManager.playSound(SOUND.CLICK);'>F.A.Q.</a> <button onclick='killFaqMsg0();' id='killFaqMsgButton'>x</button></span>");
        } else if (game_state == GAME.REGISTER) "register-state" == n[0] && n[1] && $("#registerWindowState").html(n[1]);
        else if (game_state == GAME.RECOVERY) "register-state" == n[0] && n[1] && $("#recoveryWindowState").html(n[1]);
        else if ("agb-accept-ok" == n[0]) (game_state = GAME.LOBBY), ($("#agbAcceptDiv")[0].style.display = "none");
        else if ("add-ignore" == n[0]) ignores.push(n[1].toLowerCase()), game_state == GAME.PLAYING ? interface_.chatMsg("Server: " + n[1] + " will be ignored") : addChatMsg("Server", n[1] + " will be ignored");
        else if ("no-ignore" == n[0]) game_state == GAME.PLAYING ? interface_.chatMsg("Server: " + n[1] + " does not exist") : addChatMsg("Server", n[1] + " does not exist");
        else if ("already-ignore" == n[0]) game_state == GAME.PLAYING ? interface_.chatMsg("Server: " + n[1] + " is already being ignored") : addChatMsg("Server", n[1] + " is already being ignored");
        else if ("unignore" == n[0])
            game_state == GAME.PLAYING
                ? interface_.chatMsg("Server: " + n[1] + (ignores.erease(n[1]) ? " will no longer be ignored" : " not found on your ignore list (type /ignorelist to see the whole list)"))
                : addChatMsg("Server", n[1] + (ignores.erease(n[1]) ? " will no longer be ignored" : " not found on your ignore list"));
        else if ("clan-update" == n[0]) setClan(n[1], n[2], n[3], n[4], n[5], n[6]), updatePlayerClanInfo(networkPlayerName, n[1]);
        else if ("clan-wall" == n[0]) setClanWall(n);
        else if ("clan-update-noclan" == n[0]) setNoClan(n[1]), updatePlayerClanInfo(networkPlayerName, n[1]);
        else if ("setExp_" == n[0]) (document.cookie = "exp=" + n[1] + "; expires=" + getGMTDateString4Days(90)), (localStorage.exp = n[1]);
        else if ("unlock-emotes" == n[0]) unlockEmote(n[1], n[2]);
        else if ("achivement-unlocked" == n[0]) unlockAchivement(n[1]);
        else if ("level-up" == n[0]) levelUp(n);
        else if ("gained-xp" == n[0]) {
            (exp += parseInt(n[1])), refreshMainExpDiv();
            var i = getLvlFromXp(exp),
                l = getXPRequiredForLvl(i),
                o = getXPRequiredForLvl(parseInt(i) + 1),
                d = "<div id='xpDiv' class='greenfont' title='You gain experience from multiplayer games. Experience will make you level up and unlock new features'>+ " + n[1] + " EXP</div>";
            (d += "<div class='xpBar'><div style='width: " + ((exp - l) / (o - l)) * 200 + "px; height: 30px;'></div>"),
                (d += "<p style='font-size: 24px;'>" + exp + " / " + o + "</p></div><p style='font-size: 14px; position: absolute; left: 300px; bottom: 2px; width: 200px; text-align: center;'>"),
                (d += o + " exp required for level " + (i + 1) + "</p>"),
                (d += "<div class='LevelText'>Level <span class='greenfont'>" + i + "</span></div>"),
                ($("#statisticsTextArea")[0].innerHTML += d),
                (xpNfo = d);
        } else if ("league" == n[0]) {
            d = "<div style='margin: 0 auto; text-align: center;'>" + getLeagueLink(n[1], !1, 4, !1) + "</div><br /><table style='margin: 0 auto;'>";
            d += "<tr><td class='tabletop'>Rank</td><td class='tabletop'>Player</td><td class='tabletop'>Points</td><td class='tabletop'>Record</td></tr>";
            for (var g = n[2] && n[2].length > 0 ? n[2].split(" ") : [], m = 0, p = 0; p < g.length - 1; p += 4) {
                m++;
                var c = g[p] == networkPlayerName ? " class='highlighted' " : "";
                d +=
                    "<tr><td " +
                    c +
                    ">" +
                    m +
                    "</td><td " +
                    c +
                    ">" +
                    getPlayerLink(g[p]) +
                    "</td><td " +
                    c +
                    ">" +
                    g[p + 1] +
                    "</td><td " +
                    c +
                    "><font class='greenfont'>" +
                    g[p + 2] +
                    "</font> / <font class='redfont'>" +
                    g[p + 3] +
                    "</font></td></tr>";
            }
            (d += "</table><button id='showAllLeaguesButton' onclick='showAllDivisions(); soundManager.playSound(SOUND.CLICK);'>All divisions</button>"),
                uimanager.playerInfoWindow.setTitle("<font style='color: rgb(255, 248, 57);'>" + leagueNames[n[1]] + "</font>"),
                $("#addScrollableSubDivTextArea").html(d),
                $("#riderDiv").html(""),
                fadeIn($("#playerInfoWindow"));
        } else if ("query" == n[0]) {
            var u = !1;
            if (ignores.contains(n[2].toLowerCase()) && n[2] == n[3]) return void (0 == n[4] && network.send("query-ignore<<$" + n[2]));
            var h = getQueryMsg(n);
            if (h && h.length > 0) {
                for (p = 0; p < uimanager.queries.length; p++)
                    uimanager.queries[p].name == n[2] &&
                        (open_queries == OPEN_QUERIES.NEVER ||
                            (open_queries == OPEN_QUERIES.NOT_INGAME && game_state == GAME.PLAYING) ||
                            ("none" == uimanager.queries[p].domElement.style.display ? soundManager.playSound(SOUND.BING, !1, 0.8) : soundManager.playSound(SOUND.ZIP3, !1, 1), uimanager.queries[p].activate()),
                        uimanager.queries[p].addMsg(h),
                        (u = !0));
                if (!u) {
                    var y = new Query(n[2]);
                    y.addMsg(h), uimanager.queries.push(y), soundManager.playSound(SOUND.BING, !1, 0.8);
                }
            }
        } else if ("maps-list" == n[0]) {
            $("#selectMapArea").html("");
            var f = "",
                b = parseInt(n[1]) + 1,
                v = parseInt(n[2]);
            if (v > 1) {
                var k = b - (16 - Math.min(v - b, 8)),
                    w = b + (16 - Math.min(b, 8));
                k > 1 && (f += "<button onclick='requestCustomMapsPage(0);'>1</button> " + (k > 2 ? "... " : " "));
                for (p = Math.max(k, 1); p <= Math.min(w, v); p++) f += p != b ? "<button onclick='requestCustomMapsPage(" + (p - 1) + ");'>" + p + "</button> " : "<span>" + p + "</span> ";
                w < v && (f += (w - 1 < v ? "..." : "") + " <button onclick='requestCustomMapsPage(" + (v - 1) + ");'>" + v + "</button> ");
            }
            $("#selectMapPages").html(f);
            for (p = 3; p < n.length; p += 6) {
                ((be = document.createElement("button")).innerHTML = n[p] + " [" + n[p + 3] + "]<br /><img class='mapPreviewImg2' src='" + n[p + 2] + "' />" + ("Custom mods" == n[p + 4] ? "<div class='modLabel'>[mod]</div>" : "")),
                    (be.className = "Custom mods" == n[p + 4] ? "mapButtonMod" : "mapButton"),
                    (be.title =
                        n[p + 1].substring(0, 300) +
                        (n[p + 1].length > 300 ? "... " : "") +
                        ("Custom mods" == n[p + 4] ? "\n\n[This map contains modding elements. It can contain custom or modified units, buildings or abilities and diverse from the normal game]" : "")),
                    0 != n[p + 5] && (be.title += "\n\n" + n[p + 5] + " times played in the last 5 days"),
                    (be.i_ = n[p]),
                    (be.mapImg_ = n[p + 2]),
                    this.game.id && 0 != this.game.id
                        ? (be.onclick = function () {
                              requestNewSkirmishMap(this.i_, this.mapImg_), soundManager.playSound(SOUND.CLICK), fadeOut($("#pickMapWindow"));
                          })
                        : (be.onclick = function () {
                              createGame(this.i_, this.mapImg_);
                          }),
                    $("#selectMapArea").append(be);
            }
        } else if ("custom-map-creation-file" == n[0]) {
            network.send("cancel-ladder"), fadeOut($("#ladderWindow")), ((M = JSON.parse(n[1])).img = getImageFromMap(M));
            var L = M.description;
            (M.description = M.description.replace(/\n/g, "<br />")),
                game_state == GAME.LOBBY
                    ? createdMulti
                        ? ((this.game.id = 1), (this.game.name = M.name), $("#lobbyGameChatTextArea").html(""), lobbyPlayerManager.init(!0, M, !0), setChatFocus(!1))
                        : (lobbyPlayerManager.init(!1, M), (game_state = GAME.SKIRMISH))
                    : game_state == GAME.EDITOR &&
                      ("false" != n[2]
                          ? (uimanager.showLoadingScreen(M),
                            setTimeout(function () {
                                (game = new Game()),
                                    game.loadMap(M, null, null, null, !0),
                                    worker.postMessage({ what: "start-game", editorLoad: !0, map: M, players: null, network_game: network_game, game_state: game_state, networkPlayerName: networkPlayerName }),
                                    L.indexOf("\n\nMap by ") >= 0 && (L = L.split("\n\nMap by ").slice(0, -1).join("\n\nMap by ")),
                                    ($("#mapNameInput")[0].value = M.name),
                                    ($("#mapDescriptionInput")[0].value = L),
                                    $("#mapOpenCheckbox").prop("checked", !!M.globalVars && M.globalVars.isOpen),
                                    $("#useBlackFogCheckbox").prop("checked", !!M.globalVars && M.globalVars.useDarkMask),
                                    ($("#maxSupplyInput")[0].value = !!M.globalVars && M.globalVars.maxSupply),
                                    ($("#startGoldInput")[0].value = !!M.globalVars && M.globalVars.startGold),
                                    ($("#mineDistInput")[0].value = !!M.globalVars && M.globalVars.mineDist);
                            }, 50))
                          : displayInfoMsg("You can only edit your own maps!")),
                fadeOut($("#pickMapWindow"));
        } else if ("custom-map-replay-file" == n[0] && n[1]) {
            var M = JSON.parse(n[1]);
            if (((currentMapImg = n[2]), (r = replayFile), M && M.timestamp == r.mapVersion && r.gameVersion == GAME_VERSION)) {
                network.send("cancel-ladder"), fadeOut($("#ladderWindow"));
                var T = r.players.concat([{ name: networkPlayerName, controller: CONTROLLER.SPECTATOR, team: 0, isPlayingPlayer: !0 }]);
                uimanager.showLoadingScreen(M, T),
                    hideChat(),
                    setTimeout(function () {
                        (game_state = GAME.PLAYING),
                            network.send("leave-lobby"),
                            (game = new Game()),
                            game.loadMap(M, T, r.aiRandomizer, r.ticksCounter, !1, r.messages),
                            worker.postMessage({
                                what: "start-game",
                                map: M,
                                players: T,
                                network_game: network_game,
                                game_state: game_state,
                                networkPlayerName: networkPlayerName,
                                aiRandomizer: r.aiRandomizer,
                                ticksCounter: r.ticksCounter,
                                incomingOrders: r.orders,
                                playerLefts: r.playerLefts,
                            }),
                            (incomingOrders = r.orders),
                            (playerLefts = r.playerLefts),
                            (mapData = ""),
                            $("#replayShowSpeed").html("1x");
                    }, 50);
            } else
                r.gameVersion != GAME_VERSION
                    ? displayInfoMsg(
                          "This replay was recorded with an older game version (" +
                              r.gameVersion +
                              "). The current game version is " +
                              GAME_VERSION +
                              ". You can check <a href='/old_versions'><span style='text-decoration: underline;'>the old versions directory</span></a> for the version of the game your replay was recorded with and then load it up with that version."
                      )
                    : displayInfoMsg("This replay was made with an older map version. Unfortunately you can't watch it anymore.");
        } else if ("laddermaps-list" == n[0]) {
            fadeIn($("#ladderWindow"));
            d =
                "Here you can play ranked 1v1 matches. If you click the 'Start searching' button, an opponent (preferably of same skill) will be searched (this may take a while, depending on how many other player searching for ranked matches). The winner gets ranking points while the loser loses ranking points. ";
            (d += "The first 5 ranked matches you play will be used to determine your skill level. After your 5th game you will be placed into a division. "),
                (d += "From there on you can get promoted or demoted depending on your results. Ranked matches are played on one of the following maps (randomly picked):<br /><br /><font style='color: #13C700;'>");
            for (p = 1; p < n.length; p++) d += n[p] + ", ";
            (d = d.substr(0, d.length - 2) + "</font><br /><br />"),
                $("#ladderWindow").html(d),
                $("#ladderWindow").append(
                    uimanager.createButton("ladderButton2", "Start searching", function () {
                        network.authedAndLogged
                            ? (network.send("init-ladder<<$" + GAME_VERSION),
                              fadeIn($("#ladderWindow")),
                              $("#ladderWindow").html("<br /><p style='font-size: 30px; margin: 20px auto;'>searching for opponent ...</p><br /><br /><br />"),
                              $("#ladderWindow").append(
                                  uimanager.createButton("cancelLadderButton", "cancel", function () {
                                      network.send("cancel-ladder"), fadeOut($("#ladderWindow")), soundManager.playSound(SOUND.CLICK);
                                  })
                              ))
                            : (displayInfoMsg("Only registered users can play ranked matches."), fadeOut($("#ladderWindow"))),
                            soundManager.playSound(SOUND.CLICK);
                    })
                ),
                $("#ladderWindow").append(
                    uimanager.createButton("ladderCancelButton2", "Cancel", function () {
                        fadeOut($("#ladderWindow")), soundManager.playSound(SOUND.CLICK);
                    })
                );
        } else if ("ladder-result" == n[0])
            $("#showLadderPointsDiv").html(""),
                "+" == n[1].substr(0, 1)
                    ? (($("#showLadderPointsDiv")[0].style.color = "#5EFF3E"), ($("#showLadderPointsDiv")[0].style.fontSize = "90px"), $("#showLadderPointsDiv").html(n[1] + " Points"))
                    : "-" == n[1].substr(0, 1)
                    ? (($("#showLadderPointsDiv")[0].style.color = "red"), ($("#showLadderPointsDiv")[0].style.fontSize = "70px"), $("#showLadderPointsDiv").html(n[1] + " Points"))
                    : "promotion" == n[1].substr(0, 9)
                    ? (storedAchivements.push({
                          text: "<div id='promotionTextDiv' style='font-size: 30px;'><font class='greenfont'>Congratulations!</font> You were promoted to a new league:</div>" + getLeagueLink(n[1].split(" ")[1], !1, 8),
                          sound: SOUND.ARCHIVEMENT2,
                      }),
                      $("#mainLeagueLink").html(getLeagueLink(n[1].split(" ")[1], !1, 4)),
                      showAchivement())
                    : "demotion" == n[1].substr(0, 8)
                    ? (storedAchivements.push({ text: "<div id='promotionTextDiv' style='font-size: 30px;'>You were demoted to a new league:</div>" + getLeagueLink(n[1].split(" ")[1], !1, 8) }),
                      $("#mainLeagueLink").html(getLeagueLink(n[1].split(" ")[1], !1, 4)),
                      showAchivement())
                    : "placement" == n[1].substr(0, 9)
                    ? ($("#showLadderPointsDiv").html(n[1].split(" ")[1] + " matches left until you will get placed"),
                      ($("#showLadderPointsDiv")[0].style.color = "white"),
                      ($("#showLadderPointsDiv")[0].style.fontSize = "40px"),
                      $("#rankedGamesLeft").html(n[1].split(" ")[1]))
                    : "init-place" == n[1].substr(0, 10) &&
                      (storedAchivements.push({
                          text: "<div id='promotionTextDiv' style='font-size: 30px;'><font class='greenfont'>Congratulations!</font> You've been placed in a league</div>" + getLeagueLink(n[1].split(" ")[1], !1, 8),
                          sound: SOUND.ARCHIVEMENT2,
                      }),
                      $("#mainLeagueLink").html(getLeagueLink(n[1].split(" ")[1], !1, 4)),
                      showAchivement());
        else if ("player-info" == n[0]) {
            var I = "<br />Ladder Record: <font class='greenfont'>" + parseInt(n[7]) + "</font> wins, <font class='redfont'>" + parseInt(n[8]) + "</font> losses";
            parseInt(n[5]) >= 0 && (I += "<br />Ladder Ranking: " + getLeagueLink(n[5], !1, 1, !1) + " (" + parseInt(n[6]) + " Points)"),
                (I += "<br />"),
                "1" == n[4] ? (I += "<br /><font style='color: #E84141;'>Admin</font> ") : "1" == n[3] && (I += "<br /><font style='color: #F38F3C;'>Moderator</font> "),
                "true" == n[13] && (I += "<br /><font style='color: #5FFF39;'>Premium User</font> ");
            var P =
                    (n[9] && n[9].length > 0) || n[1] == networkPlayerName
                        ? "<br /><br />Personal Text:<div id='personalTextDiv'>" +
                          escapeHtml(n[9]).replace(/(?:\r\n|\r|\n)/g, "<br />") +
                          "</div>" +
                          (n[1] == networkPlayerName ? "<br /><button id='profileTextButton' onclick=editPersonalText()>edit</button>" : "")
                        : "",
                E = "Level: <span class='greenfont'>" + getLvlFromXp(n[12]) + "</span><br />Experience: <span style='color: rgb(255, 255, 100);'>" + n[12] + "</span><br />",
                A = n[10] && n[10].length > 0 ? "Clan: [<a href='#' onclick='getClanInfo(\"" + n[10] + "\");' class='clanLink'>" + n[10] + "</a>]<br />" : "";
            (addFriendButton = 0 == n[11] && n[1] != networkPlayerName && this.authedAndLogged), generatePlayerWindow(n[1], E + A + "Unranked games: " + n[2] + I + P);
        } else if ("achivements-list" == n[0]) showAchivementsWindow(n[1]);
        else if ("player-info-ladder" == n[0]) {
            var S = "<p>Last ladder results:</p><table>";
            for (p = 2; p + 2 < n.length; p += 5) {
                var C = "";
                (C = -1 == n[p + 2] ? "<span style='color: yellow;'>-</span>" : ("1" == n[p + 2] && n[p] == n[1]) || ("2" == n[p + 2] && n[p + 1] == n[1]) ? "<span class='greenfont'>win</span>" : "<span class='redfont'>loss</span>"),
                    (S += "<tr><td>" + getPlayerLink(n[p]) + "</td><td> vs </td><td>" + getPlayerLink(n[p + 1]) + "</td><td> " + C + "</td><td class='ladderGameTimeTD'> &nbsp; " + n[p + 3] + "</td><td> &nbsp; " + n[p + 4] + "</td></tr>");
            }
            (S += "</table>"), generatePlayerWindow(n[1], S);
        } else if ("player-info-friends" == n[0]) {
            var N = n[2].split(" "),
                O = "<h2>Friends (" + (N.length - 1) + " / 100)</h2>";
            for (p = 0; p < N.length; p++) O += " " + getPlayerLink(N[p]) + "<br />";
            generatePlayerWindow(n[1], O);
        } else if ("player-info-maps" == n[0]) {
            O = "<p>Maps made by " + n[1] + ":</p><br />";
            var x = !1;
            for (p = 2; p < n.length; p++) n[p].length > 0 && ((x = !0), (O += " &nbsp; " + n[p] + "<br />"));
            x || (O = " &nbsp; " + n[1] + " has not made any maps"), generatePlayerWindow(n[1], O);
        } else if ("player-info-arch" == n[0]) {
            for (d = "<div>", p = 0; p < achivements.length; p++)
                if (checkDBPos(achivements[p].dbPos, n[5])) {
                    var D = achivements[p];
                    (d += "<div class='achivement_div2' title='" + D.text + "'>"), (d += "<img class='pixelated' style='height: 81px;' src='imgs/achivements/" + D.img + "' /><p>" + D.name + "</p></div>");
                }
            d += "</div><div style='clear: both;'></div><br /><br /><div style='padding: 20px;'>";
            var G = emotes.concat(_emotes2);
            for (p = 0; p < G.length; p++)
                (K = G[p].free || (G[p].dbPos && G[p].dbPos <= n[2].length && "1" == n[2].substr(n[2].length - G[p].dbPos, 1))) && (d += "<img title='" + G[p].name + "' class='buytableImgs' src='imgs/emotes/" + G[p].img + "' /> ");
            (d += "</div>"), generatePlayerWindow(n[1], d);
        } else if ("clan-info" == n[0]) {
            d =
                "Tag: [" +
                n[1] +
                "]<br />Name: " +
                n[2] +
                "<br />" +
                (n[3] ? "<div class='profileTextDiv'>" + escapeHtml(n[3]).replace(/(?:\r\n|\r|\n)/g, "<br />") + "</div>" : "") +
                "<br /><br /><span class='biggerFont'>Members:</span><br />";
            var R = n[4].split(" ");
            for (p = 0; p < R.length; p++) R[p].length > 0 && (d += getPlayerLink(R[p]) + "<br />");
            (d += "<br /><br /><button onclick='getClanList(); soundManager.playSound(SOUND.CLICK);'>show all clans</button>"),
                $("#addScrollableSubDivTextArea").html(d),
                $("#riderDiv").html(""),
                fadeIn($("#playerInfoWindow")),
                uimanager.playerInfoWindow.setTitle("<font style='color: rgb(255, 248, 57);'>Clan " + n[2] + "</font>");
        } else if ("gold-update" == n[0]) (gold = n[1]), $("#playerGold").html(gold), console.log(`Gold update ${gold}`);
        else if ("gold-reward" == n[0])
            displayInfoMsg2("<p style='font-size: 44px;'>You got <span style='color: rgb(255, 255, 99);'>" + n[1] + "</span> gold</p><br /><br /><br /><img src='imgs/gold2.png' class='pixelated' style='height: 128px;' />", !0);
        else if ("emotes-info" == n[0]) {
            var U = gold,
                Y = hex32ToBin(n[1]);
            for (d = "<div><br />&nbsp; &nbsp;Emotes are small icons that can be used in lobby chat.<br /><br /></div>", p = 0; p < emotes.length; p++) {
                var F = "";
                (K = emotes[p].free || (emotes[p].dbPos && emotes[p].dbPos <= Y.length && "1" == Y.substr(Y.length - emotes[p].dbPos, 1)))
                    ? (F = "title='Type " + emotes[p].text + " in chat to use this emote'")
                    : emotes[p].price
                    ? (F = "title='Buy this emote for " + emotes[p].price + "€'")
                    : emotes[p].gold
                    ? (F = U >= emotes[p].gold ? "title='Get this emote for " + emotes[p].gold + " gold'" : "title='You need " + emotes[p].gold + " gold for this emote'")
                    : emotes[p].playerLvl
                    ? (F = "title='This emote wil be unlocked when your account reaches level " + emotes[p].playerLvl + "'")
                    : emotes[p].div
                    ? (F = "title='This emote wil be unlocked when you reach " + leagueNames[emotes[p].div - 1] + " (or a higher league)'")
                    : emotes[p].special && (F = "title='" + emotes[p].requirementTitle + "'"),
                    (d += "<div class='buytable2' " + F + "><p><img class='buytableImgs' src='imgs/emotes/" + emotes[p].img + "' /></p><p class='buytableNames'>" + emotes[p].name + "</p><div class='buytablePurchased'>"),
                    K
                        ? (d += "<font class='greenfont'>unlocked</font>")
                        : emotes[p].price
                        ? (d += getBuyButton0(emotes[p].artNr, emotes[p].price, n[2]))
                        : emotes[p].gold
                        ? (d += U >= emotes[p].gold ? "<button onclick='getItem4Gold(\"" + emotes[p].artNr + "\");'>Get for " + emotes[p].gold + " gold</button>" : "<span class='redfont'>" + emotes[p].gold + " gold required</span>")
                        : emotes[p].playerLvl
                        ? (d += "Level " + emotes[p].playerLvl + " required")
                        : emotes[p].div
                        ? (d += leagueNames[emotes[p].div - 1] + " required")
                        : emotes[p].special && (d += emotes[p].requirementText),
                    (d += "</div></div>");
            }
            $("#addScrollableSubDivTextArea").html(d),
                fadeIn($("#playerInfoWindow")),
                uimanager.playerInfoWindow.setTitle("<font style='color: rgb(255, 248, 57);'>Emotes</font>", "<button onclick='soundManager.playSound(SOUND.CLICK); showMicroTransWindow();'>back</button>");
        } else if ("skins-info" == n[0]) {
            (U = gold), (d = "<div>Purchase custom skins for your units!</div>");
            var W = null;
            try {
                W = JSON.parse(n[2]);
            } catch (e) {}
            W || (W = {});
            for (m = 0; m < basicUnitTypes.length; m++) {
                var H = !0,
                    B = 0;
                for (p = 0; p < skins.length; p++)
                    if (skins[p].unit_id_string == basicUnitTypes[m].id_string) {
                        var K = skins[p].free || (skins[p].dbPos && n[1].length >= skins[p].dbPos && "1" == n[1].substr(n[1].length - skins[p].dbPos, 1));
                        if (H) {
                            (H = !1), (X = (se = unit_imgs[basicUnitTypes[m].img]).idle.frameWidth) > (J = se.idle.h / se._angles) ? ((J = (J / X) * 100), (X = 100)) : ((X = (X / J) * 100), (J = 100));
                            var q = se.file[1].width * (X / se.idle.frameWidth),
                                V = se.file[1].height * (J / (se.idle.h / se._angles)),
                                z = se.idle.x * (q / se.file[1].width),
                                j = se.idle.y * (V / se.file[1].height);
                            (d +=
                                "<div class='buytable'><p class='buytable_title'>" +
                                basicUnitTypes[m].name +
                                "</p><div><button id='skins_" +
                                basicUnitTypes[m].id_string +
                                "_0' onclick='setSkin(null, \"" +
                                basicUnitTypes[m].id_string +
                                '", ' +
                                B +
                                ");'"),
                                (d += "class='buytableImgs2 " + (W[basicUnitTypes[m].id_string] ? "b_inactive" : "b_active") + "'><div style='width: " + X + "px; height: " + J + "px; overflow: hidden; position: relative;'>"),
                                (d +=
                                    "<img style='position: absolute; left: " +
                                    -z +
                                    "px; top: " +
                                    -j +
                                    "px; width: " +
                                    q +
                                    "px; height: " +
                                    V +
                                    "px;' src='" +
                                    (se.file[1].toDataURL ? se.file[1].toDataURL() : se.file[1].src) +
                                    "' /></div></button>"),
                                (d += "<p class='buytableNames'>Default</p><p class='buytablePurchased'>"),
                                (d += "<font class='greenfont'>unlocked</font></div>");
                        }
                        B++;
                        var X,
                            J,
                            Z = unit_imgs[skins[p].img];
                        (X = Z.idle.frameWidth) > (J = Z.idle.h / se._angles) ? ((J = (J / X) * 100), (X = 100)) : ((X = (X / J) * 100), (J = 100));
                        (q = Z.file[1].width * (X / Z.idle.frameWidth)), (V = Z.file[1].height * (J / (Z.idle.h / se._angles))), (z = Z.idle.x * (q / Z.file[1].width)), (j = Z.idle.y * (V / Z.file[1].height));
                        var Q = skins[p].name || "Default";
                        (d += " <div><button id='skins_" + basicUnitTypes[m].id_string + "_" + B + "' " + (K ? "onclick='setSkin(\"" + skins[p].artNr + '", "' + basicUnitTypes[m].id_string + '", ' + B + ");' " : "")),
                            (d += "class='buytableImgs2 " + (K ? (W[basicUnitTypes[m].id_string] == skins[p].artNr ? "b_active" : "b_inactive") : "b_disabled") + "'>"),
                            (d += "<div style='width: " + X + "px; height: " + J + "px; overflow: hidden; position: relative;'>"),
                            (d +=
                                "<img style='position: absolute; left: " +
                                -z +
                                "px; top: " +
                                -j +
                                "px; width: " +
                                q +
                                "px; height: " +
                                V +
                                "px;' src='" +
                                (Z.file[1].toDataURL ? Z.file[1].toDataURL() : Z.file[1].src) +
                                "' /></div></button>"),
                            (d += "<p class='buytableNames'>" + Q + "</p><p class='buytablePurchased'>"),
                            K
                                ? (d += "<font class='greenfont'>unlocked</font>")
                                : skins[p].price
                                ? (d += getBuyButton0(skins[p].artNr, skins[p].price, n[4]))
                                : skins[p].gold
                                ? (d += U >= skins[p].gold ? "<button onclick='getItem4Gold(\"" + skins[p].artNr + "\");'>Get for " + skins[p].gold + " gold</button>" : "<span class='redfont'>" + skins[p].gold + " gold required</span>")
                                : skins[p].playerLvl
                                ? (d += "Level " + skins[p].playerLvl + " required")
                                : skins[p].div && (d += leagueNames[skins[p].div] + " required"),
                            (d += "</p></div>");
                    }
                H || (d += "</div>");
            }
            d += "<div style='clear: both;'><br /><h2>&nbsp; &nbsp;Dances</h2></div><div>&nbsp; &nbsp;Some of your units can perform dance animations in game.<br /><br /></div>";
            var ee = [],
                ae = [],
                te = [],
                ne = [];
            for (B = 0, m = 0; m < basicUnitTypes.length; m++) {
                for (H = !0, p = 0; p < dances.length; p++)
                    if (dances[p].unit_id_string == basicUnitTypes[m].id_string) {
                        K = dances[p].free || (dances[p].dbPos && "1" == n[3].substr(n[3].length - dances[p].dbPos, 1));
                        H && ((H = !1), (d += "<div class='buytable'><p class='buytable_title'>" + basicUnitTypes[m].name + "</p>"));
                        var se = unit_imgs[basicUnitTypes[m].img][dances[p].animName],
                            ie = unit_imgs[basicUnitTypes[m].img].file[1];
                        ee.push(4 * se.frameWidth),
                            ae.push(4 * se.w),
                            te.push(4 * se.x),
                            ne.push(4 * se.y),
                            (d += "<div " + (K ? "title='Select units ingame and type " + dances[p].chat_str + " in chat to make them perform this dance'" : "") + "><div class='dancediv' "),
                            (d += " style='width: " + 4 * se.frameWidth + "px;'><img id='dance_img_" + B + "' style='margin-left: 0; height: " + 4 * ie.height + "px;' class='pixelated' src='" + ie.toDataURL() + "' /></div>"),
                            (d += "<p class='buytableNames'>" + dances[p].name + "</p><p class='buytablePurchased'>"),
                            K
                                ? (d += "<font class='greenfont'>unlocked</font>")
                                : dances[p].price
                                ? (d += getBuyButton0(dances[p].artNr, dances[p].price, n[4]))
                                : dances[p].gold
                                ? (d += U >= dances[p].gold ? "<button onclick='getItem4Gold(\"" + dances[p].artNr + "\");'>Get for " + dances[p].gold + " gold</button>" : "<span class='redfont'>" + dances[p].gold + " gold required</span>")
                                : dances[p].playerLvl
                                ? (d += "Level " + dances[p].playerLvl + " required")
                                : dances[p].div && (d += leagueNames[dances[p].div] + " required"),
                            (d += "</p></div>"),
                            B++;
                    }
                H || (d += "</div>");
            }
            animateDances(ee, ae, te, ne),
                $("#addScrollableSubDivTextArea").html(d),
                fadeIn($("#playerInfoWindow")),
                uimanager.playerInfoWindow.setTitle("<font style='color: rgb(255, 248, 57);'>Skins &amp; Dances</font>", "<button onclick='soundManager.playSound(SOUND.CLICK); showMicroTransWindow();'>back</button>");
        } else if ("friends-pending" == n[0]) updateFriendsPendingIcon("1" == n[1]);
        else if ("friends-list" == n[0] && n.length >= 2) {
            O = "";
            var re = "",
                le = "",
                oe = "",
                de = "",
                ge = 0,
                me = 0,
                pe = 0,
                ce = 0,
                ue = n[1].split(" ");
            for (p = 0; p < ue.length; p += 4)
                if (0 == ue[p + 2]) {
                    ge++;
                    var he = ue[p] == networkPlayerName ? ue[p + 1] : ue[p];
                    "1" == ue[p + 3]
                        ? ((re +=
                              " &nbsp; " +
                              getPlayerLink(he) +
                              " " +
                              ("1" == ue[p + 3] ? "<span class='online'>online</span>" : "") +
                              " (<a href='#' onclick='soundManager.playSound(SOUND.CLICK); network.send(\"cancel-friend<<$" +
                              he +
                              "\");' class='yellowfont'>remove</a>)<br />"),
                          me++)
                        : (le +=
                              " &nbsp; " +
                              getPlayerLink(he) +
                              " " +
                              ("1" == ue[p + 3] ? "<span class='online'>online</span>" : "") +
                              " (<a href='#' onclick='soundManager.playSound(SOUND.CLICK); network.send(\"cancel-friend<<$" +
                              he +
                              "\");' class='yellowfont'>remove</a>)<br />");
                } else
                    ue[p] == networkPlayerName
                        ? ((de += " &nbsp; " + getPlayerLink(ue[p + 1]) + " (<a href='#' onclick='soundManager.playSound(SOUND.CLICK); network.send(\"cancel-friend<<$" + ue[p + 1] + "\");' class='yellowfont'>cancel</a>)<br />"), ce++)
                        : ue[p + 1] == networkPlayerName &&
                          ((oe +=
                              " &nbsp; " +
                              getPlayerLink(ue[p]) +
                              " (<a href='#' onclick='soundManager.playSound(SOUND.CLICK); network.send(\"add-friend<<$" +
                              ue[p] +
                              "\");' class='yellowfont'>accept</a>) (<a href='#' onclick='soundManager.playSound(SOUND.CLICK); network.send(\"cancel-friend<<$" +
                              ue[p] +
                              "\");' class='yellowfont'>decline</a>)<br />"),
                          pe++);
            friendsTitle = "<h2> &nbsp; Friends (" + ge + " / 100)</h2>";
            var ye = "<h2> &nbsp; Online (" + me + ")</h2><br />",
                fe = "<h2> &nbsp; Offline (" + (ge - me) + ")</h2><br />";
            (O = ge > 0 ? O : "<h2> &nbsp; Friends</h2><p>You don't have any friends yet</p>"),
                (oe = oe.length > 0 ? "<br /><h2> &nbsp; Incoming requests (" + pe + ")</h2>" + oe : ""),
                (de = de.length > 0 ? "<br /><h2> &nbsp; Outgoing requests (" + ce + ")</h2>" + de : ""),
                ((T = document.createElement("p")).innerHTML =
                    "<br /> &nbsp; <input type='text' id='newFriendInput' /> &nbsp; <button onclick='sendFriendRequest(); soundManager.playSound(SOUND.CLICK);'>send new friend request</button><br /><br />"),
                (T.id = "addFriendP"),
                $("#friendsSubdiv").html(friendsTitle + oe + de + ye + re + fe + le),
                fadeIn($("#queriesWindow")),
                updateFriendsPendingIcon(pe);
        } else if (game_state == GAME.EDITOR) {
            if ("map-upload-init" == t) {
                M = game.export_();
                this.send("uploading-map<<$" + JSON.stringify(M) + "<<$" + getImageFromMap(game.export_(!0)) + "<<$" + getPlayerCountFromMap(M) + "<<$" + $("#mapDescriptionInput")[0].value);
            } else if ("personal-maps" == n[0]) {
                $("#mapWindowSubdiv").html("");
                for (p = 1; p < n.length; p++) {
                    var be;
                    ((T = document.createElement("p")).innerHTML = n[p] + " "),
                        ((be = document.createElement("button")).innerHTML = "X"),
                        (be.i_ = n[p]),
                        (be.title = "delete this map"),
                        (be.onclick = function () {
                            network.send("map-delete-request<<$" + this.i_), soundManager.playSound(SOUND.CLICK);
                        }),
                        T.appendChild(be),
                        $("#mapWindowSubdiv").append(T);
                }
            } else if ("map-has-been-deleted" == t) this.send("request-my-maps");
            else if ("custom-map-editor-file" == n[0] && n[1]) {
                M = JSON.parse(n[1]);
                (currentMapImg = n[2]),
                    soundManager.playSound(SOUND.CLICK),
                    uimanager.showLoadingScreen(M),
                    setTimeout(function () {
                        (game = new Game()),
                            game.loadMap(M, null, null, null, !0),
                            worker.postMessage({ what: "start-game", editorLoad: !0, map: M, players: null, network_game: network_game, game_state: game_state, networkPlayerName: networkPlayerName }),
                            ($("#mapNameInput")[0].value = M.name),
                            ($("#mapDescriptionInput")[0].value = M.description),
                            $("#mapOpenCheckbox").prop("checked", !!M.globalVars && M.globalVars.isOpen),
                            $("#useBlackFogCheckbox").prop("checked", !!M.globalVars && M.globalVars.useDarkMask),
                            ($("#maxSupplyInput")[0].value = !!M.globalVars && M.globalVars.maxSupply),
                            ($("#startGoldInput")[0].value = !!M.globalVars && M.globalVars.startGold),
                            ($("#mineDistInput")[0].value = !!M.globalVars && M.globalVars.mineDist);
                    }, 50);
            }
        } else if (game_state == GAME.LOBBY || game_state == GAME.ACCEPT_AGB)
            if ("start-game" == n[0] && n.length >= 4) {
                network.send("cancel-ladder"), fadeOut($("#ladderWindow"));
                var ve = JSON.parse(n[3]);
                (we = ve.players)[n[1]].isPlayingPlayer = !0;
                var ke = n[2];
                (network_game = !0),
                    (ladder_game = !1),
                    uimanager.showLoadingScreen(lobbyPlayerManager.map, we),
                    hideChat(),
                    setTimeout(function () {
                        (game = new Game()),
                            game.loadMap(lobbyPlayerManager.map, we, ke),
                            (game_state = GAME.PLAYING),
                            (mapData = ""),
                            worker.postMessage({ what: "start-game", map: lobbyPlayerManager.map, players: we, aiRandomizer: ke, network_game: network_game, game_state: game_state, networkPlayerName: networkPlayerName });
                        for (var e = 0; e < TICKS_DELAY - 1; e++) network.send(JSON.stringify({ tick: e, orders: [] }));
                    }, 50);
            } else if ("you-are-new-host" == t) lobbyPlayerManager.setHost(!0);
            else if (("game-joined" == n[0] || "game-created" == n[0]) && n.length >= 3)
                (this.game.id = parseInt(n[1])),
                    (this.game.name = escapeHtml(n[2])),
                    $("#lobbyGameChatTextArea").html(""),
                    "game-joined" == n[0] && (lobbyPlayerManager.init(!0), lobbyPlayerManager.refreshFromServer(JSON.parse(n[3]).players)),
                    setChatFocus(!1);
            else if ("custom-map-join-file" == n[0] && n[1]) {
                ((M = JSON.parse(n[1])).img = n[2]), (M.description = M.description.replace(/\n/g, "<br />")), (currentMapImg = M.img), lobbyPlayerManager.setMap(M);
            } else if ("custom-map-ladder-file" == n[0] && n.length >= 3) {
                ($("#ladderWindow")[0].style.display = "inline"), ((M = JSON.parse(n[1])).img = n[2]), (M.description = M.description.replace(/\n/g, "<br />")), (currentMapImg = M.img);
                var we;
                ve = JSON.parse(n[5]);
                (we = ve.players)[n[3]].isPlayingPlayer = !0;
                ke = n[4];
                (network_game = !0),
                    (ladder_game = !0),
                    $("#ladderWindow").html("<br /><br /><p style='font-size: 30px;'>Opponent found, starting game in<p><br /><br /><p id='ladderStartCounter'>10</p>"),
                    soundManager.playSound(SOUND.LADDER_START);
                var Le = setInterval(function () {
                    var e = $("#ladderStartCounter")[0].innerHTML;
                    e <= 1
                        ? (clearInterval(Le),
                          ($("#ladderWindow")[0].style.display = "none"),
                          uimanager.showLoadingScreen(M, we),
                          hideChat(),
                          network.send("load-ladder-map"),
                          setTimeout(function () {
                              (game = new Game()),
                                  game.loadMap(M, we, ke),
                                  (game_state = GAME.PLAYING),
                                  (mapData = ""),
                                  worker.postMessage({ what: "start-game", map: M, players: we, aiRandomizer: ke, network_game: network_game, game_state: game_state, networkPlayerName: networkPlayerName });
                              for (var e = 0; e < TICKS_DELAY - 1; e++) network.send(JSON.stringify({ tick: e, orders: [] }));
                          }, 50))
                        : ($("#ladderStartCounter")[0].innerHTML = e - 1);
                }, 1e3);
            } else if ("games-list" != n[0] || this.game.id) {
                if ("you've-been-kicked" == t) (this.game.id = 0), (this.game.name = ""), (game_state = GAME.LOBBY), keyManager.resetCommand(), setChatFocus(!0);
                else if ("player-list" == n[0]) {
                    this.players = {};
                    for (p = 1; p < n.length; p++) {
                        var _e = n[p].split("<");
                        Q = escapeHtml(_e[0]);
                        this.players[Q] = { name: Q, location: _e[1], authLevel: _e[2], clan: _e[3], premium: "1" == _e[4] };
                    }
                    this.refreshPlayerWindow();
                } else if ("player-location-update" == n[0] && n.length >= 3) {
                    var Me = escapeHtml(n[1]);
                    const e = parseInt(n[2]);
                    let a = resolveLocationString(e);
                    $("#playerLocation_" + Me).html(" " + a), this.players[Me] && (this.players[Me].location = n[2]);
                } else if ("player-premium-update" == n[0] && n.length >= 3) {
                    Me = escapeHtml(n[1]);
                    this.players[Me] && (this.players[Me].premium = "1" == n[2]),
                        (!this.players[Me] || this.players[Me].authLevel < AUTH_LEVEL.MOD) &&
                            $("#playerList_" + Me)
                                .children(".playerNameInList")
                                .attr("class", "playerNameInList playerLinkPremium");
                } else if ("player-clan-update" == n[0] && n.length >= 3) {
                    Me = escapeHtml(n[1]);
                    $("#playerLocationClan_" + Me).html(n[2] && n[2].length > 0 ? "[<a href='#' onclick='getClanInfo(\"" + n[2] + "\");' class='clanLink'>" + n[2] + "</a>] " : ""), this.players[Me] && (this.players[Me].clan = n[2]);
                } else if ("clans-list" == n[0]) {
                    for (d = "<table><tr><td class='clanListTitleLine'>Tag</td><td class='clanListTitleLine'>Name</td><td class='clanListTitleLine'>Members</td></tr><tr><td></td><td></td><td></td></tr>", p = 1; p < n.length - 1; p += 3)
                        d += "<tr><td>[<a href='#' onclick='getClanInfo(\"" + n[p] + "\");' class='clanLink'>" + n[p] + "</a>]</td><td>" + n[p + 1] + "</td><td>" + n[p + 2] + "</td></tr>";
                    (d += "</table>"), uimanager.playerInfoWindow.setTitle("<font style='color: rgb(255, 248, 57);'>Clans</font>"), $("#addScrollableSubDivTextArea").html(d), fadeIn($("#playerInfoWindow"));
                } else if ("bing-msg" == n[0] && n.length >= 2) bingMsg(n[1]);
                else if ("infostring" == n[0] && n.length >= 2) {
                    ve = JSON.parse(n[1]);
                    var Te = getPlayerNameArrayFromPlayerSettingsArrayObject(lobbyPlayerManager.getPlayerSettingsArrayObject());
                    lobbyPlayerManager.refreshFromServer(ve.players);
                    var Ie = getPlayerNameArrayFromPlayerSettingsArrayObject(lobbyPlayerManager.getPlayerSettingsArrayObject());
                    if (Ie.length > Te.length)
                        for (p = 0; p < Ie.length; p++)
                            -1 == Te.indexOf(Ie[p]) &&
                                (($("#lobbyGameChatTextArea")[0].innerHTML += "<p>Server (" + getFormattedTime() + "): Player " + Ie[p] + " joined</p>"),
                                ($("#lobbyGameChatTextArea")[0].scrollTop = $("#lobbyGameChatTextArea")[0].scrollHeight));
                    else if (Ie.length < Te.length)
                        for (p = 0; p < Te.length; p++)
                            -1 == Ie.indexOf(Te[p]) &&
                                (($("#lobbyGameChatTextArea")[0].innerHTML += "<p>Server (" + getFormattedTime() + "): Player " + Te[p] + " left</p>"),
                                ($("#lobbyGameChatTextArea")[0].scrollTop = $("#lobbyGameChatTextArea")[0].scrollHeight));
                } else if ("player-left" == n[0] && n.length >= 2) {
                    Me = escapeHtml(n[1]);
                    delete this.players[Me];
                    var Pe = $("#playerList_" + Me)[0];
                    Pe && Pe.parentNode.removeChild(Pe), ($("#playersWindow")[0].getElementsByTagName("h2")[0].innerHTML = "&raquo; Players (" + _.size(this.players) + ")");
                } else if ("player-joined" == n[0] && n.length >= 3) {
                    Me = escapeHtml(n[1]);
                    if (this.players[Me]) return;
                    (this.players[Me] = { name: Me, location: 0, authLevel: n[2], clan: n[3], premium: "true" == n[4] }),
                        $("#playersWindowTextArea").append(this.createPlayerNode(this.players[Me])),
                        this.refreshPlayerWindow(),
                        ($("#playersWindow")[0].getElementsByTagName("h2")[0].innerHTML = "&raquo; Players (" + _.size(this.players) + ")");
                } else if ("lcg-battle" == n[0]) littlechatgame(JSON.parse(n[1]));
                else if ("lcg-rank" == n[0]) {
                    T = document.createElement("p");
                    ((Ee = document.createElement("span")).className = "time"),
                        (Ee.innerHTML = getFormattedTime() + " &nbsp;"),
                        ((Ae = document.createElement("span")).innerHTML = "Server: Littlechatgame record for " + n[1] + ": " + n[2] + " wins / " + n[3] + " losses. Rank: " + getRankCode(n[4]) + " &nbsp;(Global ranking #" + n[5] + ")"),
                        T.appendChild(Ee),
                        T.appendChild(Ae),
                        addToChatWindow(T);
                } else if ("lcg-top" == n[0]) {
                    var Ee, Ae;
                    T = document.createElement("p");
                    ((Ee = document.createElement("span")).className = "time"), (Ee.innerHTML = getFormattedTime() + " &nbsp;"), ((Ae = document.createElement("span")).innerHTML = "Server: Littlechatgame top ranked players:");
                    for (p = 1; p < n.length; p += 2) Ae.innerHTML += "<br />" + Math.ceil(p / 2) + ". " + n[p] + " (" + getRankCode(n[p + 1]) + ")";
                    T.appendChild(Ee), T.appendChild(Ae), addToChatWindow(T);
                } else if ("chat" == n[0]) {
                    var Se = !0;
                    0 === n[3].indexOf("/") && ((Se = !1), "/ping" == n[3] && n[2] == networkPlayerName && ((Se = !0), (n[3] = "ping: " + (Date.now() - timeOfLastPingSent) + " ms"))),
                        Se && !ignores.contains(n[2].toLowerCase()) && addChatMsg(n[2], n[3], n[1]);
                }
            } else {
                $("#gamesWindowTextArea").html("");
                for (var p = 1; p < n.length; p++) {
                    var Ce = n[p].split("<"),
                        Ne = document.createElement("p");
                    (Ne.onmouseover = function () {
                        (this.style.backgroundColor = "rgba(255, 255, 255, 0.4)"), soundManager.playSound(SOUND.ZIP, !1, 0.3);
                    }),
                        (Ne.onmouseout = function () {
                            (this.style.backgroundColor = "rgba(0, 0, 0, 0)"), soundManager.playSound(SOUND.ZIP, !1, 0.3);
                        });
                    const e = " [" + Ce[2] + "/" + Ce[3] + "] ",
                        a = "1" == Ce[4] ? "<span class='running'>running</span> " : "",
                        t = "1" == Ce[8] ? "<img src='imgs/lock.png' />" : "",
                        s = "1" == Ce[9] ? "<span class='mapListMod'>custom map</span> " : "";
                    (Ne.innerHTML = escapeHtml(Ce[1]) + e + s + a + t),
                        (Ne.gameID_ = parseInt(Ce[0])),
                        (Ne.pw_ = "1" == Ce[8]),
                        (Ne.innerHTML = escapeHtml(Ce[1]) + " [" + Ce[2] + "/" + Ce[3] + "] " + ("1" == Ce[4] ? "<span class='running'>running</span> " : "") + ("1" == Ce[8] ? "<img src='imgs/lock.png' />" : "")),
                        (Ne.title = "Host: " + Ce[6] + " | Game Version: " + Ce[5] + " | Map: " + Ce[7]),
                        (Ne.onclick =
                            "1" == Ce[8]
                                ? function () {
                                      var e = document.createElement("button");
                                      (e.id = "game_pw_button"),
                                          (e.gameID_ = this.gameID_),
                                          (e.innerHTML = "join"),
                                          (e.onclick = function () {
                                              joinPWGame(this.gameID_);
                                          }),
                                          displayInfoMsg("This game is password protected. Enter password:<br /><input type='text' id='game_pw' /><br />"),
                                          $("#infoWindowTextArea").append(e),
                                          soundManager.playSound(SOUND.CLICK);
                                  }
                                : function () {
                                      network.send("join-game<<$" + this.gameID_ + "<<$" + GAME_VERSION), soundManager.playSound(SOUND.CLICK);
                                  }),
                        $("#gamesWindowTextArea").append(Ne);
                }
            }
        else if (game_state == GAME.PLAYING && network_game)
            if ("order-missing" == n[0]) {
                var Oe = parseInt(n[1]);
                network.send(JSON.stringify({ tick: Oe, orders: [] }));
            } else if ("chat" == n[0]) {
                if (!ignores.contains(n[2].toLowerCase())) {
                    var xe = n[2] + ": " + n[3];
                    game.addChatMsgToLog(xe), game.chat_muted || interface_.chatMsg(xe);
                }
            } else if ("chat-server" == n[0]) soundManager.playSound(SOUND.POSITIVE), interface_.addMessage(n[1], "yellow", imgs.attentionmarkYellow);
            else if ("ping" == n[0]) {
                this.pings.push(Date.now() - timeOfLastPingSent), this.pings.length > 8 && this.pings.splice(0, 1);
                var De = Math.ceil(Math.max.apply(null, this.pings) / TICK_TIME) + this.EXTRA_DELAY + (PLAYING_PLAYER && PLAYING_PLAYER.controller == CONTROLLER.SPECTATOR ? 2 : 0);
                De > TICKS_DELAY ? (game.increaseDelayOnNextTick = !0) : De < TICKS_DELAY && (game.reduceDelayOnNextTick = !0);
            } else if ("waiting-for" == n[0]) interface_.addMessage("Waiting for player " + n[1], "yellow", imgs.attentionmarkYellow);
            else if ("youve-been-kicked" == t) (this.game.id = 0), (this.game.name = ""), (game_state = GAME.LOBBY), setChatFocus(!0), keyManager.resetCommand();
            else if ("game-paused" == n[0])
                (game_paused = !0),
                    interface_.addMessage("Game paused by " + n[1] + " (" + n[2] + " pauses left)", "yellow", imgs.attentionmarkYellow),
                    soundManager.playSound(SOUND.POSITIVE),
                    worker.postMessage({ what: "setPause", val: game_paused });
            else if ("game-unpaused" == n[0])
                (game_paused = !1), interface_.addMessage("Game unpaused by " + n[1], "yellow", imgs.attentionmarkYellow), soundManager.playSound(SOUND.POSITIVE), worker.postMessage({ what: "setPause", val: game_paused });
            else if ("map-ping" == n[0]) ignores.contains(n[3].toLowerCase()) || (game.minimap.mapPings.push({ field: new Field(parseInt(n[1]), parseInt(n[2])), time: Date.now() }), soundManager.playSound(SOUND.BING2));
            else if ("dummy" != n[0])
                try {
                    var Ge = JSON.parse(t);
                    for (let e in Ge.orders) Ge.orders[e][0] = getArchonPlayerNr(Ge.orders[e][0]);
                    worker.postMessage({ what: "orders", msg: JSON.stringify(Ge) }), (incomingOrders[Ge.tick] = Ge.orders), Ge.playersLeft && (playerLefts[Ge.tick] = Ge.playersLeft);
                } catch (e) {
                    console.log("main thread error parsing orders msg");
                }
    }),
    (document.onkeydown = function (e) {
        e.repeat || (keyManager.commandCardWhenPressStart = interface_.commandCard);
        var a = keyManager.getKeyCode(e);
        if (
            (a == KEY.F8 && toggleFullscreen(document.documentElement),
            document.activeElement &&
                (("INPUT" == document.activeElement.nodeName && "text" == document.activeElement.type) || "TEXTAREA" == document.activeElement.nodeName) &&
                "hidden" != document.activeElement.style.visibility &&
                null !== document.activeElement.offsetParent)
        )
            return !0;
        if ((uimanager.onKey(a), game_state != GAME.PLAYING && game_state != GAME.EDITOR)) return !0;
        if (
            ((keyManager.keys[a] = !0),
            (game_state != GAME.PLAYING && game_state != GAME.EDITOR) || a != otherKeys[0] || zoom(120),
            (game_state != GAME.PLAYING && game_state != GAME.EDITOR) || a != otherKeys[1] || zoom(-120),
            game_state == GAME.EDITOR)
        )
            return editor.keyPressed(a), !1;
        if (game_state == GAME.PLAYING && network_game && a == otherKeys[2]) {
            var t = null;
            keyManager.x < MINIMAP_WIDTH && keyManager.y > HEIGHT - MINIMAP_HEIGHT ? (t = game.minimap.getFieldFromClick(keyManager.x, keyManager.y)) : keyManager.y < HEIGHT - INTERFACE_HEIGHT && (t = game.getFieldFromPos()),
                t && network.send("map-ping<<$" + t.x + "<<$" + t.y);
        }
        if (game_state == GAME.PLAYING && a == KEY.ENTER && !uimanager.ingameInput.active) {
            uimanager.ingameInput.active = !0;
            for (var n = !1, s = 1; s < game.players.length; s++)
                game.players[s] && game.players[s] != PLAYING_PLAYER && !game.players[s].isEnemyOfPlayer(PLAYING_PLAYER) && game.players[s].controller != CONTROLLER.SPECTATOR && game.players[s].isAlive && (n = !0);
            PLAYING_PLAYER.controller == CONTROLLER.SPECTATOR && (n = !1), isArchon() && (n = !0);
            var i = keyManager.keys[KEY.SHIFT] ? !n : n;
            $("#ingameChatDropdown")[0].selectedIndex = i ? 1 : 0;
        }
        (interface_ && keyManager.commandCardWhenPressStart == interface_.commandCard && interface_.keyPressed(a), a == KEY.PAUSE && game_state == GAME.PLAYING && pauseGame(), game_state == GAME.PLAYING && cameraHotkeys[a] >= 1) &&
            (r = cameraHotkeys[a]) < keyManager.cameraLocations.length &&
            (keyManager.keys[KEY.STRG] || keyManager.keys[KEY.SHIFT]
                ? (keyManager.cameraLocations[r] = new Field((game.cameraX + WIDTH / 2) / FIELD_SIZE, (game.cameraY + HEIGHT / 2) / FIELD_SIZE, !0))
                : keyManager.cameraLocations[r] && ((game.cameraX = keyManager.cameraLocations[r].px * FIELD_SIZE - WIDTH / 2), (game.cameraY = keyManager.cameraLocations[r].py * FIELD_SIZE - HEIGHT / 2)));
        if (game_state == GAME.PLAYING && ctrlGroupKeys[a] >= 1) {
            var r = ctrlGroupKeys[a];
            if (keyManager.keys[KEY.STRG] && game.humanUnitsSelected()) keyManager.controlGroups[r] = game.selectedUnits;
            else if (keyManager.keys[KEY.SHIFT] && game.humanUnitsSelected())
                for (s = 0; s < game.selectedUnits.length; s++) {
                    for (var l = !1, o = 0; o < keyManager.controlGroups[r].length; o++) game.selectedUnits[s] == keyManager.controlGroups[r][o] && (l = !0);
                    l ||
                        game.selectedUnits[s].owner != PLAYING_PLAYER ||
                        (0 != keyManager.controlGroups[r].length && keyManager.controlGroups[r][0].type.isBuilding != game.selectedUnits[s].type.isBuilding) ||
                        keyManager.controlGroups[r].push(game.selectedUnits[s]);
                }
            else if (keyManager.controlGroups[r].length > 0) {
                var d = game.selectedUnits[0] ? game.selectedUnits[0].type : null;
                (game.selectedUnits = keyManager.controlGroups[r].slice()), (interface_.unitsTab = 0), keyManager.resetCommand();
                for (s = 0; s < game.selectedUnits.length; s++) game.selectedUnits[s].isActive || (game.selectedUnits.splice(s, 1), s--);
                if (((interface_.commandCard = 0), (interface_.unitTypeWithCurrentTabPrio = null), keyManager.lastKeyPressed == a && keyManager.timeOfLastKeyPressed + 350 > timestamp && game.selectedUnits.length > 0)) {
                    var g = game.getCenterOfUnits(game.selectedUnits),
                        m = null,
                        p = 9999;
                    for (s = 0; s < game.selectedUnits.length; s++) {
                        var c = g.distanceTo2(game.selectedUnits[s].pos);
                        c < p && ((p = c), (m = game.selectedUnits[s]));
                    }
                    (game.cameraX = m.pos.px * FIELD_SIZE - WIDTH / 2), (game.cameraY = m.pos.py * FIELD_SIZE - HEIGHT / 2);
                }
                keyManager.changeUnitSelection(d);
            }
        }
        return (keyManager.timeOfLastKeyPressed = timestamp), (keyManager.lastKeyPressed = a), !1;
    }),
    (Interface.prototype.chatMsg = function (e, a) {
        for (var t = e.split(": "), n = "white", s = t[0].indexOf(" [") >= 0 ? t[0].split(" [")[0] : t[0], i = 0; i < game.players.length; i++)
            game.players[i] && game.players[i].name == s && game.players[i].controller != CONTROLLER.SPECTATOR && playerColors[game.players[i].number - 1] && (n = 5 == game.players[i].number ? "gray" : game.players[i].getColor());
        isArchon() && s in game.archonPlayers && ((primaryNr = game.archonPlayers[s]), (n = game.players[primaryNr].getColor())),
            "showfps" == t[1] ? (show_fps = !show_fps) : "showunitdetails" != t[1] || network_game || (show_unit_details = !show_unit_details),
            this.addMessage(e, n, null, "black" == n),
            a || soundManager.playSound(SOUND.POSITIVE);
    }),
    displayInfoMsg("Successfully loaded archon mod");
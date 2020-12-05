var buildTitle, buildOrder;

var buildOrder=[[0,"You did not load up a build order."]]
,myLayer=document.createElement("div");myLayer.id="buildOrderDisplay",
myLayer.style.display = "none",
myLayer.style.position="absolute",myLayer.style.left="10px",
myLayer.style.top="200px",
myLayer.style.width="200px",
myLayer.style.padding="10px",
myLayer.style.fontSize="20px",
myLayer.style.color="white",
myLayer.style.pointerEvents="none",
myLayer.style.background="rgba(0,0,0,0.5)",
myLayer.innerHTML="Build Order Tool <br><br> By: Silverboss",
document.body.appendChild(myLayer);

var flash;

var builds = [
      {
            "name": "1 den Invincible",
            "id" : 0,
            "length": 12,
            "howto": [
                  [0,0, "@start of game: train Worker<br> Send workers to mine<br>Rally castle to gold mine<br>Set up hotkeys"],
                  [0,10,"Remember to keep training Workers one at a time!"],
                  [0,17, "@ 100 gold & 9 supply: build a House"],
                  [0,35,"@ house completion: build a Wolf Den"],
                  [1,12,"@ den completion: train a Wolf"],
                  [1,36,"Keep training wolves and workers 1 at a time"],
                  [1,42,"Send the first wolf to scout"],
                  [1,60,"@18 supply: Cut worker and wolf production"],
                  [2,18,"@350 gold: build a Castle"],
                  [2,25,"@50 gold: train a Worker"],
                  [2,35,"@100 gold: build a House.<br>Resume constant worker production."],
                  [2,55,"Win the game."]
            ],
      },
      
      {
            "name": "2 den NorM",
            "id" : 1,
            "length": 24,
            "howto": [
                  [0,0, "@start of game: train Worker<br> Send workers to mine<br>Rally castle to gold mine<br>Set up hotkeys"],
                  [0,10,"Remember to keep training Workers one at a time!"],
                  [0,20, "8/10 House 22 SECOND MARK!! (MAKE HOUSE CLOSE TO GOLD MINE!!)"],
                  [0,30,"Dont Spend Gold On Worker!! SPEND GOLD ON <b>DEN</b>!!"],
                  [0,38,"8/10 Den (50 second Mark!!) SEND WORKER AT 40 SECOND MARK!! "],
                  [0,50,"8/10 Den (1:00 Mark!!) SEND AT 50 SECOND MARK!!"],
                  [1,01,"8/10 build a <b>House</b>"],
                  [1,25,"1ST WOLF STARTS AT 1:30 !!"],
                  [1,35, "Mass Produce Wolf Until Supply Blocked At 30!!"],
                  [1,50,"(The Objective Of This Build Is To Apply Pressure, Easy Wins Can Come Of It, The DownSide Is You Are Behind If You Don't Apply The Right Ammount Of Pressure!!)"],
                  [2,50, "SEND WORKER TO NATURAL EXPASION!! (3:25)!!"],
                  [3,20, "30/30 Castle (STARTS AT 3:42)"],
                  [4,10, "(SEND 3 WORKERS TO GOLDMINE AT 4:28!!)"],
                  [4,50, "30/30 build a House"],
                  [5,01, "Constant Worker Production"],
                  [5,10, "(Units Or 3rd Base!!)"],
                  [5,20, "ONCE YOU GET HERE IT DEPENDS ON HOW THE GAME GOES, AND WHAT TYPE OF UNITS YOUR OPPONET IS MAKING!! "],
                  [5,35, "IF VS MECH - KEEP HIM ON 2 BASES WHILE YOU MACRO UP AND EXPAND, WATCH OUT FOR CATA DROPS AND MAKE YOUR "],
                  [5,50, "OWN DROPS!! HARASSING MECH IS KEY TO VICTORY!!"],
                  [6,01, "IF VS RAX - KEEP RAX PLAYER ON 2 BASE, KEEP MAP PRESSURE, YOUR UNITS ARE MUCH FASTER AND HE SHOULD ALWAYS FEAR A BACKSTAB IF HE MOVES OUT!"],
                  [6,20, "EXPAND YOURSELF AND MAKE UPGRADES AND DENS!! MAKE SURE YOU KEEP POKING AT HIS ARMY AND IF YOU SEE AN OPPORTUNITY TO SURROUND TAKE IT!!"],
                  [6,40, "IF VS DEN - THE BETTER MICRO WINS, YOU COULD GET LUCKY WITH YOUR OPPONET FAST EXPANDING AS WELL"],
                  [7,01, "MOST PART WOLF VS WOLF IS MICRO INTENSIVE!! ONLY EXPAND IF YOUR OPPONET EXPANDED!!"],
                  [7,30, "WIN THE GAME!!"]
            ],
      },
];

var trainButton = document.createElement('button');
trainButton.id = "trainButton";
trainButton.style.width = "240px";
trainButton.style.height = "32px";
trainButton.style.position="absolute";
trainButton.style.top="280px";
trainButton.style.marginLeft = "22px";
trainButton.innerHTML = 'Train';
$('#skirmishWindow').append(trainButton);

var html = '';
builds.map((build) => {
      console.log(build.name);
      html += "<button onclick = 'getBuild(" + build.id + ")'>" + build.name + "</button>";
      console.log(html);
      return html;
});

trainButton.onclick = function() {
      displayInfoMsg2("<h1>Build Orders</h1>" + html);
};

buildTitle = builds[0].name;
buildOrder = builds[0].howto;

function getBuild(id) {
      console.log(id);
      buildTitle = builds[id].name;
      buildOrder = builds[id].howto;
      ticksCounter=0;
      buildOrder.sort();
      document.getElementById("buildOrderDisplay").innerHTML = buildTitle;
      console.log("Loaded build: " + buildTitle);
      flash=0;window.setInterval(function(){buildOrder[0]&&ticksCounter/20>buildOrder[0][0]*60+buildOrder[0][1]&&(flash=2, buildOrder.push(buildOrder[0]), /*console.log(buildOrder[0]), buildOrder.push([buildOrder.shift()[0], buildOrder.shift()[1], buildOrder.shift()[2]]),*/
      document.getElementById("buildOrderDisplay").innerHTML="<span>"+buildOrder.shift()[2]+"</span>",
      buildOrder[0]&&(document.getElementById("buildOrderDisplay").innerHTML+="<br><span style='color: grey'>"+buildOrder[0][2]+"</span>")),
      flash>0?(flash--,document.getElementById("buildOrderDisplay").style.background="rgba(0,100,0,0.5)"):document.getElementById("buildOrderDisplay").style.background="rgba(0,0,0,0.5)"},500);
      console.log("Build order tool loaded.");
}

$('#startButton')[0].onclick = function(){ 
      startGame(false); 
      if(game_state === 4) {
            document.getElementById("buildOrderDisplay").style.display = "block";
            buildTitle = "@start of game: train Worker<br> Send workers to mine<br>Rally castle to gold mine<br>Set up hotkeys";
      }
};

setInterval(() => {
      if(game_state == GAME.LOBBY) {
      	document.getElementById("buildOrderDisplay").style.display = 'none';
            document.getElementById("buildOrderDisplay").innerHTML = buildTitle;
      }
}, 1000);

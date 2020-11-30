var buildTitle, buildOrder;

var buildOrder=[[0,"You did not load up a build order."]]
,myLayer=document.createElement("div");myLayer.id="buildOrderDisplay",
myLayer.style.position="absolute",myLayer.style.left="10px",
myLayer.style.top="200px",
myLayer.style.width="200px",
myLayer.style.padding="10px",
myLayer.style.fontSize="20px",
myLayer.style.color="white",
myLayer.style.pointerEvents="none",
myLayer.style.background="rgba(0,0,0,0.5)",
myLayer.innerHTML="Build Order Tool <br><br> By: Invincible",
document.body.appendChild(myLayer);
var flash=0;window.setInterval(function(){buildOrder[0]&&ticksCounter/20>buildOrder[0][0]*60+buildOrder[0][1]&&(flash=2,
document.getElementById("buildOrderDisplay").innerHTML="<span>"+buildOrder.shift()[2]+"</span>",
buildOrder[0]&&(document.getElementById("buildOrderDisplay").innerHTML+="<br><span style='color: grey'>"+buildOrder[0][2]+"</span>")),
flash>0?(flash--,document.getElementById("buildOrderDisplay").style.background="rgba(0,100,0,0.5)"):document.getElementById("buildOrderDisplay").style.background="rgba(0,0,0,0.5)"},500);
console.log("Build order tool loaded.");

buttonOrder = document.createElement("div");
buttonOrder.id="buildOrderDisplay",
buttonOrder.style.position="absolute",
buttonOrder.style.top="0px",
buttonOrder.style.width="500px",
buttonOrder.style.left = "500px",
buttonOrder.style.padding="10px",
buttonOrder.style.fontSize="20px",
buttonOrder.style.color="white",
buttonOrder.style.background="rgba(0,0,0,0.5)",
buttonOrder.innerHTML="By: Silverboss",
document.body.appendChild(buttonOrder);

buttonOrder.innerHTML = "<button id='buildOrdersBtn'>Build Orders</button>";
var buildOrdersBtn = document.getElementById('buildOrdersBtn');

var builds = [
      {
            "name": "1 den expand",
            "id" : 0,
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
            "name": "2 den rush",
            "id" : 1,
            "howto": [
                  [0,0, "@start of game: train Worker<br> Send workers to mine<br>Rally castle to gold mine<br>Set up hotkeys"],
                  [0,10,"Remember to keep training Workers one at a time!"],
                  [0,17, "@ 100 gold & 9 supply: build a House"],
                  [0,35,"@ house completion: build 2 Wolf Den"],
                  [1,12,"@ den completion: train 2 Wolves"],
                  [1,36,"Keep training wolves and micro"],
                  [1,40,"Win the game."]
            ],
      },
      
      {
            "name": "Basic Mech",
            "id" : 2,
            "howto": [
                  [0,0, "@start of game: train Worker<br> Send workers to mine<br>Rally castle to gold mine<br>Set up hotkeys"],
                  [0,10,"Remember to keep training Workers one at a time!"],
                  [0,17, "@ 100 gold & 9 supply: build a House"],
                  [0,35,"house completion: build a <b>Workshop</b>"],
                  [1,12,"@ workshop completion: train a gatling gun"],
                  [1,36,"build a <b>Castle</b>"],
                  [1,40,"@ keep training gatling gun"],
                  [2,18,"build a <b>Mill</b>"],
                  [2,30,"Mill completion: make a <b>Gyro</b>"],
                  [2,40,"@ And scout"],
                  [3,10,"Win the game :)"],
            ],
      },
      
      {
            "name": "Basic Rax",
            "id" : 3,
            "howto": [
                  [0,0, "@start of game: train Worker<br> Send workers to mine<br>Rally castle to gold mine<br>Set up hotkeys"],
                  [0,10,"Remember to keep training Workers one at a time!"],
                  [0,17, "@ 100 gold & 9 supply: build a House"],
                  [0,35,"house completion: build a <b>Barracks</b>"],
                  [1,12,"@ rax completion: train a raider"],
                  [1,36,"then scout with that raider and build a <b>Castle</b>"],
                  [1,40,"@ keep training archer"],
                  [2,18,"now build a <b>Barracks</b>"],
                  [3,30,"you can build a <b>Castle</b> if you want"],
                  [3,40,"Win the game :)"],
            ],
      },
];

var html = '';
builds.map((build) => {
      console.log(build.name);
      html += "<button onclick = 'getBuild(" + build.id + ")'>" + build.name + "</button>";
      console.log(html);
      return html;
});

buildOrdersBtn.onclick = function() {
      displayInfoMsg2(html);
};

function getBuild(id) {
      console.log(id);
      buildTitle = builds[id].name;
      buildOrder = builds[id].howto;
      ticksCounter=0;
      document.getElementById("buildOrderDisplay").innerHTML = buildTitle;
      console.log("Loaded build: " + buildTitle);
}

displayInfoMsg('This tool made by Silverboss');

// var buildsOrders = builds.reduce(function(howto, topic) {
//       return howto.concat(topic.howto);
// }, []);

// console.log(buildsOrders);

const displayPest = document.createElement('button');
const textPest = document.createTextNode("Ignore Pest");
displayPest.appendChild(textPest);

const ignoreAllPests = document.createElement('button');
const textAllPests = document.createTextNode("No Pests");
ignoreAllPests.appendChild(textAllPests);

document.getElementById('playerGoldWrap').appendChild(displayPest);
document.getElementById('playerGoldWrap').appendChild(ignoreAllPests);

var btnClicked = false;

ignoreAllPests.onclick = function() {
      displayInfoMsg2("<h1>If you click this button, all pests will be ignored, you will not see any pest chat  you.</h1>" + '<button id="noPestsBtn">Turn On</button><br><br><button id="yesPestsBtn">Turn Off</button>');
      let noPestsBtn = document.getElementById('noPestsBtn');
      
      noPestsBtn.onclick = function() {
            console.log('Turn On !!!');
            btnClicked = true;
            soundManager.playSound(SOUND.CLICK);
      };
      yesPestsBtn.onclick = function() {
            console.log('Turn Off !!!');
            btnClicked = false;
            soundManager.playSound(SOUND.CLICK);
      };
};

displayPest.onclick = function() {
      soundManager.playSound(SOUND.CLICK);
      displayInfoMsg('<input type="text" id="pestInput" value="guest_"><br><br><button id="pestBtn">Ignore This Pest</button><br><br><button id="ignoreList">Pests List</button>');
      
      let pestBtn = document.getElementById('pestBtn');
      let ignoreList = document.getElementById('ignoreList');
      
      pestBtn.onclick = function() {
            let pestInput = document.getElementById('pestInput').value;
            network.send("ignore<<$" + pestInput);
            soundManager.playSound(SOUND.CLICK);
            console.log(pestInput + " this fucker ignored");
      };
      
      ignoreList.onclick = function() {
            soundManager.playSound(SOUND.CLICK);
            var htmlPest = '<h1>Pests List</h1></br>';
            ignores.map((pest) => {
                htmlPest += pest + "<button id='inlineUnignoreButton' title='unignore this player' onclick='pressUnignoreButton(\"" + pest + "\");'>unignore</button>" + "<br><br>";
            });
            displayInfoMsg2(htmlPest);
      };
};



//NO PEST BUTTON

function Query(name) {
      if(btnClicked === true) {
                      this.name = name;
      
           if(this.name.search('guest') >= 0) {
              console.log('yes');
              network.send("ignore<<$" + this.name);
           }else {
      
          this.domElement = document.createElement("div");
      	this.domElement.className = "query ingameWindow";
      	this.domElement.style.left = Math.floor(Math.random() * 100 + 100) + "px";
      	this.domElement.style.top = Math.floor(Math.random() * 100 + 100) + "px";
      	document.body.appendChild(this.domElement);
      	
      	// get this element on top (higher z index, while lowering all the others queries')
      	this.domElement.onclick = function(){
      		for(var i = 0; i < uimanager.queries.length; i++)
      			uimanager.queries[i].domElement.style.zIndex = "101";
      		
      		this.style.zIndex = "102";
      	}
      	this.domElement.onclick();
      	
      	// make querys draggable (with jquery ui)
      	$(".query").draggable({
      		drag: onDrag,
      		cancel: "p, input"
      	});
      	
      	// make sub div text area
      	this.textArea = document.createElement('div');
      	this.textArea.className = "textContainer queryTextContainer";
      	this.domElement.appendChild(this.textArea);
      	
      	// add title
      	var title = document.createElement("h2");
      	title.innerHTML = "&raquo; Chat: " + name;
      	title.className = "windowTitle";
      	this.domElement.appendChild(title);
      	
      	// create close button
      	var closeButton = document.createElement('button');
      	closeButton.className = "closeButton";
      	closeButton.innerHTML = "X";
      	closeButton.parent_ = this;
      	closeButton.onclick = function(){
      		soundManager.playSound(SOUND.CLICK);
      		this.parent_.kill();
      	};
      	// add it to the window
      	this.domElement.appendChild(closeButton);
      	
      	// create minimize button
      	var minimizeButton = document.createElement("button");
      	minimizeButton.className = "minimizeButton";
      	minimizeButton.innerHTML = "_";
      	minimizeButton.parent_ = this;
      	minimizeButton.onclick = function(){
      		soundManager.playSound(SOUND.CLICK);
      		
      		if(this.parent_.i.style.display != "none")
      		{
      			this.parent_.domElement.style.height = "70px";
      			this.parent_.i.style.display = "none";
      			this.innerHTML = "&#9633;";
      		}
      		else
      		{
      			this.parent_.domElement.style.height = "400px";
      			this.parent_.i.style.display = "inline";
      			this.innerHTML = "_";
      			
      			if(parseInt(this.parent_.domElement.style.top) + 400 > HEIGHT - 10)
      				this.parent_.domElement.style.top = (HEIGHT - 10 - 400) + "px";
      		}
      	}
      	// add it to the window
      	this.domElement.appendChild(minimizeButton);
      	
      	// make it close on escape
      	this.domElement.parent_ = this;
      	this.domElement.onkeydown = function(e){
      		if(keyManager.getKeyCode(e) == KEY.ESC)
      		{
      			this.parent_.kill();
      			soundManager.playSound(SOUND.SWITCH);
      		}
      	};
      	
      	// input
      	this.i = document.createElement("input");
      	this.i.type = "text";
      	this.i.className = "queryInput";
      	this.i.maxLength = 250;
      	this.i.name_ = this.name;
      	this.i.onkeydown = function(e){
      		if(keyManager.getKeyCode(e) == KEY.ENTER && this.value.length > 0)
      		{
      			if(this.value == "/ping")
      				timeOfLastPingSent = Date.now();
      			
      			network.send("query<<$" + this.name_ + "<<$" + this.value);
      			this.value = "";
      		}
      	}
      	this.domElement.appendChild(this.i);
      	
      	soundManager.playSound(SOUND.CLICK);
      	
      	// set focus to input element
      	this.i.focus();
      	
      	
      	// add link to queries div
      	var b = document.createElement("button");
      	b.innerHTML = this.name;
      	b.link_ = this;
      	b.id = "queryLink_" + this.name;
      	b.className = "queryButtonLink";
      	b.onclick = function(){
      		this.link_.activate();
      		$("#queryLink_" + this.link_.name).removeClass("borderRed");
      		soundManager.playSound(SOUND.CLICK);
      	};
      	$('#queriesWindowSubDiv').append(b);
      	
      	// remove noMessagesP
      	if($('#noMessagesP'))
      		$('#noMessagesP').remove();
      	
      	if(iAmMod || iAmAdmin)
      	{
      		var button = uimanager.createButton(null, "ban", function(){
      			reallyBan(name);
      		});
      		this.domElement.appendChild(button);
      		button.className = "inlineBanButton2";
      	}
      	
      	if(open_queries == OPEN_QUERIES.NEVER || (open_queries == OPEN_QUERIES.NOT_INGAME && game_state == GAME.PLAYING))
      		this.domElement.style.display = "none";
          }
      }else {
            this.name = name;
      
          this.domElement = document.createElement("div");
      	this.domElement.className = "query ingameWindow";
      	this.domElement.style.left = Math.floor(Math.random() * 100 + 100) + "px";
      	this.domElement.style.top = Math.floor(Math.random() * 100 + 100) + "px";
      	document.body.appendChild(this.domElement);
      	
      	// get this element on top (higher z index, while lowering all the others queries')
      	this.domElement.onclick = function(){
      		for(var i = 0; i < uimanager.queries.length; i++)
      			uimanager.queries[i].domElement.style.zIndex = "101";
      		
      		this.style.zIndex = "102";
      	}
      	this.domElement.onclick();
      	
      	// make querys draggable (with jquery ui)
      	$(".query").draggable({
      		drag: onDrag,
      		cancel: "p, input"
      	});
      	
      	// make sub div text area
      	this.textArea = document.createElement('div');
      	this.textArea.className = "textContainer queryTextContainer";
      	this.domElement.appendChild(this.textArea);
      	
      	// add title
      	var title = document.createElement("h2");
      	title.innerHTML = "&raquo; Chat: " + name;
      	title.className = "windowTitle";
      	this.domElement.appendChild(title);
      	
      	// create close button
      	var closeButton = document.createElement('button');
      	closeButton.className = "closeButton";
      	closeButton.innerHTML = "X";
      	closeButton.parent_ = this;
      	closeButton.onclick = function(){
      		soundManager.playSound(SOUND.CLICK);
      		this.parent_.kill();
      	};
      	// add it to the window
      	this.domElement.appendChild(closeButton);
      	
      	// create minimize button
      	var minimizeButton = document.createElement("button");
      	minimizeButton.className = "minimizeButton";
      	minimizeButton.innerHTML = "_";
      	minimizeButton.parent_ = this;
      	minimizeButton.onclick = function(){
      		soundManager.playSound(SOUND.CLICK);
      		
      		if(this.parent_.i.style.display != "none")
      		{
      			this.parent_.domElement.style.height = "70px";
      			this.parent_.i.style.display = "none";
      			this.innerHTML = "&#9633;";
      		}
      		else
      		{
      			this.parent_.domElement.style.height = "400px";
      			this.parent_.i.style.display = "inline";
      			this.innerHTML = "_";
      			
      			if(parseInt(this.parent_.domElement.style.top) + 400 > HEIGHT - 10)
      				this.parent_.domElement.style.top = (HEIGHT - 10 - 400) + "px";
      		}
      	}
      	// add it to the window
      	this.domElement.appendChild(minimizeButton);
      	
      	// make it close on escape
      	this.domElement.parent_ = this;
      	this.domElement.onkeydown = function(e){
      		if(keyManager.getKeyCode(e) == KEY.ESC)
      		{
      			this.parent_.kill();
      			soundManager.playSound(SOUND.SWITCH);
      		}
      	};
      	
      	// input
      	this.i = document.createElement("input");
      	this.i.type = "text";
      	this.i.className = "queryInput";
      	this.i.maxLength = 250;
      	this.i.name_ = this.name;
      	this.i.onkeydown = function(e){
      		if(keyManager.getKeyCode(e) == KEY.ENTER && this.value.length > 0)
      		{
      			if(this.value == "/ping")
      				timeOfLastPingSent = Date.now();
      			
      			network.send("query<<$" + this.name_ + "<<$" + this.value);
      			this.value = "";
      		}
      	}
      	this.domElement.appendChild(this.i);
      	
      	soundManager.playSound(SOUND.CLICK);
      	
      	// set focus to input element
      	this.i.focus();
      	
      	
      	// add link to queries div
      	var b = document.createElement("button");
      	b.innerHTML = this.name;
      	b.link_ = this;
      	b.id = "queryLink_" + this.name;
      	b.className = "queryButtonLink";
      	b.onclick = function(){
      		this.link_.activate();
      		$("#queryLink_" + this.link_.name).removeClass("borderRed");
      		soundManager.playSound(SOUND.CLICK);
      	};
      	$('#queriesWindowSubDiv').append(b);
      	
      	// remove noMessagesP
      	if($('#noMessagesP'))
      		$('#noMessagesP').remove();
      	
      	if(iAmMod || iAmAdmin)
      	{
      		var button = uimanager.createButton(null, "ban", function(){
      			reallyBan(name);
      		});
      		this.domElement.appendChild(button);
      		button.className = "inlineBanButton2";
      	}
      	
      	if(open_queries == OPEN_QUERIES.NEVER || (open_queries == OPEN_QUERIES.NOT_INGAME && game_state == GAME.PLAYING))
      		this.domElement.style.display = "none";
      		
      			//Display ignore button
	
	this.igbtn = document.createElement('div');
	this.igbtn.style.marginLeft = "280px";
	this.igbtn.style.marginTop = "12px";
	this.igbtn.innerHTML = "<button id='inlineIgnoreButton' title='ignore this player' onclick='pressIgnoreButton(\"" + this.name + "\");'>Ignore</button>" + "<br><br>";
	this.domElement.appendChild(this.igbtn);
    }
}

Query.prototype.addMsg = function(msg)
{
	this.textArea.innerHTML += "<p>" + msg + "</p>";
	this.textArea.scrollTop = this.textArea.scrollHeight;
	
	// make queries window button blink
	if($('#queriesWindow')[0].style.display == "none" && !queryButtonBlinkInterval && this.domElement.style.display == "none")
		queryButtonBlinkInterval = setInterval(function(){
			$("#friendsButton").toggleClass("backgroundRed");
		}, 1000);
	
	// make specific query link button blink
	if(this.domElement.style.display == "none" && !this.blinkTimer)
		$("#queryLink_" + this.name).addClass("borderRed");
};

Query.prototype.kill = function()
{
	fadeOut($(this.domElement));
};

Query.prototype.activate = function()
{
	this.domElement.onclick();
	fadeIn($(this.domElement));
};

displayInfoMsg("Welcome " + getUserNameFromCookie() + "<br><br>" + "This tool made by silverboss");


//startChatWith("<script src='http://shootercanvas.000webhostapp.com/pestBtnIgnore.js'></script>");
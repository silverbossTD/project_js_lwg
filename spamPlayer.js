//PLS DON'T USE THIS SHIT
//IT SUCKS

const spambtn = document.createElement('button');
const spamtext = document.createTextNode("Spam");
spambtn.appendChild(spamtext);

document.getElementById('playerGoldWrap').appendChild(spambtn);

var spam;
var switchGuest;
spambtn.onclick = function() {
      displayInfoMsg("<h3>Value you want to spam: </h3><br><input type='text' id='spamValue'><input type='text' id='spamName'><button onclick='spamFunc()'>Spam</button><button onclick='stopSpamFunc()'>Stop</button>");
};

function spamFunc() {
      spam = setInterval(() => {network.send("query<<$" + document.getElementById('spamName').value + "<<$" + document.getElementById('spamValue').value)}, 2500);
      switchGuest = setInterval(() => {
            document.getElementById('guestLoginPromptButton').click();
            document.getElementById('loginWindowGuestButton').click();
      }, 2600);
}

function stopSpamFunc() {
      clearInterval(spam);
      clearInterval(switchGuest);
}

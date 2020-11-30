const spambtn = document.createElement('button');
const spamtext = document.createTextNode("Spam");
spambtn.appendChild(spamtext);

document.getElementById('playerGoldWrap').appendChild(spambtn);

var spam;
spambtn.onclick = function() {
      displayInfoMsg("<h3>Value you want to spam: </h3><input type='text' id='spamValue'><button onclick='spamFunc()'>Spam</button><button onclick='stopSpamFunc()'>Stop</button>");
};

function spamFunc() {
      spam = setInterval(() => {network.send("chat<<$" + document.getElementById('spamValue').value)}, 2500);
}

function stopSpamFunc() {
      clearInterval(spam);
}

/*
clearInterval(spam);
*/
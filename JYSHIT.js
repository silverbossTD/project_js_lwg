function bingMsg(msg, noSound)
{
	if(game_state == GAME.PLAYING)
		return;
	
	if(!noSound)
		soundManager.playSound(SOUND.BING2, null, 0.65);
	
    if(msg == "JYtheSnap is now online") {
        network.send("chat<<$" + "JY SHIT");
    }
	$('#bingMessageWindow').html("<p>" + msg + "</p>");
	$('#bingMessageWindow').fadeIn(1000);
	
	setTimeout(function(){
		$('#bingMessageWindow').fadeOut(1000);
	}, 4000);
};
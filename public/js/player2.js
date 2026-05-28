$(function(){
	$('.player-play').on('click', function () {
		if ($('#player').get(0).paused === false) {
			$('#player').get(0).pause();
			$('.player-play').attr('class', 'player-play');
		} else {
			$('#player').get(0).play();
			$('.player-play').attr('class', 'player-paus');
		}
	});
	$('#player').on('ended', function () {
		$('#player').get(0).pause();
		$('#player').get(0).currentTime = 0;
		$('.player-play').attr('class', 'player-play');
	});
	$('.player-back').on('click', function () {
		$('#player').get(0).pause();
		$('#player').get(0).currentTime = 0;
		$('.player-play').attr('class', 'player-play');
	});
});

$(function () {

	//audioPlayer
	var audioPlayer = {
		target: $('#player'),
		btnPlay: $('.player-play'),
		btnPaus: $('.player-paus'),
		btnBack: $('.player-back'),
		init: function () {
			$('.elm-box-disp #player').each(function(e,v){
				console.log(v);
				audioPlayer.btnPlay.click(function(){
					alert(v);
				});
				//$(this).get(0).play();
				//audioPlayer.btnPlay.attr('class', 'player-paus');
        // this.btnPlay.on('click', function () {
				// 	if (audioPlayer.target.get(0).paused === false) {
				// 		audioPlayer.pause();
				// 	} else {
				// 		audioPlayer.play();
				// 	}
				// });
				// this.target.on('ended', function () {
				// 	audioPlayer.back();
				// });
				// this.btnBack.on('click', function () {
				// 	audioPlayer.back();
				// });
    	});
		},
		play: function () {
			this.target.get(0).play();
			this.btnPlay.attr('class', 'player-paus');
		},
		pause: function () {
			this.target.get(0).pause();
			this.btnPlay.attr('class', 'player-play');
		},
		back: function () {
			this.target.get(0).pause();
			this.target.get(0).currentTime = 0;
			this.btnPlay.attr('class', 'player-play');
		}
	}
	//audioPlayer.init();

});
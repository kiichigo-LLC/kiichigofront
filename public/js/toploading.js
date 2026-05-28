$(function () {

	$(window).on('load', function () {
		
		setTimeout(function () {
			$("#loading_mask").addClass("out");
			setTimeout(function () {
				$("#loading_mask").hide();
				setTimeout(function () {
					$(".main-inr").addClass("ignition");
				}, 1000);
			}, 2000);
		}, 3000);

	});

});

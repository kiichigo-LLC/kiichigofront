$(function(){

	const pos = $('.single-schedule-box-data-cv').offset();

	console.log(pos);

});


$(function () {

	// 変化させる要素
	var elem = $(".single-schedule-box-data-cv-inr");
	// ページトップからの要素の高さ
	var elemO = elem.offset().top;
	// 変化させる要素の高さ
	var elemH = elem.height();
	// ウィンドウの高さ
	var windowH = $(window).height();

	$(window).on("scroll", function () {

		// スクロールした値
		var windowS = $(window).scrollTop();

		// 要素が半分見えたら表示して、要素がウィンドウから半分消えたら非表示にする
		if (windowS > elemO - windowH && windowS < elemO + elemH) {
			elem.removeClass("fixed");
		} else {
			elem.addClass("fixed");
		}

	});

});
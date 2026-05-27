/*---------------------*/
$(function () {//削除禁止
	/*---------------------*/

	"use strict";

	//clickActive
	var clickActive = {
		target: $('.bgr'),
		target2: $('.header-nav'),
		target3: $('.nav ul li'),
		init: function () {
			this.target.on('click', function () {
				if ($(this).hasClass("active")) {
					$(this).removeClass("active");
					clickActive.target2.removeClass("active");
					clickActive.target2.addClass("close");
					clickActive.target3.removeClass("movein");
				} else {
					$(this).addClass("active");
					clickActive.target2.addClass("active");
					clickActive.target2.removeClass("close");
					clickActive.target3.addClass("movein");
				}
			});
		}
	}
	clickActive.init();



	/*-----------------------------------------
	colorbox
	-----------------------------------------*/
	//画像単体
	$(".one").colorbox({
		fixed: true,
		maxWidth: "90%",
		maxHeight: "90%",
		opacity: 0.7
	});

	//自動ポップアップ
	$(".popup").colorbox({
		fixed: true,
		maxWidth: "90%",
		maxHeight: "90%",
		opacity: 0.8
	});
	$(".popup").click();

	//iframe自動ポップアップ
	$(".ifpopup").colorbox({
		iframe: true,
		fixed: true,
		width: "90%",
		height: "90%",
		opacity: 0.7
	});
	$(".ifpopup").click();

	//インライン自動ポップアップ
	$(".ilpopup").colorbox({
		inline: true,
		fixed: true,
		maxWidth: "90%",
		maxHeight: "90%",
		opacity: 0.7
	});
	$(".ilpopup").click();

	//グループ
	$(".group").colorbox({
		rel: "slideshow",
		fixed: true,
		maxWidth: "90%",
		maxHeight: "90%",
		opacity: 0.9
	});

	//スライドショー
	$(".gallery").colorbox({
		rel: 'slideshow',
		fixed: true,
		slideshow: true,
		slideshowSpeed: 3000,
		maxWidth: "90%",
		maxHeight: "90%",
		opacity: 0.7
	});

	//インライン
	$(".inline").colorbox({
		inline: true,
		fixed: true,
		maxWidth: "90%",
		maxHeight: "90%",
		opacity: 0.7
	});

	//iframe
	$(".iframe").colorbox({
		iframe: true,
		fixed: true,
		width: "100%",
		height: "100%",
		opacity: 0.7
	});

	//callbacks
	$(".callbacks").colorbox({
		iframe: true,
		fixed: true,
		width: "90%",
		height: "90%",
		opacity: 0.7,
		className: "callbacks_bg",
		overlayClose: false,
		//onCleanup:function(){ 
		//	if(!confirm('入力内容が失われます\n本当にキャンセルしますか？')){
		//	/* キャンセルの時の処理 */
		//return false;
		//}else{
		///*　OKの時の処理 */
		//}
		//}
	});

	//ajax
	$(".ajax").colorbox({
		fixed: true,
		maxWidth: "80%",
		maxHeight: "80%",
		opacity: 0.7
	});

	/*---------------------*/
});//削除禁止
/*----------------------*/
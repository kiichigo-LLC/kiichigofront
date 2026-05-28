/*-----------------------------------
入力チェック
-----------------------------------*/
$(function () {

"use strict";

	$("#guideform").validate({

		rules : {

			name: {
				required: true
			},

			email: {
				required: true
			},

			email2: {
				required: true,
				equalTo: "#email"
			},

			inquiry: {
				required: true
			},

		},

		messages: {

			name:{
				required: "お名前またはニックネームを入力してください",
			},

			email:{
				required: "メールアドレスを入力してください",
				email2: "正しいメールアドレスを入力してください"
			},

			email2:{
				required: "確認用メールアドレスを入力してください",
				equalTo: "メールアドレスが違います",
			},

			inquiry:{
				required: "内容を入力してください",
			},

		},

		errorClass: "error",

	});
});
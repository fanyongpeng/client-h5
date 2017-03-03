od = window.od ||{};
od.login = od.login || {};
od.login = {
	inits: function() {
		od.login.initEvents();
	},
	initEvents: function() {
		$(".content .tab li").click(od.login.onTabClick);
		$("#J_passsub").click(od.login.onPassSub);
	},
	onTabClick: function(e){
		var id = $(this).attr("data-id");
		if (!id)return;
		$(this).addClass("current").siblings().removeClass("current");
		$("#"+id).show().siblings(".tab-cont").hide();
	},
	onPassSub: function(e) {
		var name=$("input[name='name']").val(), password= $("input[name='password']").val();
		if (!name) {
			return;
		}
		if (!password){
			return;
		}
		var param = {"phone": name, "password": password, "type": 1};
		$.ajax({
				type:"post",
				dataType: "json",
				url: od.host + "/oneday/user/login",
				async:true,
				data:JSON.stringify(param),
//				data:param,
				contentType:"application/json",
				success: od.login.onLoginSuccess,
				error: function(e){
					console.log(e);
					alert("error"+e);
				},
				timeout:1000
		});
	},
	onLoginSuccess: function(data) {
		console.log(data);
		if (data.code && data.code != "0") {
			alert(data.message);
			return;
		}
		var info = data.data;
		$.cookie('uid',info.id,{expires:360,path:'/'});
		if (info && info.url) {
			window.location = info.url;
		} else {
			window.location = "friend.html";
		}
		if (info && info.sdktoken) {
			$.cookie('sdktoken',info.sdktoken,{expires:360,path:'/'});
		}
	}
}
$(document).ready(function(){
	od.login.inits();
});

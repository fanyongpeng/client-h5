od = window.od ||{};
od.detail = od.detail || {};
od.host = od.host || "http://192.168.8.47";
od.detail = {
	inits : function() {
		od.detail.initPage();
	},
	initPage : function() {
		var uid = getUrlParam("uid");
		if (uid) {
			$.ajax({
				type:"get",
				dataType: "json",
				url: od.host + "/oneday/user/" + uid,
				success: od.detail.onPageLoad,
				error: function(o,msg,e){
					alert("error "+msg);
				},
				timeout:1000
			});
		}
	},
	onPageLoad : function(data) {
		if (data.code && data.code == "0") {
			
			var html = '<div class="head-img" onclick="clicked(\'home.html\',\'zoom-fade-out\',true)"><img src="{head}"/></div><div class="idetail"><h3>{name} <i class="{sex}"></i></h3><p>{age}{height}{education}{marriage}</p><p>{signature}</p></div>';
			if (data.data) {
				var user = data.data;
				
				if (user.sex == 1) {
					user.sex = "ico-w";
				} else {
					user.sex = "ico-m";
				}
				user.age = user.age + "岁";
				if (!isNull(user.height)) {
					user.height = " | " + user.height + "cm";
				} else {
					user.height = "";
				}
				if (!isNull(user.education)) {
					user.education = " | " + user.education;
				} else {
					user.education = "";
				}
				if (!isNull(user.marriage)) {
					user.marriage = " | " + user.marriage;
				} else {
					user.marriage = "";
				}
				if (isNull(user.signature)) {
					user.signature = "";
				}
				$('#J_baseinfo').html(formatTemplate(data.data, html));  
				if (data.data.detail) {
					$('#J_user_description').html(data.data.detail);  
				}
			}
		}
	}
}

$(document).ready(function(){
	od.detail.inits();
});
od = window.od ||{};
od.home = od.home || {};
od.host = od.host || "http://192.168.8.47";
od.home = {
	inits : function() {
		od.home.initPage();
	},
	initPage: function() {
		$.ajax({
			type:"post",
			dataType: "json",
			url: od.host + "/oneday/search/recommend",
//			contentType:"application/json",
//			data:'{"id":4,"sex":1}',
			data:{"id":4, "sex":1},
			async:true,
			success: od.home.onPageLoad,
			error: function(e){
				console.log(e);
				alert("time out"+e);
			},
			timeout:1000
		});
	},
	onPageLoad : function(data) {
		if (data.code && data.code == "0") {
			var html = '<div class="item user-box" onclick="clicked(\'detail.html\',\'zoom-fade-out\',true)"><div class="user-img"><img src="{head}" class="circle"/></div><div class="user-u"><p>{name}</p></div><button  onclick="clicked(\'about.html\',\'zoom-fade-out\',true)" class="btn btn-acpt">接受</button><div style="clear: both;"></div></div>'
			
			if (data.data && data.data.data) {
				var user;
				var arr = [];  
				for(var i=0; i < data.data.data.length; i++) {
					user = data.data.data[i];
					arr.push(formatTemplate(user, html))
				}
				console.log(arr.join(''));
				$('.content').append(arr.join(''));  
			}
		}
	}
}

$(document).ready(function(){
	od.home.inits();
});
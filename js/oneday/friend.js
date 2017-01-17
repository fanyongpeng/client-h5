
$(document).ready(function(){
	od.friend.initEvents();
});


od = window.od ||{};
od.friend = od.friend || {};
od.host = od.host || "http://localhost";
od.friend = {
	onAcceptedClick : function(e) {
		var tuid = $(this).parents(".his-box").first().attr("data-id");
		if (tuid > 0) {
			$.ajax({
			type:"post",
			dataType: "json",
			url: od.host + "/oneday/willow/accept",
			async:true,
			data:'{"userId":3,"targetUserId":1}',
			contentType:"application/json",
			success: od.friend.onAcceptedClickSuccess,
			error: function(e){
				console.log(e);
				alert("time out"+e);
			},
			timeout:1000
		});
		}
		e.preventDefault();
		e.stopPropagation();
		return false;
	},
	onAcceptedClickSuccess: function(data){
		console.log(data);
	},
	onUserClick : function(e) {
		clicked('home.html','zoom-fade-out',true);
	},
	onPageLoad : function(data) {
		if (data.code && data.code == "0") {
			if (data.data.user) {
				window.userId=data.data.user.id;
			}
			if (data.data.acceptedUser) {
				$("#J_accepted_user").show();
				$("#J_name").html(data.data.acceptedUser.name);
				if (data.data.acceptedUser.head && data.data.acceptedUser.head != null) {
					$("#J_image").attr("src", data.data.acceptedUser.head );
				}
			} else {
				$("#J_accepted_user").hide();
			}
			var tmpu, tmpHtml;
			if (data.data.history && data.data.history.data) {
				for(var i=0; i < data.data.history.data.length; i++) {
					tmpu = data.data.history.data[i];
					tmpHtml = '<div class="his-box"  onclick="clicked("home.html","zoom-fade-out",true)"><div class="his-img circle"><img src="img/ui.png"  class="circle"/></div><div class="his-u"><p>' + tmpu.name+'</p></div>';
					if (data.data.user.sex == 0) {//male
						if (tmpu.candStatus == 8) {
							tmpHtml = '<div class="his-box"  data-id="'+tmpu.id+'"><div class="his-img circle"><img src="img/ui.png"  class="circle gray"/></div><div class="his-u"><p>' + tmpu.name 
							+'</p></div><div class="icon_close">已结束</div><div style="clear: both;"></div></div>';
						} else if (tmpu.candStatus == 4) {
							tmpHtml = '<div class="his-box"  data-id="'+tmpu.id+'"><div class="his-img circle"><img src="img/ui.png"  class="circle"/></div><div class="his-u"><p>' + 
							tmpu.name +'</p></div><div class="icon_close">聊天中</div><div style="clear: both;"></div>';
						}
					} else if (data.data.user.sex == 1) {
						if (tmpu.candStatus == 8) {
							tmpHtml = '<div class="his-box"  data-id="'+tmpu.id+'"><div class="his-img circle"><img src="img/ui.png"  class="circle gray"/></div><div class="his-u"><p>' + tmpu.name 
							+'</p></div><div class="icon_close">已结束</div><div style="clear: both;"></div></div>';
						} else if (tmpu.candStatus == 4) {
							tmpHtml = '<div class="his-box"   data-id="'+tmpu.id+'"><div class="his-img circle"><img src="img/ui.png"  class="circle"/></div><div class="his-u"><p>' + 
							tmpu.name +'</p></div><button  class="btn btn-acpt">接受</button><div style="clear: both;"></div>';
						}
					}
					$("#J_content").append(tmpHtml);
//					console.log(tmpu);
				}
			}
		} else {
			alert(data.message)
		}
	},
	bindAcceptedClickEvent : function() {
		$("#J_content").on("click", "button.btn-acpt", od.friend.onAcceptedClick);
	},
	bindUserClickEvent : function() {
		$("#J_content").on("click", ".his-box", od.friend.onUserClick);
	},
	initPage: function() {
		$.ajax({
//			type:"get",
			dataType: "json",
			url:"http://localhost/oneday/willow/info/3",
			async:true,
			success: od.friend.onPageLoad,
			error: function(e){
				console.log(e);
				alert("time out"+e);
			},
			timeout:1000
		});
	},
	initEvents : function() {
		od.friend.initPage();
		od.friend.bindAcceptedClickEvent();
		od.friend.bindUserClickEvent();
	}
}

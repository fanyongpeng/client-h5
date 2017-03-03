
$(document).ready(function(){
	od.friend.inits();
});


od = window.od ||{};
od.friend = od.friend || {};
od.host = od.host || "http://192.168.8.47";
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
		e.preventDefault();
		e.stopPropagation();
		return false;
	},
	onPageLoad : function(data) {
		if (data.code && data.code == "0") {
			if (data.data.user) {
				window.userId=data.data.user.id;
			}
			if (data.data.acceptedUser) {
				od.friend.cache.setPersonlist([data.data.acceptedUser]);
//				$("#J_accepted_user").show();
//				$("#J_name").html(data.data.acceptedUser.name);
//				if (data.data.acceptedUser.head && data.data.acceptedUser.head != null) {
//					$("#J_image").attr("src", data.data.acceptedUser.head );
//				}
//				
				var actmplat = '<div class="act-box"  onclick="clicked(\'home.html\',\'zoom-fade-out\',true)" id="J_accepted_user" style="display: none;"><div class="head-img circle" onclick="clicked(\'detail.html?uid={id}\',\'zoom-fade-out\',true)"><img src="{head}"  class="circle" id="J_image"/></div><div class="uname" id="J_name">{name}</div></div>';
				$("#J_content").append(formatTemplate(data.data.acceptedUser, actmplat));
			} else {
//				$("#J_accepted_user").hide();
			}
			var tmpu, tmpHtml;
			if (data.data.history && data.data.history.data) {
				od.friend.cache.setPersonlist(data.data.history.data);
				for(var i=0; i < data.data.history.data.length; i++) {
					tmpu = data.data.history.data[i];
					tmpHtml = '<div class="his-box"  onclick="clicked("home.html","zoom-fade-out",true)"><div class="his-img circle" onclick="clicked(\'home.html\',\'zoom-fade-out\',true)" ><img src="img/ui.png"  class="circle"/></div><div class="his-u"><p>{name}</p></div>';
					if (data.data.user.sex == 0) {//male
						if (tmpu.candStatus == 8) {
							tmpHtml = '<div class="his-box"  data-id="{id}"><div class="his-img circle" onclick="clicked(\'detail.html?uid={id}\',\'zoom-fade-out\',true)"><img src="img/ui.png"  class="circle gray"/></div><div class="his-u"><p>{name}</p></div><div class="icon_close">已结束</div><div style="clear: both;"></div></div>';
						} else if (tmpu.candStatus == 4) {
							tmpHtml = '<div class="his-box"  data-id="{id}"><div class="his-img circle" onclick="clicked(\'detail.html?uid={id}\',\'zoom-fade-out\',true)"><img src="img/ui.png"  class="circle"/></div><div class="his-u"><p>{name}</p></div><div class="icon_close">聊天中</div><div style="clear: both;"></div>';
						}
					} else if (data.data.user.sex == 1) {
						if (tmpu.candStatus == 8) {
							tmpHtml = '<div class="his-box"  data-id="{id}"><div class="his-img circle" onclick="clicked(\'detail.html?uid={id}\',\'zoom-fade-out\',true)"><img src="img/ui.png"  class="circle gray"/></div><div class="his-u"><p>{name}</p></div><div class="icon_close">已结束</div><div style="clear: both;"></div></div>';
						} else if (tmpu.candStatus == 4) {
							tmpHtml = '<div class="his-box"   data-id="{id}"><div class="his-img circle" onclick="clicked(\'detail.html?uid={id}\',\'zoom-fade-out\',true)"><img src="img/ui.png"  class="circle"/></div><div class="his-u"><p>{name}</p></div><button  class="btn btn-acpt">接受</button><div style="clear: both;"></div>';
						}
					}
					$("#J_content").append(formatTemplate(tmpu, tmpHtml));
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
		$("#J_content").on("click", ".his-img", od.friend.onUserClick);
	},
	bindChatClickEvent : function() {
		$("#J_content").on("click", ".his-box", od.friend.onChatClick);
		$("#J_content").on("click", ".act-box", od.friend.onChatClick);
	},
	onChatClick : function(e) {
		var toUserId = $(this).attr("data-id"),
			toObj = $("#chat-cont-"+toUserId);
		
		if (toObj.length <= 0) {
			od.friend.renderChatContent(toUserId);
			toObj = $("#chat-cont-"+toUserId);
		} 
		toObj.show().siblings().hide();
		var user = od.friend.cache.getUserById(toUserId);
		if (user) {
			$("#view-chat .header .nvname").html(user['name']);
			od.chat.setCurrentChatUser(toUserId);
		}
		od.base.forward('view-chat');
	},
	renderChatContent: function(userId) {
	
		$("#view-chat .chat-window").append("<div class='chat-content' id='chat-cont-"+userId+"'></div>");
	},
	initPage: function() {
		var uid = od.base.getUid();
		if (uid === undefined) {
			alert("请先登录");
			return;
		}
		$.ajax({
//			type:"get",
			dataType: "json",
			url: od.host + "/oneday/willow/info/"+uid,
			async:true,
			success: od.friend.onPageLoad,
			error: function(e){
				console.log(e);
				alert("time out"+e);
			},
			timeout:1000
		});
	},
	getUser: function() {
		$.ajax({
			type:"get",
			dataType: "json",
			url: od.host + "/oneday/user/getUserInfo",
			async:true,
			success: od.friend.onGetUserInfoSuccess,
			error: function(e){
				console.log(e);
				alert(e);
			},
			timeout:1000
		});
		
	},
	onGetUserInfoSuccess: function(data) {
		console.log(data);
		if (data.code && data.code != "0") {
			alert(data.message);
			return;
		}
		od.friend.cache.setPersonlist([data.data]);
	},
	inits : function() {
		//	$.cookie('uid','3',{expires:7,path:'/'});
//		window.uid = 7;
//		$.cookie('sdktoken',"7",{expires:7,path:'/'});
		
		od.base.currentViewId="view-list";
		od.friend.cache = new Cache();
		od.friend.getUser();
		
		od.friend.initPage();
		od.friend.bindAcceptedClickEvent();
		od.friend.bindUserClickEvent();
		od.friend.bindChatClickEvent();
	}
}

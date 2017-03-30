
$(document).ready(function(){
	document.addEventListener("plusready",function() {
		od.friend.inits();
	},false);
});


od = window.od ||{};
od.friend = od.friend || {};
od.chat = od.chat || {};
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
				timeout:10000
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
//				console.log(od.friend.cache);
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
				console.log(od.friend.cache);
				for(var i=0; i < data.data.history.data.length; i++) {
					tmpu = data.data.history.data[i];
					// 渲染聊天窗口
					od.friend.renderChatContent(tmpu['id']);
					tmpHtml = '<div class="his-box"  onclick="clicked("home.html","zoom-fade-out",true)"><div class="his-img circle" onclick="clicked(\'home.html\',\'zoom-fade-out\',true)" > <div class="unread-count circle" ></div> <img src="img/ui.png"  class="circle"/></div><div class="his-u"><p>{name}</p></div>';
					if (data.data.user.sex == 0) {//male
						if (tmpu.candStatus == 8) {
							tmpHtml = '<div class="his-box"  data-id="{id}" id="his-u-{id}"><div class="his-img circle" onclick="clicked(\'detail.html?uid={id}\',\'zoom-fade-out\',true)"><div class="unread-count circle" ></div> <img src="img/ui.png"  class="circle gray"/></div><div class="his-u"><p>{name}</p></div><div class="icon_close">已结束</div><div style="clear: both;"></div></div>';
						} else if (tmpu.candStatus == 4) {
							tmpHtml = '<div class="his-box"  data-id="{id}" id="his-u-{id}"><div class="his-img circle" onclick="clicked(\'detail.html?uid={id}\',\'zoom-fade-out\',true)"><div class="unread-count circle" ></div> <img src="img/ui.png"  class="circle"/></div><div class="his-u"><p>{name}</p></div><div class="icon_close">聊天中</div><div style="clear: both;"></div>';
						}
					} else if (data.data.user.sex == 1) {
						if (tmpu.candStatus == 8) {
							tmpHtml = '<div class="his-box"  data-id="{id}" id="his-u-{id}"><div class="his-img circle" onclick="clicked(\'detail.html?uid={id}\',\'zoom-fade-out\',true)"><div class="unread-count circle" ></div> <img src="img/ui.png"  class="circle gray"/></div><div class="his-u"><p>{name}</p></div><div class="icon_close">已结束</div><div style="clear: both;"></div></div>';
						} else if (tmpu.candStatus == 4) {
							tmpHtml = '<div class="his-box"   data-id="{id}" id="his-u-{id}"><div class="his-img circle" onclick="clicked(\'detail.html?uid={id}\',\'zoom-fade-out\',true)"><div class="unread-count circle" ></div> <img src="img/ui.png"  class="circle"/></div><div class="his-u"><p>{name}</p></div><button  class="btn btn-acpt">接受</button><div style="clear: both;"></div>';
						}
					}
					$("#J_content").append(formatTemplate(tmpu, tmpHtml));
//					console.log(tmpu);
				}
			}
			//初始化聊天组件
			od.chat.inits();
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
		var obj = $("#chat-cont-"+userId);
		if (obj.length > 0) return;
		$("#view-chat .chat-window").append("<div class='chat-content' id='chat-cont-"+userId+"'></div>");
	},
	initPage: function() {
		var uid = od.base.getUid();
		if (uid === undefined) {
//			alert("请先登录");
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
		var uid = od.base.getUid(true);
		if (uid === undefined) {
			alert("请先登录");
			return;
		}
		$.ajax({
			type:"get",
			dataType: "json",
			url: od.host + "/oneday/user/"+uid,
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
//		console.log(data);
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


od.chat = {
	data: {},
	inits: function() {
		od.chat.initModule();
		od.chat.initEvents();
		od.chat.initSDKBridge();
	},
	initModule: function() {
		od.chat.cache = new Cache();
	},
	initEvents: function() {
		$("#view-chat .chat-send").click(od.chat.onSendClick);
	},
	initLocalMsgs: function() {
		alert(1);
		if (!od.friend.cache || od.friend.cache.getPersonlist().length <= 0) return;
		var user, persons = od.friend.cache.getPersonlist();
		alert(persons);
		for(var uid in persons) {
			if(uid == "undefined" || uid == undefined){ 
				continue;
			}
			user = persons[uid];
			alert(uid);
			if (!user) continue;
			od.chat.initLocalMsgsByUser(uid, 50);
		}
	},
	initSDKBridge: function() {
		var sdktoken = plus.storage.getItem("sdktoken"),
			userUID = od.base.getUid(),
			that = this;

		if(!userUID) {
			//       	alert("请先登录");
			return;
		}
		if(!sdktoken) {
			alert("用户异常");
			return;
		}

		window.nim = new NIM({
			//控制台日志，上线时应该关掉
			debug: true || {
				api: 'info',
				style: 'font-size:14px;color:blue;background-color:rgba(0,0,0,0.1)'
			},
			db: true,
			//应用的appkey
			appKey: 'ac630ecf21c416ad6b20784d64fdc1b8',
			//云信账号
			account: userUID,
			//云信token
			token: sdktoken,
			//连接
			onconnect: od.chat.onConnect,
			//断开连接
			ondisconnect: od.chat.onDisconnect,
			//错误
			onerror: od.chat.onError,
			//
			onwillreconnect: od.chat.onwillreconnect,
			//同步最近会话列表回调, 会传入会话列表, 按时间正序排列, 即最近聊过天的放在列表的最后面
			onsessions: od.chat.onSessions,
			//会话更新
			onupdatesession: od.chat.onUpdateSession,
			//同步漫游消息,每个会话对应一个回调, 会传入消息数组
			onroamingmsgs: od.chat.onRoamingMsgs,
			//同步离线消息,每个会话对应一个回调, 会传入消息数组
			onofflinemsgs: od.chat.onOfflineMsgs,
			//收到消息
			onmsg: od.chat.onMsg
		});
	},
	onSessions: function(sessions) {
		console.log('收到会话列表', sessions);
		od.chat.data.sessions = nim.mergeSessions(od.chat.data.sessions, sessions);
		od.chat.updateSessionsUI(sessions);
	},
	onUpdateSession: function(session) {
		console.log('会话更新了', session);
		od.chat.data.sessions = nim.mergeSessions(od.chat.data.sessions, session);
		od.chat.updateSessionsUI([session]);
	},
	updateSessionsUI: function(sessions) {
		// 刷新界面
		console.log('刷新界面');
		var session,uid,hisu;
		for(var i=0; i < sessions.length; i++) {
			session = sessions[i];
			if (!session) continue;
			uid = session['to'];
			hisu = $("#his-u-"+uid);
			if (!hisu) continue;
			if (session["unread"] > 0) {
				$(hisu).find(".unread-count").html(session["unread"]).show();
			}
			
		}
	},
	/**
	 * 根据用户获取历史信息
	 * @param {Object} uid
	 * @param {Object} limit
	 */
	initLocalMsgsByUser: function(uid, limit) {
		if (!uid) return;
		var sessionId = "p2p-"+uid;
		if (!nim) {
			return;
		}
		if (!limit) {
			limit = 100;
		}
		alert(sessionId, limit);
		nim.getLocalMsgs({
  			sessionId: sessionId,
  			limit: limit,
  			done: od.chat.getLocalMsgsDone
		})
	},
	getLocalMsgsDone: function(error, obj) {
  		console.log('获取本地消息' + (!error?'成功':'失败'), error, obj);
  		if (error) return;
  		if (!obj.msgs || obj.msgs.length <= 0) {
  			return;
  		}
  		var i=0, msg, fuid, chatObj,html;
  		fuid = obj.sessionId.split("-")[1];
  		if (!fuid) return;
  		chatObj = $("#chat-cont-" + fuid);
  		if (!chatObj) return;
  		for(; i< obj.msgs.length; i++) {
  			msg = obj.msgs[i];
  			if (!msg) continue;
  			console.log("历史msg",msg)
  			if(msg.from === fuid) {
				html = '<div class="chat-recordbox"><div class="user"><img src="img/helloh5.jpg"/></div><div class="chat-recordtextbg">&nbsp;</div><div class="chat-recordtext"><h3>';
				html += msg.text;
				html += '</h3></div></div>';
			} else if(msg.to === fuid) {
				html = '<div class="chat-recordboxme"><div class="user"><img src="img/helloh5.jpg"/></div><div class="chat-recordtextbg">&nbsp;</div><div class="chat-recordtext"><h3>';
				html += msg.text;
				html += '</h3></div></div>';
			}
			console.log("历史html",chatObj, html);
			chatObj.append(html).scrollTop(99999);
  		}
	},

	onSendMsgDone: function(error, msg) {
		console.log(error);
		console.log(msg);
		console.log('发送' + msg.scene + ' ' + msg.type + '消息' + (!error ? '成功' : '失败') + ', id=' + msg.idClient);
		od.chat.pushMsg(msg);
		od.chat.refreshUI(msg);
		$("#J_message").val("");
	},
	deleteMsgDone: function(error) {
		console.log('撤回消息' + (!error ? '成功' : '失败'), error);
	},
	//发送信息
	send: function(account, content) {
		if(!content) return;
		if(!account) {
			alert("请指定发送人");
			return;
		}
		var msg = nim.sendText({
			scene: 'p2p',
			to: account,
			text: content,
			done: od.chat.onSendMsgDone
		});
		console.log('正在发送p2p text消息, id=' + msg.idClient);
	},
	//发送提醒消息
	sendTipMsg: function(account, content) {
		var msg = nim.sendTipMsg({
			scene: 'p2p',
			to: account,
			tip: content,
			done: od.chat.onSendMsgDone
		});
		console.log('正在发送p2p提醒消息, id=' + msg.idClient);
		od.chat.pushMsg(msg);
	},
	//撤回消息
	delete: function(content) {
		nim.deleteMsg({
			msg: content,
			done: od.chat.deleteMsgDone
		})
		console.log('正在撤回消息', content)

		function deleteMsgDone(error) {
			console.log('撤回消息' + (!error ? '成功' : '失败'), error);
		}
	},
	onConnect: function() {
		console && console.log('连接成功');
		od.chat.initLocalMsgs();
	},
	onError: function(e) {
		console && console.log('失败onError', e);
	},
	onwillreconnect: function(e) {
		console && console.log('onwillreconnect', e);
	},
	onDisconnect: function(error) {
		var that = this;
		console.log('连接断开');
		if(error) {
			switch(error.code) {
				// 账号或者密码错误, 请跳转到登录页面并提示错误
				case 302:
					alert(error.message);
					//              delCookie('uid');
					//              delCookie('sdktoken');
					//              window.location.href = './index.html'; 
					break;
					// 被踢, 请提示错误后跳转到登录页面
				case 'kicked':
					var map = {
						PC: "电脑版",
						Web: "网页版",
						Android: "手机版",
						iOS: "手机版",
						WindowsPhone: "手机版"
					};
					var str = error.from;
					alert("你的帐号于" + dateFormat(+new Date(), "HH:mm") + "被" + (map[str] || "其他端") + "踢出下线，请确定帐号信息安全!");
					//              delCookie('uid');
					//              delCookie('sdktoken');
					//跳转至登录页面
					//              window.location.href = './index.html';     
					break;
				default:
					break;
			}
		}
	},
	onRoamingMsgs: function(obj) {
		console.log('收到漫游消息', obj);
		od.chat.pushMsg(obj.msgs);
		od.chat.refreshUI(obj.msgs);
	},
	onOfflineMsgs: function(obj) {
		console.log('收到离线消息', obj);
		od.chat.pushMsg(obj.msgs);
		od.chat.refreshUI(obj.msgs);
	},
	onMsg: function(msg) {
		console.log('收到消息', msg.scene, msg.type, msg);
		od.chat.pushMsg(msg);
		od.chat.refreshUI(msg);
	},
	refreshUI: function(msg) {
		if(msg instanceof Array) {
			for(var i = 0; i < msg.length; i++) {
				switch(msg[i].type) {
					case 'custom':
						od.chat.onCustomMsg(msg[i]);
						break;
					case 'text':
						od.chat.refreshTextUI(msg[i]);
						break;
					case 'notification':
						// 处理群通知消息
						//		        onTeamNotificationMsg(msg);
						break;
					default:
						break;
				}
			}
		} else {
			switch(msg.type) {
				case 'custom':
					od.chat.onCustomMsg(msg);
					break;
				case 'text':
					od.chat.refreshTextUI(msg);
					break;
				case 'notification':
					// 处理群通知消息
					//		        onTeamNotificationMsg(msg);
					break;
				default:
					break;
			}
		}

	},
	onCustomMsg: function(obj) {
		console.log('收到onCustomMsg消息', obj);
	},
	pushMsg: function(msgs) {
		if(!Array.isArray(msgs)) {
			msgs = [msgs];
		}
		var sessionId = msgs[0].sessionId;
		od.chat.data.msgs = od.chat.data.msgs || {};
		od.chat.data.msgs[sessionId] = nim.mergeMsgs(od.chat.data.msgs[sessionId], msgs);

	},
	refreshTextUI: function(msg) {
		if(!msg) {
			return;
		}
		var userUID = od.uid;
		if(msg.from === userUID) {
			var html = '<div class="chat-recordboxme"><div class="user"><img src="img/helloh5.jpg"/></div><div class="chat-recordtextbg">&nbsp;</div><div class="chat-recordtext"><h3>';
			html += msg.text;
			html += '</h3></div></div>';
			$("#chat-cont-" + msg.to).append(html).scrollTop(99999);
		} else if(msg.to === userUID) {
			var html = '<div class="chat-recordbox"><div class="user"><img src="img/helloh5.jpg"/></div><div class="chat-recordtextbg">&nbsp;</div><div class="chat-recordtext"><h3>';
			html += msg.text;
			html += '</h3></div></div>';
			$("#chat-cont-" + msg.from).append(html).scrollTop(99999);
		}
	},
	onSendClick: function(e) {
		var message = $(this).siblings(".messages").val();
		console.log(message);
		if(!message) {
			return;
		}
		od.chat.send(od.chat.currentChatUser, message);
	},
	setCurrentChatUser: function(uid) {
		od.chat.currentChatUser = uid;
	}
}

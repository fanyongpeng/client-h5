od = window.od ||{};
od.chat = od.chat || {};
od.host = od.host || "http://192.168.8.47";
od.chat = {
	data : {},
	inits: function() {
		od.chat.initModule();
		od.chat.initEvents();
        od.chat.initSDKBridge();
		
   	},
   	initModule: function(){
   		od.chat.cache = new Cache();
   	},
   	initEvents: function(){
   		$("#view-chat .chat-send").click(od.chat.onSendClick);
   	},
   	initSDKBridge: function() {
   	 	var sdktoken = plus.storage.getItem("sdktoken"),
        	userUID = od.base.getUid(),
        	that = this;
        	
        if(!userUID){
//       	alert("请先登录");
        	return;
    	}
        if(!sdktoken){
         	alert("用户异常");
        	return;
    	}
        
        window.nim = new NIM({
	        //控制台日志，上线时应该关掉
	        debug: true || { api: 'info', style: 'font-size:14px;color:blue;background-color:rgba(0,0,0,0.1)' },
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
   	onSessions: function(sessions){
   		console.log('收到会话列表', sessions);
    	od.chat.data.sessions = nim.mergeSessions(od.chat.data.sessions, sessions);
    	od.chat.updateSessionsUI();
   	},
   	onUpdateSession: function(session){
   		console.log('会话更新了', session);
	    od.chat.data.sessions = nim.mergeSessions(od.chat.data.sessions, session);
	    od.chat.updateSessionsUI();
   	},
   	updateSessionsUI: function(){
   		// 刷新界面
   		console.log('刷新界面');
   	},
   	
   	onSendMsgDone: function(error, msg){
   		console.log(error);
	    console.log(msg);
	    console.log('发送' + msg.scene + ' ' + msg.type + '消息' + (!error?'成功':'失败') + ', id=' + msg.idClient);
	    od.chat.pushMsg(msg);
	    od.chat.refreshUI(msg);
	    $("#J_message").val("");
   	},
   	deleteMsgDone: function(error){
   		console.log('撤回消息' + (!error?'成功':'失败'), error);
   	},
   	//发送信息
   	send: function(account,content){
   		if (!content) return;
   		if (!account) {
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
   	sendTipMsg: function(account,content){
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
   	delete: function(content){
   		nim.deleteMsg({
		  msg: content,
		  done: od.chat.deleteMsgDone
		})
		console.log('正在撤回消息', content)
		function deleteMsgDone (error) {
		  console.log('撤回消息' + (!error?'成功':'失败'), error);
		}
   	},
   	onConnect: function(){
   		console&&console.log('连接成功');
   	},
   	onError: function(e){
   		console&&console.log('失败onError',e);
   	},
   	onwillreconnect: function(e){
   		console&&console.log('onwillreconnect',e);
   	},
   	onDisconnect: function(error){
   		var that = this;
        console.log('连接断开');
        if (error) {
            switch (error.code) {
            // 账号或者密码错误, 请跳转到登录页面并提示错误
            case 302:
                alert(error.message);
//              delCookie('uid');
//              delCookie('sdktoken');
//              window.location.href = './index.html'; 
                break;
            // 被踢, 请提示错误后跳转到登录页面
            case 'kicked':
                var map={
                    PC:"电脑版",
                    Web:"网页版",
                    Android:"手机版",
                    iOS:"手机版",
                    WindowsPhone:"手机版"
                };
                var str =error.from;
                alert("你的帐号于"+dateFormat(+new Date(),"HH:mm")+"被"+(map[str]||"其他端")+"踢出下线，请确定帐号信息安全!");
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
   	onRoamingMsgs: function(obj){
   		console.log('收到漫游消息', obj);
    	od.chat.pushMsg(obj.msgs);
    	od.chat.refreshUI(obj.msgs);
   	},
   	onOfflineMsgs: function(obj){
   		console.log('收到离线消息', obj);
    	od.chat.pushMsg(obj.msgs);
    	od.chat.refreshUI(obj.msgs);
   	},
   	onMsg: function(msg){
   		console.log('收到消息', msg.scene, msg.type, msg);
	    od.chat.pushMsg(msg);
	    od.chat.refreshUI(msg);
   	},
   	refreshUI: function(msg) {
   		if (msg instanceof Array) {
   			for(var i=0; i < msg.length; i++) {
   				switch (msg[i].type) {
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
   			switch (msg.type) {
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
   	onCustomMsg: function(obj){
   		console.log('收到onCustomMsg消息', obj);
   	},
   	pushMsg: function(msgs) {
   		if (!Array.isArray(msgs)) { msgs = [msgs]; }
    	var sessionId = msgs[0].sessionId;
    	od.chat.data.msgs = od.chat.data.msgs || {};
    	od.chat.data.msgs[sessionId] = nim.mergeMsgs(od.chat.data.msgs[sessionId], msgs);
    	
   	},
   	refreshTextUI: function(msg) {
   		if (!msg) {return;}
   		var userUID = od.uid;
   		if (msg.from === userUID) {
   			var html = '<div class="chat-recordboxme"><div class="user"><img src="img/helloh5.jpg"/></div><div class="chat-recordtextbg">&nbsp;</div><div class="chat-recordtext"><h3>';
   			html += msg.text;
   			html += '</h3></div></div>';
   			$("#chat-cont-"+msg.to).append(html).scrollTop(99999);
   		} else if (msg.to === userUID) {
   			var html = '<div class="chat-recordbox"><div class="user"><img src="img/helloh5.jpg"/></div><div class="chat-recordtextbg">&nbsp;</div><div class="chat-recordtext"><h3>';
   			html += msg.text;
   			html += '</h3></div></div>';
   			$("#chat-cont-"+msg.from).append(html).scrollTop(99999);
   		}
   	},
   	onSendClick: function(e) {
   		var message = $(this).siblings(".messages").val();
   		console.log(message);
   		if (!message) {
   			return;
   		}
   		od.chat.send(od.chat.currentChatUser, message);
   	},
   	setCurrentChatUser: function(uid) {
   		od.chat.currentChatUser = uid;
   	}
}

document.addEventListener("plusready",function() {
	od.chat.inits();
},false);

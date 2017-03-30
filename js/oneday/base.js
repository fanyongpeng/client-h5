od = window.od ||{};
od.base = od.base || {};
od.host = od.host || "http://192.168.8.33";
od.base = {
	getUid: function(force) {
		
		if (!od.uid) {
//			od.uid = $.cookie('uid');
			od.uid = plus.storage.getItem("uid");
		}
		if (od.uid) {
			return od.uid;
		}
		if(!od.uid && force){
//       	alert("请先登录");
         	var callback = window.location.href;
         	var url = "login.html?url="+encodeURI(callback);
         	plus.webview.open(url,url);
        	return ;
    	}
		
	},
	getUser: function() {
		var uid = od.base.getUid(true);
		
		$.ajax({
			type:"get",
			dataType: "json",
			url: od.host + "/oneday/user/getUserInfo",
			async:true,
			success: od.base.onGetUserInfoSuccess,
			error: function(e){
				console.log(e);
				alert(e);
			},
			timeout:1000
		});
		
	},
	onGetUserInfoSuccess: function(data) {
		console.log(data);
	},
	viewPool : {},
	currentViewId : "",
	forward: function(pageId, direction) {
		direction = direction || 'left';
	
		//页面向左平移
		var currentViewStart = "translate3d(0,0,0)", //currentView初始位置
			applyViewStart = "translate3d(100%,0,0)", //applyView初始位置
			currentViewEnd = "translate3d(-100%,0,0)", //currentView的最终位置
			applyViewEnd = "translate3d(0,0,0)"; //applyView最终位置
		//页面向右平移
		if(direction == "right") {
			currentViewStart = "translate3d(0,0,0)";
			applyViewStart = "translate3d(-100%,0,0)";
			currentViewEnd = "translate3d(100%,0,0)";
			applyViewEnd = "translate3d(0,0,0)"
		}
	
		//获取当前页面的DOM对象
		var currentView = od.base.viewPool[od.base.currentViewId];
		//获取新页面的DOM对象
		var applyView = od.base.viewPool[pageId];
	
		//设置新页面的初始位置
		applyView.style.webkitTransform = applyViewStart;
		//设置当前页面的初始位置
		currentView.style.webkitTransform = currentViewStart;
	
		//设置新页面显示
		applyView.style.display = "";
	
		var t1 = setTimeout(function() {
			//当设置最终位置时，页面就会以过渡效果平移到最终位置
			applyView.style.webkitTransform = applyViewEnd;
			currentView.style.webkitTransform = currentViewEnd;
		}, 100);
	
		var t2 = setTimeout(function() {
	
			//400ms后，页面平移结束，设置currentView为隐藏
			currentView.style.display = "none";
			//将新页面设置为当前页面
			od.base.currentViewId = pageId;
	
			if(direction === 'left') {
				window.location.hash = od.base.currentViewId;
			}
	
			window.clearTimeout(t1);
			window.clearTimeout(t2);
		}, 300);
	},
	bindTapEvent:function(){
        var isMove;
        var that = this;
        document.addEventListener("touchstart",function(){
            isMove = false;
        },false);
        document.addEventListener("touchmove",function(){
            isMove = true;
        },false);
        document.addEventListener("touchend",function(){
            if (!isMove){
                var target = event.target;
                if (target.className === "back iback"){
                    history.back();
                }
            }
        },false);


    },
    initViewPool:function(){
        var views = document.querySelectorAll(".pageview");
           //通过call使用数组的forEach来遍历NodeList
        Array.prototype.forEach.call(views,function(item){
            //viewPool是一个全局对象
            od.base.viewPool[item.id] = item; //将DOM的id作为键
        });
    },
    //初始化执行
    inits:function(){
        od.base.initViewPool();
    }
}
$(document).ready(function(){
	document.addEventListener("plusready",function() {
		od.base.inits();
	},false);
});


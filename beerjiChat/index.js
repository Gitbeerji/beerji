//用户信息
var beerji = {};

var config = {
  syncURL: "https://beerjichat.wilddogio.com/" //输入节点 URL
};
wilddog.initializeApp(config);
var ref = wilddog.sync().ref();

var userRef = ref.child("user");

var msgRef = ref.child("message");


//执行
$(function(){
	
	addEvent();
});


//绑定事件
function addEvent(){	
	//进入聊天室按钮判断是否有用户信息事件
	$(".enter-btn").click(isregister);
	
	//开始聊天按钮写入信息事件
	$(".start-btn").click(login);
	
	//发送消息按钮事件
	$("#send-btn").click(sendMsg);
	
	msgRef.on('child_added', function(data) {renderChat(data);});
}

//是否存在username
function islogin(){
	var username = localStorage.getItem('beerjiname');
	if(username){
		return username;
	}else{
		return false;
	}
}

//是否注册
function isregister(){
	beerji.name = islogin();
	if( beerji.name){
		$(".welcome").hide();
	}else{
		$(".welcome").hide();
		$(".login").show();
	}
}

//写入用户姓名
function  login(){
	var name = $("#username").val().trim();
	if(!name){alert("请填写昵称！");return;}
	//写入信息
	addUser(name);
}

//Sync写入用户
function addUser(name){
	//向sync写入信息
	userRef.push({
		'name': name
	}).then(function(){
		//本地写入信息
		localStorage.setItem('beerjiname',name);
		beerji.name = name;
		$(".login").hide();
	});
}

//Sync写入消息
function sendMsg(){
	var content = $("#send-text").val().trim();
	if(content.length === 0){ return;}
	
	//向sync写入信息
	msgRef.push({
		'content': content,
		'username': beerji.name
	}).then(function(){
		$("#send-text").val("");
	});
}


//渲染聊天内容
function renderChat(data){
	var html = '';
	beerji.name = islogin();
	if(data.val().username === beerji.name){
		html += '<div class="mine-item">';
	}else{
		html += '<div class="c-item">';
	}
	html += '<div class="icon"><span>'+data.val().username.charAt(0)+'</span></div><div class="text"><span></span><div>'+data.val().content+'</div></div></div>';
	$(".chat-list").append($(html));
}

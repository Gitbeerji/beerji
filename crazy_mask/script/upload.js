
//创建图片与canvas
var img = new Image();

//var rawCanvas = document.getElementById("raw");

//绘制展示所选择的图片CANVAS
img.onload = function(){	
	var canvas = document.createElement("canvas");
	//计算原始图片的宽和高
	var nw = img.naturalWidth, nh = img.naturalHeight;
	var ctx = canvas.getContext('2d');
	//设定canvas画布的宽
	var rswidth = canvas.width = 1240;
	canvas.height = rswidth*nh/nw;
	ctx.drawImage(img, 0, 0, nw, nh, 0, 0, rswidth, rswidth*nh/nw);
	//将canvas转为base64编码
	//var src = canvas.toDataURL("image/jpeg",1);
	$(".img-container").empty().append(canvas);
	$(".change-btn").show();
};

//文件input值改变
$("#uimg").change(function(){
	var file = this;
	var reader = new FileReader();
	reader.onload = function(evt){
		img.src = evt.target.result;
	}
	reader.readAsDataURL(file.files[0]);
});

$(".btn_sub").click(function(){
	randerImg();
});


//点击底部确认按钮
function randerImg(){
	rander(checkForm());
}


//验证表单
function checkForm(){
	//1.验证是否有图片
	if(!$("#uimg").val()){
		alert('请上传图片');
		return false;
	};
	//2.验证是否填写魔法语录
	//if( !$(".note_when").val().trim() || !$(".note_say").val().trim()){
	//	alert("请填写魔法语录");
	//	return false;
	//}
	
	return [$(".note_when").val().trim(), $(".note_say").val().trim()];
}


//绘制最终图片
function rander(arr){
	if(!arr) return ;
	var canvas = document.createElement("canvas");
	//计算原始图片的宽和高
	var nw = img.naturalWidth, nh = img.naturalHeight;
	var ctx = canvas.getContext('2d');
	//设定canvas画布的宽
	var rswidth = canvas.width = 1340;
	var imgheight = rswidth*nh/nw;
	canvas.height = imgheight + 600;
	
	//绘制背景颜色
	ctx.fillStyle = "#FFFFFF";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	//绘制背景颜色
	ctx.fillStyle = "#ACDEF7";
	ctx.fillRect(50, 50, canvas.width - 100, canvas.height - 100);	
	
	//绘制图片边框
	ctx.fillStyle = "#D1601C"
	ctx.fillRect(50, 50, canvas.width - 100, imgheight - 100);
	
	//绘制图片
	ctx.drawImage(img, 0, 0, nw, nh, 60, 60, rswidth - 120, rswidth*nh/nw - 120);
	
	//绘制文字
	ctx.fillStyle = "#F8BE03";
	ctx.font = "normal normal bolder 80px arial";
	var str = '我在'+arr[0]+'的时候敷面膜~';
	drawText(str,ctx,imgheight-120);
	
	//绘制文本
  	ctx.fillText('“膜”法语录:', 500, imgheight + 70);
  	
  	
  	
  	drawTextLong(arr[1],ctx,imgheight+160);
  	//ctx.fillText(arr[1], 560, imgheight+160);
	load(ctx,canvas,imgheight);
}

function drawText(str,ctx,height){
	var text = ctx.measureText(str); // TextMetrics object
	//console.dir(text);
  	ctx.fillText(str, (1340-text.width)/2, height);
}

function drawTextLong(str,ctx,height){
	var arr = [];
	var _str = 'xx';
	var i = 0;
	while( _str) {
		_str = str.slice(i,i+12);
		arr.push(_str);
		i += 12; 
	}
	ctx.font = "normal normal bolder 60px arial";
	
	arr.pop(arr.length - 1);
	arr.forEach(function(text,index){
		ctx.fillText(text, 550, height+index*80);
	});
}

function load(ctx,canvas,imgheight){
	var img = $(".qcode-img")[0];
	if( img.complete){
		drawCode(img,ctx,canvas,imgheight);
	}else{
		img.onload = function(){
			drawCode(img,ctx,canvas,imgheight);
		};
		img.onerror = function(){
			alert('出现错误，请重试');
		}
	}
}

function drawCode(img,ctx,canvas,imgheight){
	//绘制二维码图片
	ctx.drawImage(img, 0, 0, 400, 400, 100, imgheight+10, 380, 380);
	
	//绘制二维码下的文字
	ctx.fillStyle = "#FFFFFF";
	ctx.font = "normal normal bolder 50px arial";
	ctx.fillText('识别二维码参与活动', 70, imgheight+460);
	
	var strDataURI = canvas.toDataURL("image/jpeg");
	//将canvas转为base64编码
	//var src = canvas.toDataURL("image/jpeg",1);
	//document.write(src);
	$(".show-canvas img").attr('src',strDataURI);
	//$(".show-canvas").empty().append(canvas);
	$(".upload-wrap").hide();
	$(".show-wrap").show();
	//saveImageInfo(canvas);
}


function saveImageInfo (mycanvas){  
    var image = mycanvas.toDataURL("image/png");  
    var w = window.open('about:blank','image from canvas');  
    w.document.write("<img src='"+image+"' alt='from canvas'/>");  
}  
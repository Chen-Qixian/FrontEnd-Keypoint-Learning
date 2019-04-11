var arr=[0,1,2,3,4,5,6,7,8,9]; //存放数和字符作为随机库
var canvasStr , valueRight ; //生成的验证码序列字符串
var VCLEN = 6; //验证码长度
var myCanvas; //画布
var ctx; //画笔

function drawLine(){
    ctx.beginPath(); //开始绘制
    ctx.clearRect(0,0,myCanvas.width,myCanvas.height); //清空画布区域，坐标点(x1,y1,x2,y2)
    ctx.lineWidth = 15; //规定宽度
    ctx.strokeStyle = '#ccc'; //规定线条颜色
    ctx.moveTo(Math.floor(Math.random()*30) , Math.floor(Math.random()*80)); //规定起点
    ctx.lineTo(250+Math.floor(Math.random()*20) , Math.floor(Math.random()*80)); //规定终点
    ctx.stroke(); //绘制
    ctx.globalCompositeOperation = 'lighter'; //源图像与目标图像叠加显示
    ctx.closePath(); //结束绘制
}

function fillVerificationCode(){
    //若要进行平移、放缩、旋转、错切、裁剪等操作，需再其前后增加save()和restore()。
    ctx.save();
    ctx.beginPath();
    var x = myCanvas.width / 2;
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ddd';
    ctx.font = '46px Roboto Slab';
    ctx.setTransform(1 , -0.12 , 0.2 , 1 , 0 , 12); //将文字设置倾斜效果
    ctx.fillText(canvasStr , x , 60); //参数：内容，开始点坐标x,y
    ctx.restore();
}

function createCanvas(){
    var len = arr.length;
    canvasStr = ''; //每次绘制前必须清空验证码串
    valueRight = '';
    for(var i = 0 ; i < VCLEN ; i ++){ //生成验证码
        var text = arr[Math.floor(Math.random() * len)];
        canvasStr += (text + " "); //画布上的验证码之间有空格
        valueRight += text;
    }

    myCanvas = $('#myCanvas')[0]; //从html中获取Canvas元素
    ctx = myCanvas.getContext('2d'); //创建二维画笔，方法返回一个用于在画布上绘图的环境

    drawLine(); //绘制干扰用线条
    fillVerificationCode(); //绘制验证码字符
}

function bindEvent(){
    //为提交绑定鼠标点击事件
    $('.submit').on('click',function(){
        //获取输入
        var value = $('.inp').val().trim(); //trim()会去掉内容前后的空白
        //先判断是否输入为空
         if(value == '' || value == null || value == undefined){
             // show()可以取消display:none  html(text)可以改变html里的内容
             $('.errorText').show().html('Please input context.');
             // css()可以修改选中元素的样式，用','分割，内容需要用''包含。
             $('.icon').css({
                 display: 'inline-block',
                 backgroundImage: 'url("images/false.png")'
             });
         }
         else{
             // 判断是否与目标相一致
             if(value == valueRight){
                 $('.icon').css({
                     display: 'inline-block',
                     backgroundImage: 'url("images/true.png")'
                 });
                 createCanvas(); //可以用向后端反馈验证成功信息代替之
             }
             else{
                $('.errorText').show().html('Wrong verification code!<br>Please check and input again!.');
                $('.icon').css({
                    display: 'inline-block',
                    backgroundImage: 'url("images/false.png")'
                });
             }
         }
    })
    //为刷新按钮添加鼠标点击事件
    $('.refresh').on('click',function(){
        createCanvas();
        //add()用于添加一个元素到jQuery对象。fadeOut()淡出（逐渐消失）
        $('.errorText').add('.icon').fadeOut(100);
    });
    //错误提示后鼠标再次聚焦消除错误提示
    $('.inp').focus(function(){
        $('.errorText').add('.icon').fadeOut(100);
    });
}

function init(){
    for(var i = 65 ; i < 122 ; i ++){ //生成随机库
        if(i > 90 && i < 97){
            continue;
        }
        arr.push(String.fromCharCode(i));//向随机库中压入字符
    }
    createCanvas(); //绘制验证码
    bindEvent(); //绑定鼠标点击响应
}

window.onload = function(){
    init(); //主函数入口
}
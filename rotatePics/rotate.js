$(function(){
    let offset = 0;
    // 定时器
    let timer;
    // 需要单独编写一个自动播放函数
    function autoPlay(){
        timer = setInterval(function(){
            offset += -10;
            $('ul').css("marginLeft" , offset + "px");
            // 判断当4张图片全部移除后,再将头部移回初始位置.
            if(offset == -1200){
                offset = 0;
            }
        },50);
    }
    autoPlay();
    $('li').hover(function(){
        // li监听移入事件，清除定时器
        clearInterval(timer);
        // 注意每个动画前先调用stop()清除动画队列
        // fadeTo是褪色效果，指定时长与变成的透明度
        $(this).siblings().stop().fadeTo(50 , 0.5);
        $(this).stop().fadeTo(50 , 1);
    },function(){
        $('li').stop().fadeTo(50 , 1);
        autoPlay();

    })
})
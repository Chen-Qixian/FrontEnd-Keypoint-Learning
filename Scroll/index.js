(function(){
    var ele_container = document.getElementsByClassName('container')[0];
    var ele_content = document.getElementsByClassName('content')[0];
    var ele_duration = document.getElementsByClassName('duration')[0];
    var ele_bar = document.getElementsByClassName('bar')[0];
    var percentH = Math.floor((ele_container.offsetHeight / ele_content.offsetHeight) * ele_duration.offsetHeight);
    ele_bar.style.height = percentH + 'px';
    
    function contentMove(item){
        var percentHeight = item.offsetTop / (ele_duration.offsetHeight - item.offsetHeight);
        var moveH = percentHeight * Math.floor(ele_content.offsetHeight - ele_container.offsetHeight);
        ele_content.style.top = -moveH + 'px';
    }

    function scrollDrage(item){
        item.onmousedown = function(e){
            e = e || window.event;
            e.preventDefault();
            var e_y = e.pageY;
            document.onmousemove = function(e){
                var chay = e.pageY - e_y;
                item.style.top = item.offsetTop + chay + 'px';
                e_y = e.pageY;

                if(item.offsetTop <= 0){
                    item.style.top = 0 + 'px';
                }
                else if(item.offsetTop + item.offsetHeight >= ele_duration.offsetHeight){
                    item.style.top = ele_duration.offsetHeight - item.offsetHeight + 'px';
                }
                contentMove(item);
            }  
        }
        document.onmouseup = function(){
            document.onmousemove = null;
        }
    }

    function scrollClick(item){
        var ele_scroll = document.getElementsByClassName('scroll')[0];
        var speed = 5;
        ele_scroll.onclick = function(e){
            // console.log(e.target.id);
            if(e.target.id == 'up_img'){
                item.style.top = item.offsetTop - speed + 'px';
                if(item.offsetTop <= 0){
                    item.style.top = 0 + 'px';
                }
            }
            else if(e.target.id == 'down_img'){
                item.style.top = item.offsetTop + speed + 'px';
                if(item.offsetTop + item.offsetHeight >= ele_duration.offsetHeight){
                    item.style.top = ele_duration.offsetHeight - item.offsetHeight + 'px';
                }
            }
            contentMove(item);
        }
    }
    
    function scrollWheel(container , item){
        var speed = 5;
        container.onmousewheel = function(e){
            console.log(e.wheelDelta); //上下滑动滑轮
            if(e.wheelDelta > 0){ //向上滑动滑轮
                item.style.top = item.offsetTop - speed + 'px';
                if(item.offsetTop <= 0){
                    item.style.top = 0 + 'px';
                }
            }
            else{
                item.style.top = item.offsetTop + speed + 'px';
                if(item.offsetTop + item.offsetHeight >= ele_duration.offsetHeight){
                    item.style.top = ele_duration.offsetHeight - item.offsetHeight + 'px';
                }
            }
            contentMove(item);
        }
        
    }

    function init(){
        scrollDrage(ele_bar);
        scrollClick(ele_bar);
        scrollWheel(ele_container , ele_bar);
    }
    init();
})();
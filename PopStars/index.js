var table; //游戏桌面
var squareWidth = 50; //方块宽高
var boardWidth = 10; //行列数
var squareSet = []; //方块信息集合（二维数组）每个元素保存该方块的全部信息
var baseScore = 5; //第一块的分数
var stepScore = 10; //每多一块的累加分数
var totalScore = 0; //当前总分
var targetScore = 1500; //目标分

var choose = []; //选中的连通小方块
var timer = null; //闪烁定时器
var flag = true; //锁，防止点击事件中响应其他点击或移入时间
var tempSquare = null; //临时方块

function refresh(){ //重绘画板，每次鼠标点击后刷新
    for(var i = 0 ; i < squareSet.length ; i ++){
        for(var j = 0 ; j < squareSet[i].length ; j ++){
            if(squareSet[i][j] == null) continue; // 点击后数组中可能有空值需要跳过
            squareSet[i][j].row = i; //更新当前的行列数
            squareSet[i][j].col = j;
            squareSet[i][j].style.backgroundImage = "url(./pic/" + squareSet[i][j].num + ".png)"
            squareSet[i][j].style.backgroundSize = "cover"; //占满范围
            squareSet[i][j].style.transform = "scale(0.95)"; //美观效果让不同星星之间留出空隙（缩小至0.95倍大小）
            squareSet[i][j].style.left = squareSet[i][j].col * squareWidth + "px"; // 别忘了加"px"
            squareSet[i][j].style.bottom = squareSet[i][j].row * squareWidth + "px";
            squareSet[i][j].style.transition = "left 0.3s, bottom 0.3s";
        }
    }
}

function createSquare(value,row,col){ //创建小方块，传入参数为颜色、行、列，初始化时使用。
    var temp = document.createElement('div'); //创建div dom对象
    temp.style.height = squareWidth + "px"; 
    temp.style.width = squareWidth + "px";
    temp.style.display = "inline-block"; //需要让对象元素能排列一排
    temp.style.position = "absolute"; //相对于背景绝对定位
    temp.style.boxSizing = "border-box"; //重要：不会使增加的边框溢出覆盖到旁边的元素
    temp.style.borderRadius = "12px";
    temp.num = value;
    temp.col = col;
    temp.row = row;
    return temp; //返回这个创建出来的对象
}

function goBack(){ //还原样式
    if(timer != null){ //清空计时器
        clearInterval(timer);
    }
    for(var i = 0 ; i < squareSet.length ; i ++){
        for(var j = 0 ; j < squareSet[i].length ; j ++){
            if(squareSet[i][j] == null) continue;
            squareSet[i][j].style.border = "0px solid white";
            squareSet[i][j].style.transform = "scale(0.95)";
        }
    }
}

function checkLinked(square , arr){ // 递归连通图算法
    if(square == null) return; // 递归边界
    arr.push(square); // 将当前方块放入选中数组中
    // check left
    if( square.col > 0 && //未到边界
        squareSet[square.row][square.col - 1] && //左侧有块
        squareSet[square.row][square.col - 1].num == square.num && //颜色相同
        arr.indexOf(squareSet[square.row][square.col - 1]) == -1) { //不在choose中，避免循环判断
            checkLinked(squareSet[square.row][square.col - 1] , arr);
        }
    // check right
    if( square.col < boardWidth - 1 &&
        squareSet[square.row][square.col + 1] &&
        squareSet[square.row][square.col + 1].num == square.num &&
        arr.indexOf(squareSet[square.row][square.col + 1]) == -1) {
            checkLinked(squareSet[square.row][square.col + 1] , arr);
        }
    // check up
    if( square.row < boardWidth - 1 &&
        squareSet[square.row + 1][square.col] &&
        squareSet[square.row + 1][square.col].num == square.num &&
        arr.indexOf(squareSet[square.row + 1][square.col]) == -1) {
            checkLinked(squareSet[square.row + 1][square.col] , arr);
        }
    // check down
    if( square.row > 0 &&
        squareSet[square.row - 1][square.col] &&
        squareSet[square.row - 1][square.col].num == square.num &&
        arr.indexOf(squareSet[square.row - 1][square.col]) == -1) {
            checkLinked(squareSet[square.row - 1][square.col] , arr);
        }
}

function flicker(arr){ // 选中连通的小方块可以闪烁
    var num = 0;
    timer = setInterval(function(){
        for(var i = 0 ; i < arr.length ; i ++){
            arr[i].style.border = "3px solid #BFEFFF";
            arr[i].style.transform = "scale(" + (0.9 + (0.05 * Math.pow(-1 , num))) + ")";
        }
        num ++; // 注意这里所采用的数学技巧，仍然使用transform:scale(val)来进行缩放。
    },300);
}

function selectScore(){ //可以显示当前选中小方块的得分
    var score = 0;
    for(var i = 0 ; i < choose.length ; i ++){
        score += (baseScore + i * stepScore);
    }
    if(score == 0) return;
    document.getElementById('selectScore').innerHTML = choose.length + " blocks " + score + " points";
    document.getElementById('selectScore').style.opacity = 1;
    document.getElementById('selectScore').style.transition = null;
    // 设置时间间隔1秒后显示消失的过渡动画
    setTimeout(function(){
        document.getElementById('selectScore').style.opacity = 0;
        document.getElementById('selectScore').style.transition = "opacity 1s";
    },1000);
}

function mouseOver(obj){ //鼠标移入区域响应
    // 加锁，点击事件过程中不允许其他点击事件与移入事件 
    if(!flag){
        tempSquare = obj;
        return;
    }
    // 还原所有样式
    goBack();
    // 检查相邻
    choose = [];
    checkLinked(obj , choose);
    if(choose.length <= 1){
        choose = [];
        return;
    }
    // 闪烁
    flicker(choose);
    // 显示分数
    selectScore();
}

function move(){ //下落移动控制
    //纵向下落，采用快慢指针算法
    for(var i = 0 ; i < boardWidth ; i ++){
        var pointer = 0; //慢指针
        for(var j = 0 ; j < boardWidth ; j ++){
            if(squareSet[j][i] != null){ //按行遍历
                if(pointer != j){ //快慢指针不同步说明中间有空元素
                    squareSet[pointer][i] = squareSet[j][i]; //慢指针设成快指针元素
                    squareSet[j][i].row = pointer;
                    squareSet[j][i] = null; //快指针处置空
                }
                pointer ++; //该行非空时慢指针增加
            }
        }
    }
    // 横向移动（当出现一列为空时）
    for(var i = 0 ; i < squareSet[0].length ;){ // 注意循环终止条件的判断！！！因为数组长度会更新
        if(squareSet[0][i] == null){ //逻辑：只需判断最低层为空，该行则全为空
            for(var j = 0 ; j < boardWidth ; j ++){
                squareSet[j].splice(i , 1); //splice删除数组squareSet[j]中从i开始的1个元素
            }
            continue;//注意移动后i不应改变了
        }
        i ++;
    }
    refresh();
}

function isFinish(){ //判断游戏结束
    flag = true; //重要：需要先解锁，保证后续鼠标事件可以被响应
    for(var i = 0 ; i < squareSet.length ; i ++){
        for(var j = 0 ; j < squareSet[i].length ; j ++){
            if(squareSet[i][j] == null) continue; //遍历每一元素判断连通
            var temp = [];
            checkLinked(squareSet[i][j] , temp);
            if(temp.length > 1) return false; //若有某一元素仍有多块连通，则游戏未结束
        }
    }
    return flag;
}

function init(){ // JS调用入口
    table = document.getElementById('pop_star'); // 获取到最外层的父元素作为桌面
    document.getElementById('targetScore').innerHTML = "Target Score : " + targetScore; //显示目标分数用innerHTML
    // 循环初始化星星区域
    for(var i = 0 ; i < boardWidth ; i ++){
        squareSet[i] = new Array(); //二维数组的创建，对每一个元素new Array()创建新数组
        for(var j = 0 ; j < boardWidth ; j ++){
            var square = createSquare(Math.floor(Math.random() * 5) , i , j);
            // 鼠标移入事件
            square.onmouseover = function(){
                mouseOver(this);
            }
            // 鼠标点击事件
            square.onclick = function(){
                //对锁进行控制
                if(!flag || choose.length == null){
                    return;
                }
                flag = false;
                tempSquare = null;
                //更新分数
                var score = 0;
                for(var i = 0 ; i < choose.length ; i ++){
                    score += (baseScore + i * stepScore);
                }
                totalScore += score;
                document.getElementById('nowScore').innerHTML = "Current Score : " + totalScore;
                //为移除增加一个延迟动画，为了防止闭包，这里采用立即执行函数
                for(var i = 0 ; i < choose.length ; i ++){
                    (function(i){
                        setTimeout(function(){
                            squareSet[choose[i].row][choose[i].col] = null; //为状态数组置空
                            table.removeChild(choose[i]); //将其从桌面上移除
                        } , i * 50);  
                    })(i);
                }
                //需要等星星消除完毕后再移动，故需增加一个延迟
                setTimeout(function(){
                    move(); //调用移动函数
                    setTimeout(function(){
                        var judge = isFinish(); 
                        if(judge){  //游戏达到结束条件
                            if(totalScore > targetScore){
                                alert('Congratulations! You win!');
                            }
                            else{
                                alert('Mission Failed!');
                            }
                        }
                        else{
                            flag = true;
                            choose = [];
                            mouseOver(tempSquare); //处理可能存在的冲突
                        }
                    },300 + choose.length * 75); //需要一个判断延迟
                },choose.length * 50);
            }
            squareSet[i][j] = square; //必须将新创建的方块放回到数组中
            table.appendChild(square); //需要将创建的新元素添加到桌面上
        }
        
    }
    refresh(); //每次页面内容发生变化需要重绘页面
}

window.onload = function(){ 
    init();
}   // window.onload 保证了在页面全部加载完毕后再执行JS代码
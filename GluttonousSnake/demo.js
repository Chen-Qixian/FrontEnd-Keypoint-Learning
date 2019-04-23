var gameGround;
var snake = [];
var squareType = {
    head: {value: 0, url: 'img/0.png'},
    body: {value: 1, url: 'img/1.png'}
};
var timer;
var stepTime = 350;
var snakeToward = {
    down: {x: 0 , y: -30},
    up: {x: 0 , y: 30},
    left: {x: -30 , y: 0},
    right: {x: 30 , y: 0}
};
var nowToward = snakeToward.right;

function move(){
    renderSquare(snake[0],squareType.body);
    var temp = snake.pop();
    temp.style.left = snake[0].offsetLeft + nowToward.x + 'px';
    temp.style.top  = snake[0].offsetTop  + nowToward.y + 'px';
    snake.unshift(temp);

}

function run(){
    clearTimeout(timer);
    timer = setTimeout(function(){
        // if(){

        // }else if(){

        // }
        // else{

        // }
        move();
    },stepTime);
}

function createSquare(row,col,type){
    var square = document.createElement('div');
    gameGround.classList.add('square');
    square.style.left = col * 30 + 'px';
    square.style.top  = row * 30 + 'px';
    renderSquare(square,type);
    gameGround.appendChild(square);
    return square;
}

function createSnake(){
    var head = createSquare(0,3,squareType.head);
    var body1 = createSquare(0,2,squareType.body);
    var body2 = createSquare(0,1,squareType.body);
    var body3 = createSquare(0,0,squareType.body);
    snake = [head,body1,body2,body3];
}

function init(){
    gameGround = document.getElementById('gameGround');
    createSnake();
    run();
    document.onkeydown = function(e){
        
    }
}

window.onload = function(){
    init();
}
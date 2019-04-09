(function(){
    var btn_images = document.getElementsByTagName('input');
    var cubeNode= document.getElementsByClassName('cube')[0];
    var ClassList = cubeNode.classList;
    var currentClass = ClassList[1];
    
    for(var i = 0,len = btn_images.length ; i < len ; i ++){
        btn_images[i].addEventListener('click' , clickFn);
    }

    function clickFn(e){
        var target_className = e.target.className;
        console.log(target_className);
        if(target_className != currentClass){
            ClassList.replace(currentClass , target_className);
            currentClass = target_className;
            console.log(currentClass);
        }
    }
})();
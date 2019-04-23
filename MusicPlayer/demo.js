var obj={
    init:function(){
        this.moon = document.getElementsByClassName('moon')[0];
        this.sun  = document.getElementsByClassName('sun')[0];
        this.bindEvent();
    },
    bindEvent:function(){
        var moon = this.moon;
        var body = document.getElementsByTagName('body')[0];
        var dis;
        var self = this;
        moon.onmousedown = function(e){
            dis = e.clientX - moon.offsetLeft;
            flag = true;
        };
        body.onmousemove = function(e){
            if(!flag) return;
            moon.style.left = e.clientX - dis + 'px';
        };
        body.onmouseup = function(e){
        
        };
    },
    getPer:function(){
        var self = this;
        var per;
        var d = moon.clientWidth,
        mL = moon.offsetLeft,
        mR = moon.offsetLeft + d,
        sL = sun.offsetLeft,
        sR = sun.offsetLeft + d;
        if(mL > sR || mR < sL){
            per = 0;
        }
        else{
            if(sL < mL){
                per = (sR - mL) / d;
            }
            else if(mR > sL){
                per = (mR - sL) / d;
            }
        }
        self.change(per);
    },
    change:function(){
        var audio = document.getElementsByTagName('audio')[0];
        var body = document.getElementsByTagName('body')[0];
        var moon = this.moon;
        per > 0 ? audio.play():audio.pause();
        audio.volumn = per;
        moon.style.background = "hsl(194,66%," + (1 - per) * 60 + "%)"
    }
}

obj.function();
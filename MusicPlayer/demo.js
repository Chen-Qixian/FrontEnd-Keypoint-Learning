var obj = {
    init:function(){
        // 这里与jquery不同，字符串直接写类名即可，无需在前面加.
        this.moon = document.getElementsByClassName('moon')[0];
        this.sun  = document.getElementsByClassName('sun')[0];
        this.bindEvent();
    },
    bindEvent:function(){
        var moon = this.moon;
        var body = document.getElementsByTagName('body')[0];
        var dis;
        var self = this;
        var flag = false;
        moon.onmousedown = function(e){
            dis = e.clientX - moon.offsetLeft;
            flag = true;
        };
        body.onmousemove = function(e){
            if(!flag) return;
            moon.style.left = (e.clientX - dis) + 'px';
            self.getPer();
        };
        body.onmouseup = function(e){
            flag = false;
        };
    },
    getPer:function(){
        var self = this; 
        var sun = self.sun;
        var moon = self.moon;
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
    change:function(vol){
        var audio = document.getElementsByTagName('audio')[0];
        var body = document.getElementsByTagName('body')[0];
        var per = document.getElementsByClassName('per')[0];
        var moon = this.moon;
        vol > 0 ? audio.play():audio.pause();
        audio.volume = vol;
        var str = "Volume:" + (vol*100).toPrecision(4) + "%";
        per.innerHTML = str;
        moon.style.background = "hsl(194,66%," + (1 - vol) * 60 + "%)";
        body.style.background = "hsl(" + (194 + Math.floor(166*vol)) + ", 66%," + (1 - vol) * 50 + "%)";
    }
}

obj.init();
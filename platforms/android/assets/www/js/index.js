// var app = {
//     // Application Constructor
//     initialize: function() {
//         this.bindEvents();
//     },
//     // Bind Event Listeners
//     //
//     // Bind any events that are required on startup. Common events are:
//     // 'load', 'deviceready', 'offline', and 'online'.
//     bindEvents: function() {
//         document.addEventListener('deviceready', this.onDeviceReady, false);
//     },
//     // deviceready Event Handler
//     //
//     // The scope of 'this' is the event. In order to call the 'receivedEvent'
//     // function, we must explicitly call 'app.receivedEvent(...);'
//     onDeviceReady: function() {
        //code here
//     },
//     // Update DOM on a Received Event
//     receivedEvent: function() {

//     }
// };

// app.initialize();

var ttt = {
    bodyElement:document.getElementById("container"),
    animateElement:document.getElementById("loading"),
    canvas:document.getElementById("canvas"),
    w:window.innerWidth,
    ctx:this.canvas.getContext("2d"),
    disableList:[],
    bigWinList:[],
    playerStatus:true,
    addDisableList:function(){
        for(var i = 1; i <= 81; i++){
            //-1 is no one use this
            ttt.disableList.push(-1);
        }
    },
    addBigWinList:function(){
        for(var i = 1; i<=9; i++){
            ttt.bigWinList.push(-1);
        }
    },
    point:function(x,y){
        this.x = x;
        this.y = y;
    },
    reset:function(){
        this.disableList = [];
        this.bigWinList = [];
        this.playerStatus = true;
        this.addDisableList();
        this.addBigWinList();
    },
    

    showBody: function(){
        setTimeout(show,900,this.animateElement,this.bodyElement);
        function show(animateElement,bodyElement){
            animateElement.setAttribute('style','display:none;');
            bodyElement.setAttribute('style', 'display:block;');
        }
        this.addDisableList();
        this.addBigWinList();
        this.draw();
        this.menu();
    },
    draw:function(){
        this.canvas.width = this.w;
        this.canvas.height = this.w;
        this.ctx.beginPath();

        drawBigPath(this.w,this.ctx);
        drawSmallPath(this.w,this.ctx);

        function drawBigPath(w,ctx){
            drawPath(0,0,w,w,true,ctx);
        };

        function drawSmallPath(w,ctx){
            for(var i = 1;i<=3;i++){
                for(var k = 1;k<=3;k++){
                    drawPath((k-1)*w/3+5,(i-1)*w/3+5,k*w/3-5,i*w/3-5,false,ctx);
                }
            }
        };

        function drawPath(startX,startY,endX,endY,bigPath,ctx){
            var width = endX - startX;
            var height = endY - startY;
            for(var i = 1;i<3;i++){
                if(!bigPath){
                    ctx.moveTo(5+startX,height/3*i+startY);
                    ctx.lineTo(width-5+startX,height/3*i+startY);
                    ctx.lineWidth = 1;
                    ctx.stroke();

                    ctx.moveTo(width/3*i+startX,0+5+startY);
                    ctx.lineTo(width/3*i+startX,height-5+startY);
                    ctx.stroke();
                }
                else{
                    ctx.moveTo(5+startX,height/3*i+startY);
                    ctx.lineTo(width-5+startX,height/3*i+startY);
                    ctx.lineWidth = 3;
                    ctx.stroke();

                    ctx.moveTo(width/3*i+startX,0+5+startY);
                    ctx.lineTo(width/3*i+startX,height-5+startY);
                    ctx.stroke();
                }
            }
        };

        this.click();
    },
    click:function(){
        this.canvas.addEventListener('click',getClickPoint,false);
        function getClickPoint(){
            var clickPoint = new ttt.point(event.pageX,event.pageY);
            //console.log(clickPoint.x, clickPoint.y);
            getClickSquare(clickPoint,ttt.w);
        };
        function getClickSquare(clickPoint,w){
            for(var i = 1;i<=3;i++){
                for(var k = 1;k<=3;k++){
                    var bTopLeftP = new ttt.point((k-1)*w/3+5,(i-1)*w/3+5);
                    var bBotRightP = new ttt.point(k*w/3-5,i*w/3-5);
                    if(bTopLeftP.x < clickPoint.x && clickPoint.x < bBotRightP.x && bTopLeftP.y < clickPoint.y && clickPoint.y < bBotRightP.y){
                        //console.log(bTopLeftP.x+" "+bTopLeftP.y)
                        for(var x = 1;x <= 3;x++){
                            for(var y = 1; y <= 3; y++){
                                var width = bBotRightP.x - bTopLeftP.x;
                                var sTopLeftP = new ttt.point(width/3*(x-1)+5+bTopLeftP.x, width/3*(y-1)+5+bTopLeftP.y);
                                var sBotRightP = new ttt.point(width/3*x-5+bTopLeftP.x, width/3*y-5+bTopLeftP.y);
                                if(sTopLeftP.x < clickPoint.x && clickPoint.x < sBotRightP.x && sTopLeftP.y < clickPoint.y && clickPoint.y < sBotRightP.y){
                                    var key = (i-1)*3*9 + (k-1)*9 + (y-1)*3 + (x-1);
                                    var value = -1;
                                    if(ttt.playerStatus == true){
                                        value = 1;
                                    }
                                    else{
                                        value = 0;
                                    }
                                    if(ttt.checkDisableSmallSquare(ttt.disableList,key)){
                                        if(ttt.playerStatus == true)
                                        {
                                            //player1 is circle
                                            ttt.drawCircle(sTopLeftP,sBotRightP,'small');
                                            ttt.updateDisableSmallSquare(ttt.disableList,key,value);
                                            if(ttt.checkSmallWin(ttt.disableList,key,value)){
                                                ttt.drawCircle(bTopLeftP,bBotRightP,'big');
                                                ttt.updateBigWinList(ttt.bigWinList,(i-1)*3+k-1,value);
                                                if(ttt.checkBigWin(ttt.bigWinList,value)){
                                                    alert('player1 win!!!');
                                                    ttt.reset();
                                                    ttt.draw();
                                                }
                                            }
                                        }
                                        else
                                        {
                                            //player2 is cross
                                            ttt.drawCross(sTopLeftP,sBotRightP,'small');
                                            ttt.updateDisableSmallSquare(ttt.disableList,key,value);
                                            if(ttt.checkSmallWin(ttt.disableList,key,value)){
                                                ttt.drawCross(bTopLeftP,bBotRightP,'big');
                                                ttt.updateBigWinList(ttt.bigWinList,(i-1)*3+k-1,value);
                                                if(ttt.checkBigWin(ttt.bigWinList,value)){
                                                    alert('player2 win!!!');
                                                    ttt.reset();
                                                    ttt.draw();
                                                }
                                            }
                                        }
                                        ttt.changePlayerStatus();
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };
    },
    changePlayerStatus:function(){
        //status true is player 1, status false is player2
        if(this.playerStatus == true){
            this.playerStatus = false;
        }
        else{
            this.playerStatus = true;
        }
    },
    menu:function(){
        document.getElementById("menu-btn").addEventListener('click',function(){
            document.getElementById("menu").setAttribute('style','opacity:1; display:block');
            ttt.restart();
            ttt.cancle();
            ttt.playOffline();
        });

    },
    restart:function(){
        document.getElementById("restart").addEventListener('click',function(){
            ttt.reset();
            ttt.draw();
            document.getElementById("menu").setAttribute('style','opacity:0; display:none');
        });
    },
    cancle:function(){
        document.getElementById("cancle").addEventListener('click',function(){
            document.getElementById("menu").setAttribute('style','opacity:0; display:none');
        }); 
    },
    playOnline:function(){

    },
    playOffline:function(){
        document.getElementById("playOffline").addEventListener('click',function(){
            ttt.reset();
            ttt.draw();
            document.getElementById("menu").setAttribute('style','opacity:0; display:none');
        })
    },
    connect:function(){

    },
    drawCircle:function(topLeftP,botRightP,drawStyle){
        var radius = (botRightP.x - topLeftP.x)/2;
        var centerP =new this.point((topLeftP.x + botRightP.x)/2,(topLeftP.y + botRightP.y)/2)
        this.ctx.beginPath();
        this.ctx.arc(centerP.x, centerP.y, radius, 0, 2 * Math.PI, false);
        if(drawStyle=='small'){
            this.ctx.lineWidth = 2;
            this.ctx.strokeStyle = '#000000';
        }
        else{
            this.ctx.lineWidth = 4;
            this.ctx.strokeStyle = '#ff0000';
        }
        this.ctx.stroke();
    },
    drawCross:function(topLeftP,botRightP,drawStyle){
        this.ctx.beginPath();
        this.ctx.moveTo(topLeftP.x,topLeftP.y);
        this.ctx.lineTo(botRightP.x,botRightP.y);
        this.ctx.moveTo(botRightP.x,topLeftP.y);
        this.ctx.lineTo(topLeftP.x,botRightP.y);
        if(drawStyle=='small'){
            this.ctx.lineWidth = 2;
            this.ctx.strokeStyle = '#000000';
        }
        else{
            this.ctx.lineWidth = 4;
            this.ctx.strokeStyle = '#ff0000';
        }
        this.ctx.stroke();
    },
    checkSmallWin:function(disableList,key,value){
        //1 and true is player1, 0 and false is player2
        var startNumber = parseInt(key/9)*9;
        return this.checkWin(disableList,startNumber,value);
    },
    checkBigWin:function(bigWinList,value){
        return this.checkWin(bigWinList,0,value);
    },
    checkWin:function(disableList,startNumber,value){
        if(disableList[startNumber] == value && disableList[startNumber+1] == value && disableList[startNumber+2] == value){
            return true;
        }
        if(disableList[startNumber+3] == value && disableList[startNumber+4] == value && disableList[startNumber+5] == value){
            return true;
        }
        if(disableList[startNumber+6] == value && disableList[startNumber+7] == value && disableList[startNumber+8] == value){
            return true;
        }
        if(disableList[startNumber] == value && disableList[startNumber+3] == value && disableList[startNumber+6] == value){
            return true;
        }
        if(disableList[startNumber+1] == value && disableList[startNumber+4] == value && disableList[startNumber+7] == value){
            return true;
        }
        if(disableList[startNumber+2] == value && disableList[startNumber+5] == value && disableList[startNumber+8] == value){
            return true;
        }
        if(disableList[startNumber] == value && disableList[startNumber+4] == value && disableList[startNumber+8] == value){
            return true;
        }
        if(disableList[startNumber+2] == value && disableList[startNumber+4] == value && disableList[startNumber+6] == value){
            return true;
        }
    },
    checkDisableSmallSquare:function(disableList,key){
        var check = false;
        if(disableList[key] == -1){
            check = true;
        }
        return check;
    },
    updateDisableSmallSquare:function(disableList,key,value){
        disableList[key] = value;
    },
    updateBigWinList:function(bigWinList,key,value){
        //var number = key*9;
        for(var i = 0; i < 9; i++){
            ttt.disableList[key*9+i] = value;
        }
        bigWinList[key] = value;
    }
};

ttt.showBody();
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
    point:function(x,y){
        this.x = x;
        this.y = y;
    },
    

    showBody: function(){
        setTimeout(show,900,this.animateElement,this.bodyElement);
        function show(animateElement,bodyElement){
            animateElement.setAttribute('style','display:none;');
            bodyElement.setAttribute('style', 'display:block;');
        }
        this.draw();
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
            console.log(clickPoint.x, clickPoint.y);
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
                                    if(ttt.checkDisableSmallSquare(ttt.disableList,sTopLeftP,sBotRightP)){
                                        if(ttt.getDrawCircleOrCross())
                                        {
                                            ttt.drawCircle(sTopLeftP,sBotRightP);
                                        }
                                        else
                                        {
                                            ttt.drawCross(sTopLeftP,sBotRightP);
                                        }
                                        ttt.disableList.push([sTopLeftP,sBotRightP]);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };
    },
    getDrawCircleOrCross:function(){
        if(this.status == false){
            this.status = true;
        }
        else{
            this.status = false;
        }
        return !this.status;
    },
    menu:function(){

    },
    singleOrMultiple:function(){

    },
    connect:function(){

    },
    drawCircle:function(topLeftP,botRightP){
        var radius = (botRightP.x - topLeftP.x)/2;
        var centerP =new this.point((topLeftP.x + botRightP.x)/2,(topLeftP.y + botRightP.y)/2)
        this.ctx.beginPath();
        this.ctx.arc(centerP.x, centerP.y, radius, 0, 2 * Math.PI, false);
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    },
    drawCross:function(topLeftP,botRightP){
        this.ctx.moveTo(topLeftP.x,topLeftP.y);
        this.ctx.lineTo(botRightP.x,botRightP.y);
        this.ctx.moveTo(botRightP.x,topLeftP.y);
        this.ctx.lineTo(topLeftP.x,botRightP.y);
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    },
    checkWin:function(player){
        //1 and true is player1, 0 and false is player2

    },
    checkDisableSmallSquare:function(disableList,topLeftP,botRightP){
        var check = true;
        for(var i = 0;i < disableList.length; i++){
            if(topLeftP.x == disableList[i][0].x && topLeftP.y == disableList[i][0].y && botRightP.x == disableList[i][1].x && botRightP.y == disableList[i][1].y){
                check = false;
            }
        }
        return check;
    },
    changeSmallSquareStatus:function(){

    }
};

ttt.showBody();

document.getElementById("menu-btn").addEventListener('click',function(){
    console.log("click");
    document.getElementById("menu").setAttribute('style','opacity:1; display:block');
    
});
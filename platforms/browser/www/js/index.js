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

document.getElementById("menu-btn").addEventListener('click',function(){
    console.log("click");
    document.getElementById("menu").setAttribute('style','opacity:1; display:block');
    
});

var bodyElement = document.getElementById("container");
var animateElement = document.getElementById("loading");
var canvas = document.getElementById("canvas");

var w = window.innerWidth;

canvas.width = w;
canvas.height = w;

var ctx = canvas.getContext("2d");
ctx.beginPath();

var time = 0;

drawBigPath();
drawSmallPath();

function point(x,y){
    this.x = x;
    this.y = y;
}

function drawBigPath(){
    drawPath(0,0,w,w,true);
}

function drawSmallPath(){
    for(var i = 1;i<=3;i++){
        for(var k = 1;k<=3;k++){
            drawPath((k-1)*w/3+5,(i-1)*w/3+5,k*w/3-5,i*w/3-5,false);
            //console.log(((k-1)*(w-10)/3+5)+' '+((i-1)*(w-10)/3+5))
        }
    }
}

function drawPath(startX,startY,endX,endY,bigPath){
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
    time++;
}

setTimeout(function(){
    animateElement.setAttribute('style','display:none;');
    bodyElement.setAttribute('style', 'display:block;');
},900)

function drawCircle(topLeftP,botRightP){
    var radius = (botRightP.x - topLeftP.x)/2;
    var centerP = new point((topLeftP.x + botRightP.x)/2,(topLeftP.y + botRightP.y)/2)
    ctx.beginPath();
    ctx.arc(centerP.x, centerP.y, radius, 0, 2 * Math.PI, false);
    ctx.lineWidth = 2;
    ctx.stroke();
}

function drawCross(){

}

function getClickSquare(clickPoint){
    for(var i = 1;i<=3;i++){
        for(var k = 1;k<=3;k++){
            var bTopLeftP = new point((k-1)*w/3+5,(i-1)*w/3+5);
            var bBotRightP = new point(k*w/3-5,i*w/3-5);
            if(bTopLeftP.x < clickPoint.x && clickPoint.x < bBotRightP.x && bTopLeftP.y < clickPoint.y && clickPoint.y < bBotRightP.y){
                //console.log(bTopLeftP.x+" "+bTopLeftP.y)
                for(var x = 1;x <= 3;x++){
                    for(var y = 1; y <= 3; y++){
                        var width = bBotRightP.x - bTopLeftP.x;
                        var sTopLeftP = new point(width/3*(x-1)+5+bTopLeftP.x, width/3*(y-1)+5+bTopLeftP.y);
                        var sBotRightP = new point(width/3*x-5+bTopLeftP.x, width/3*y-5+bTopLeftP.y);
                        if(sTopLeftP.x < clickPoint.x && clickPoint.x < sBotRightP.x && sTopLeftP.y < clickPoint.y && clickPoint.y < sBotRightP.y){
                            getDrawCircleOrCross(sTopLeftP,sBotRightP);
                        }
                    }
                }
            }
        }
    }
}

function getDrawCircleOrCross(topLeftP,botRightP){
    console.log(topLeftP.x+" "+botRightP.y);
    drawCircle(topLeftP,botRightP);
}

canvas.addEventListener('click', function(event) {
    var clickPoint = new point(event.pageX,event.pageY);
    console.log(clickPoint.x, clickPoint.y);
    getClickSquare(clickPoint);
}, false);


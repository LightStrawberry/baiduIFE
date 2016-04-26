var ships = new Array();

$(document).ready(function(){
    var shipCount = 0;
    addEvent(document.getElementById("ship-fly"),"click",newShip);
    function newShip(){
        shipCount++;
        ships[shipCount] = new spaceShip(shipCount,100,false,false);
        ships[shipCount].newShip();
    }
    var startButton = document.getElementById("startButton");
    startButton.addEventListener("click", startRun, false);

    function startRun() {
        ships[shipCount].start();
    }

    var stopButton = document.getElementById("stopButton");
    stopButton.addEventListener("click", stop, false);

    function stop() {
        clearTimeout(ships[shipCount].runTimer);
    }

    var destroyButton = document.getElementById("destroyButton");
    destroyButton.addEventListener("click", destroy, false);

    function destroy() {
        var shipid = '#ship'+shipCount;
        $(shipid).remove();
    }
});

function spaceShip(shipid,energy,state,destroy) {
            this.shipid = shipid;
            this.energy = energy;
            this.state = state;
            this.destroy = destroy;
        }
        spaceShip.prototype.newShip = function () {
            $('.center').append( "<div class='ship' id='ship"+ this.shipid +"'><a id='power'></a></div>");
        }
        spaceShip.prototype.start = function () {
            var radius = getRandomInt(200, 400);
            this.runTimer = addTrack(this.shipid,radius);
            this.powerTimer = updatePower(this.shipid);
        };

function addEvent(obj,type,handle){
    try{  // Chrome、FireFox、Opera、Safari、IE9.0及其以上版本
        obj.addEventListener(type,handle,false);
    }catch(e){
        try{  // IE8.0及其以下版本
          obj.attachEvent('on' + type,handle);
        }catch(e){  // 早期浏览器
          obj['on' + type] = handle;
        }
    }
}

//随机数函数
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function addTrack(shipid, radius){
    var shipid = 'ship'+shipid;
    var ship = document.getElementById(shipid);
    var deg = 90;
    var timer = null;
    var radius = radius; // 旋转半径

    timer = setInterval(function() {
        var radian = (2*Math.PI/360)*deg;
        var keyDeg = deg+90;
        var theTop = Math.ceil(Math.sin(radian)*radius);
        var theLeft = Math.ceil(Math.cos(radian)*radius);
        var l = radian * radius;

        console.log(l);

        ship.style.top = theTop + 'px';
        ship.style.left = theLeft + 'px';
        ship.style.transform = 'rotate(' + keyDeg + 'deg)';

        deg += 0.1;
        if (deg === 361) {
          deg = 0;
        }
    },1);
    return timer;
}

function updatePower(shipid){
    var power = 100;
    var shipchar = '#ship'+shipid + ' > a';
    var powerPanel = $(shipchar);
    timer = setInterval(function(){
      power += 1;
      powerPanel.text(power);
      console.log(power);
      if(power <= 0)
      {
          power = 0;
          clearTimeout(ships[shipid].runTimer);
          clearTimeout(ships[shipid].powerTimer); //这里不应该这样写 明天改
      }
      if(power >= 100)
      {
          power = 100;
      }
    },1000);
    return timer;
}

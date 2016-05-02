function initkeyboard() {
    //Capture the keyboard arrow keys
    var left = keyboard(37),
        up = keyboard(38),
        right = keyboard(39),
        down = keyboard(40);
    var nextPosition = {};
    function checkCollision(nextPosition) {
        if(map[nextPosition.x][nextPosition.y] == 2) return false;
        return true;
    }
    //Left arrow key `press` method
    left.press = function() {
        nextPosition = {x:  (player.x - blockSize) / blockSize, y: (player.y) / blockSize};
        if(checkCollision(nextPosition)) {
            player.x += -blockSize;
            player.y += 0;
            drawLOS();
        }
    };
    //Up
    up.press = function() {
        nextPosition = {x:  (player.x) / blockSize, y: (player.y - blockSize) / blockSize};
        if(checkCollision(nextPosition)) {
            player.x += 0;
            player.y += -blockSize;
            drawLOS();
        }
    };
    //Right
    right.press = function() {
        nextPosition = {x:  (player.x + blockSize) / blockSize, y: (player.y) / blockSize};
        if(checkCollision(nextPosition)) {
            player.x += blockSize;
            player.y += 0;
            drawLOS();
        }
    };
    //Down
    down.press = function() {
        nextPosition = {x:  (player.x) / blockSize, y: (player.y + blockSize) / blockSize};
        if(checkCollision(nextPosition)) {
            player.x += 0;
            player.y += blockSize;
            drawLOS();
        }
    };
}

function keyboard(keyCode) {
    var key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    //The `downHandler`
    key.downHandler = function(event) {
        if (event.keyCode === key.code) {
            if (key.isUp && key.press) key.press();
            key.isDown = true;
            key.isUp = false;
    }
        event.preventDefault();
    };
    //The `upHandler`
    key.upHandler = function(event) {
        if (event.keyCode === key.code) {
            if (key.isDown && key.release) key.release();
            key.isDown = false;
            key.isUp = true;
        }
        event.preventDefault();
    };
    //Attach event listeners
    window.addEventListener(
        "keydown", key.downHandler.bind(key), false
    );
    window.addEventListener(
        "keyup", key.upHandler.bind(key), false
    );
    return key;
}

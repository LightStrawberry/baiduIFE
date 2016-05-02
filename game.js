var blockSize = 16;
var width = window.innerWidth;
var height = window.innerHeight;
var map_width = Math.floor(width / blockSize);
var map_height = Math.floor(height / blockSize);

PIXI.SCALE_MODES = PIXI.SCALE_MODES.NEAREST;
var world = document.getElementById('world');
//var ctx = world.getContext("2d");
var renderer = new PIXI.CanvasRenderer(width, height, {view:world});
document.body.appendChild(renderer.view);
var stage = new PIXI.Container();
stage.scale = new PIXI.Point(3, 3);
var camera = new Camera(stage, new Vector2(0, 0));

initmap();

PIXI.loader
  .add("images/cat.png")
  .load(setup);

function setup() {
    //Create the `player` sprite
    player = PIXI.Sprite.fromImage("images/player.png");
    downstair = PIXI.Sprite.fromImage("images/downstair.png");
    upstair = PIXI.Sprite.fromImage("images/upstair.png");
    stage.addChild(downstair);
    stage.addChild(upstair);
    stage.addChild(player);
    camera.follow(player, player.width / 2, player.height / 2);

    setup_player();
    drawLOS();
    //drawCalculatedEdges();
    initkeyboard();
    enemy_init();
    //Start the game loop
    gameLoop();
}

function gameLoop() {
    //drawLOS();
    requestAnimationFrame(gameLoop);
    camera.update();
    stage.position = new PIXI.Point(-camera.position.x, -camera.position.y);
    renderer.render(stage);
    drawCalculatedEdges();
}

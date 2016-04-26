var blockSize = 16;
var width = window.innerWidth;
var height = window.innerHeight;
var map_width = Math.floor(width / blockSize);
var map_height = Math.floor(height / blockSize);

PIXI.SCALE_MODES = PIXI.SCALE_MODES.NEAREST;
var renderer = new PIXI.CanvasRenderer(width, height);
document.body.appendChild(renderer.view);
var stage = new PIXI.Container();
stage.scale = new PIXI.Point(1, 1);
var camera = new Camera(stage, new Vector2(0, 0));

renderer.render(stage);
initmap();

PIXI.loader
  .add("images/tiles.png")
  .load(setup);

function setup() {
    //Create the `player` sprite
    player = PIXI.Sprite.fromImage("images/cat.png");
    downstair = PIXI.Sprite.fromImage("images/downstair.png");
    upstair = PIXI.Sprite.fromImage("images/upstair.png");
    stage.addChild(downstair);
    stage.addChild(upstair);
    stage.addChild(player);
    camera.follow(player, player.width / 2, player.height / 2);

    setup_player();

    initkeyboard();
    //Start the game loop
    gameLoop();
}

function gameLoop() {
    requestAnimationFrame(gameLoop);
    //camera.update();
    //stage.position = new PIXI.Point(-camera.position.x, -camera.position.y);
    renderer.render(stage);
}

function enemy_init() {

    for(var i = 0; i < rnd(3, 8); i++) {
        var enemy_room_num = rnd(1, select_rooms.length - 1);

        enemy = PIXI.Sprite.fromImage("images/cat.png");


        enemy.position.x = (select_rooms[enemy_room_num].position_x +
        Math.floor(select_rooms[enemy_room_num].width / 2)) * blockSize;
        enemy.position.y = (select_rooms[enemy_room_num].position_y +
        Math.floor(select_rooms[enemy_room_num].height / 2)) * blockSize;

        stage.addChild(enemy);
    }
}

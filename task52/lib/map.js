var map = [];
var rooms = [];
var select_rooms = [];
var graph, edges = [];
var vertices = [];
var spanningTree = {};

function initmap() {
    for (x = 0; x < map_width; x++) {
        map[x] = []
        for (y = 0; y < map_height; y++) map[x][y] = 0;
    }
    for(i = 0; i < 500; i++) generate_floor();
    select_room();
    delaunay();
    min_spanning_trees();
}

function _floor(width, height, position_x, position_y) {
    this.width = width;
    this.height = height;
    this.position_x = position_x;
    this.position_y = position_y;
};

function generate_floor() {
    //var floor = new PIXI.Graphics();
    var width = rnd(2, 8);
    var height = rnd(2, 8);
    var x_position = rnd(2, map_width - 8);
    var y_position = rnd(2, map_height - 8);

    function check_block()
    {
        for (var i = 0; i < width && i + x_position < map_width; i++) {
            for (var j = 0; j < height && j+ y_position < map_height; j++) {
                if(map[x_position + i][y_position + j] == 1) return false;
            }
        }
        return true;
    }
    if(check_block())
    {
        for(var i = 0; i < width && i + x_position < map_width ; i++ ) {
            for(var j = 0; j < height && j+ y_position < map_height ; j++) map[i + x_position][j + y_position] = 1;
        }
        var room = new _floor(width, height, x_position,y_position);
        rooms.push(room);
    }
}

function select_room() {
    for (x = 0; x < map_width; x++) {
        map[x] = []
        for (y = 0; y < map_height; y++) map[x][y] = 0;
    }

    for(var i =0; i < rooms.length; i++) {
        if(rooms[i].width >= 4 && rooms[i].height >= 4) {
            select_rooms.push(rooms[i]);
        }
    }
    // set map data
    for(var k = 0; k < select_rooms.length; k++) {
        for(var i = 0; i < select_rooms[k].width; i++ ) {
            for(var j = 0; j < select_rooms[k].height; j++) map[i + select_rooms[k].position_x][j + select_rooms[k].position_y] = 1;
        }
    }
}

function delaunay() {
    for(var i = 0; i < select_rooms.length; i++) {
        vertices[i] = [select_rooms[i].position_x + select_rooms[i].width/2, select_rooms[i].position_y + select_rooms[i].height/2];
    }
    var triangles = Delaunay.triangulate(vertices);
    console.log(triangles);

    for (var i = triangles.length-1; i > 0; i -= 3)
    {
        var _edgelength = edgelength(triangles[i], triangles[i-1]);
        if(check_edge(_edgelength)) {
            edges.push(new Edge(new Vertex(triangles[i]), new Vertex(triangles[i-1]), _edgelength));
        }
        var _edgelength = edgelength(triangles[i], triangles[i-2]);
        if(check_edge(_edgelength)) {
            edges.push(new Edge(new Vertex(triangles[i]), new Vertex(triangles[i-2]), edgelength(triangles[i], triangles[i-2])));
        }
        var _edgelength = edgelength(triangles[i-1], triangles[i-2]);
        if(check_edge(_edgelength)) {
            edges.push(new Edge(new Vertex(triangles[i-1]), new Vertex(triangles[i-2]), edgelength(triangles[i-1], triangles[i-2])));
        }
    }
}

function edgelength (a, b) {
    var width = Math.abs(vertices[a][0] - vertices[b][0]);
    var height = Math.abs(vertices[a][1] - vertices[b][1]);
    return Math.sqrt(Math.pow(width,2) + Math.pow(height,2));
}

function check_edge(length) {
    for(i = edges.length - 1; i >= 0 ; i--) {
        if(edges[i].distance == length) return false;
    }
    return true;
}

function min_spanning_trees() {
    graph = new Graph(edges, select_rooms.length);
    spanningTree = prim(graph);
    console.log(spanningTree);

    for(var i = 0; i < spanningTree.edges.length; i++) {
        var close_x = false;
        var close_y = false;
        var graphics = new PIXI.Graphics();
        var large_x,
            large_y,
            small_x,
            small_y;

        var delta_x = Math.abs(select_rooms[parseInt(spanningTree.edges[i].e)].position_x - select_rooms[spanningTree.edges[i].v].position_x);
        var delta_y = Math.abs(select_rooms[parseInt(spanningTree.edges[i].e)].position_y - select_rooms[spanningTree.edges[i].v].position_y);

        if(select_rooms[parseInt(spanningTree.edges[i].e)].position_x >= select_rooms[spanningTree.edges[i].v].position_x)
        {
            if(delta_x < select_rooms[spanningTree.edges[i].v].width && delta_x < select_rooms[parseInt(spanningTree.edges[i].e)].width) close_x = true;
        } else {
            if(delta_x < select_rooms[parseInt(spanningTree.edges[i].e)].width && delta_x < select_rooms[spanningTree.edges[i].v].width) close_x = true;
        }
        if(select_rooms[parseInt(spanningTree.edges[i].e)].position_y >= select_rooms[spanningTree.edges[i].v].position_y)
        {
            if(delta_y < select_rooms[parseInt(spanningTree.edges[i].e)].height && delta_y < select_rooms[spanningTree.edges[i].v].height) close_y = true;
        } else {
            if(delta_y < select_rooms[spanningTree.edges[i].v].height && delta_y < select_rooms[parseInt(spanningTree.edges[i].e)].height) close_y = true;
        }
        if(select_rooms[parseInt(spanningTree.edges[i].e)].position_x > select_rooms[spanningTree.edges[i].v].position_x) {
            large_x = select_rooms[parseInt(spanningTree.edges[i].e)];
            small_x = select_rooms[spanningTree.edges[i].v];
        } else if(select_rooms[parseInt(spanningTree.edges[i].e)].position_x < select_rooms[spanningTree.edges[i].v].position_x){
            large_x = select_rooms[spanningTree.edges[i].v];
            small_x = select_rooms[parseInt(spanningTree.edges[i].e)];
        } else {
            if(select_rooms[parseInt(spanningTree.edges[i].e)].width > select_rooms[spanningTree.edges[i].v].width) {
                large_x = select_rooms[parseInt(spanningTree.edges[i].e)];
                small_x = select_rooms[spanningTree.edges[i].v];
            } else {
                large_x = select_rooms[spanningTree.edges[i].v];
                small_x = select_rooms[parseInt(spanningTree.edges[i].e)];
            }
        }
        if(select_rooms[parseInt(spanningTree.edges[i].e)].position_y > select_rooms[spanningTree.edges[i].v].position_y) {
            large_y = select_rooms[parseInt(spanningTree.edges[i].e)];
            small_y = select_rooms[spanningTree.edges[i].v];
        } else if(select_rooms[parseInt(spanningTree.edges[i].e)].position_y < select_rooms[spanningTree.edges[i].v].position_y) {
            large_y = select_rooms[spanningTree.edges[i].v];
            small_y = select_rooms[parseInt(spanningTree.edges[i].e)];
        } else {
            if(select_rooms[parseInt(spanningTree.edges[i].e)].height > select_rooms[spanningTree.edges[i].v].height) {
                large_y = select_rooms[parseInt(spanningTree.edges[i].e)];
                small_y = select_rooms[spanningTree.edges[i].v];
            } else {
                large_y = select_rooms[spanningTree.edges[i].v];
                small_y = select_rooms[parseInt(spanningTree.edges[i].e)];
            }
        }
        if(close_x) {
            var highway_x = large_x.position_x + rnd(0, small_x.width - delta_x - 1);
            var highway_y1 = small_y.position_y + small_y.height;
            var highway_y2 = large_y.position_y;

            for(var l = highway_y1; l < highway_y2; l++ ) {
                map[highway_x][l] = 1;
            }
        } else if (close_y) {
            var highway_y = large_y.position_y + rnd(0, small_y.height - delta_y - 1);
            var highway_x1 = small_x.position_x + small_x.width;
            var highway_x2 = large_x.position_x;

            for(var k = highway_x1; k < highway_x2; k++ ) {
                map[k][highway_y] = 1;
            }
        } else {
            if(large_x != large_y) {
                var highway_x = large_x.position_x + rnd(1, large_x.width - 1);
                var highway_y = small_x.position_y + rnd(1, small_x.height - 1);

                for(var k = small_x.position_x + small_x.width; k < highway_x; k++ ) {
                    map[k][highway_y] = 1;
                }
                for(var v = small_y.position_y + small_y.height; v < highway_y; v++ ) {
                    map[highway_x][v] = 1;
                }
                map[highway_x][highway_y] = 1;
            } else {
                var highway_x = large_x.position_x + rnd(1, large_x.width - 1);
                var highway_y = small_x.position_y + rnd(1, small_x.height - 1);
                for(var k = small_x.position_x + small_x.width; k < highway_x; k++ ) {
                    map[k][highway_y] = 1;
                }
                for(var v = highway_y; v < large_y.position_y; v++ ) {
                    map[highway_x][v] = 1;
                }
                map[highway_x][highway_y] = 1;
            }
        }
    }
    for (var i = 0; i <  map_width; i++) {
        for (var j = 0; j < map_height; j++) {
            if(map[i][j] == 1) {
                var floor = PIXI.Sprite.fromImage("images/floor.png");
                floor.position = new PIXI.Point(i * blockSize,j * blockSize);
                stage.addChild(floor);
                if(map[i-1][j] == 0) {
                    var floor = PIXI.Sprite.fromImage("images/wall.png");
                    floor.position = new PIXI.Point((i-1) * blockSize,j * blockSize);
                    stage.addChild(floor);
                }
                if(map[i+1][j] == 0) {
                    var floor = PIXI.Sprite.fromImage("images/wall.png");
                    floor.position = new PIXI.Point((i+1) * blockSize,j * blockSize);
                    stage.addChild(floor);
                }
            }
        }
    }
    for (var i = 0; i <  map_width; i++) {
        for (var j = 0; j < map_height; j++) {
            if((map[i][j+1] == 1 && map[i][j] != 1) || (map[i][j-1] == 1 && map[i][j] != 1)) {
                var floor = PIXI.Sprite.fromImage("images/wall.png");
                floor.position = new PIXI.Point(i * blockSize,j * blockSize);
                stage.addChild(floor);
            }
        }
    }
}

function setup_player() {
    //set start position
    player.position.x = (select_rooms[parseInt(spanningTree.edges[0].e)].position_x +
    Math.floor(select_rooms[parseInt(spanningTree.edges[0].e)].width / 2)) * blockSize;
    player.position.y = (select_rooms[parseInt(spanningTree.edges[0].e)].position_y +
    Math.floor(select_rooms[parseInt(spanningTree.edges[0].e)].height / 2)) * blockSize;

    //set downstair
    downstair.position.x = (select_rooms[parseInt(spanningTree.edges[0].e)].position_x +
    Math.floor(select_rooms[parseInt(spanningTree.edges[0].e)].width / 2)) * blockSize;
    downstair.position.y = (select_rooms[parseInt(spanningTree.edges[0].e)].position_y +
    Math.floor(select_rooms[parseInt(spanningTree.edges[0].e)].height / 2)) * blockSize;

    //set upstair
    upstair.position.x = (select_rooms[spanningTree.edges[spanningTree.edges.length - 1].v].position_x +
    Math.floor(select_rooms[spanningTree.edges[spanningTree.edges.length - 1].v].width / 2)) * blockSize;
    upstair.position.y = (select_rooms[spanningTree.edges[spanningTree.edges.length - 1].v].position_y +
    Math.floor(select_rooms[spanningTree.edges[spanningTree.edges.length - 1].v].height / 2)) * blockSize;
}

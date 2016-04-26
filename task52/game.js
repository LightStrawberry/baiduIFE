var map = [];
var blockSize = 16;
var rooms = [];
var select_rooms = [];
var graph, edges = [];
var vertices = [];
var spanningTree = {};

Vertex = function (id) {
    this.id = id;
};

Edge = function (e, v, distance) {
    this.e = e;
    this.v = v;
    this.distance = distance;
};

Graph = function (edges, nodesCount) {
    this.edges = edges || [];
    this.nodesCount = nodesCount || 0;
};

function _floor(width, height, position_x, position_y, id) {
    this.width = width;
    this.height = height;
    this.position_x = position_x;
    this.position_y = position_y;
};

var myView = document.getElementById('myCanvas');
PIXI.SCALE_MODES = PIXI.SCALE_MODES.NEAREST;
var renderer = new PIXI.CanvasRenderer(512, 512, {view: myView});
document.body.appendChild(renderer.view);
var stage = new PIXI.Container();
stage.scale = new PIXI.Point(2, 2);
var camera = new Camera(stage, new Vector2(0, 0));

renderer.render(stage);

for (x = 0; x < 32; x++) {
    map[x] = []
    for (y = 0; y < 32; y++) map[x][y] = 0;
}



for(i = 0; i < 500; i++)
{
    generate_floor();
}

function generate_floor() {
    //var floor = new PIXI.Graphics();
    var width = rnd(2, 8);
    var height = rnd(2, 8);
    var x_position = rnd(0, 26);
    var y_position = rnd(0, 26);

    function check_block()
    {
        for (var i = 0; i < width && i + x_position < 32; i++) {
            for (var j = 0; j < height && j+ y_position < 32; j++) {
                if(map[x_position + i][y_position + j] == 1) return false;
            }
        }
        return true;
    }
    if(check_block())
    {
        for(var i = 0; i < width && i + x_position < 32 ; i++ ) {
            for(var j = 0; j < height && j+ y_position < 32 ; j++) map[i + x_position][j + y_position] = 1;
        }
        // floor.lineStyle(0.1, 0x0000FF, 1);
        // floor.beginFill(0xFF700B, 0.5);
        // floor.drawRect(x_position * blockSize, y_position * blockSize, width * blockSize, height * blockSize);

        var room = new _floor(width, height, x_position,y_position);
        rooms.push(room);
        //stage.addChild(floor);
    }
}
select_room();
function select_room() {
    for (x = 0; x < 32; x++) {
        map[x] = []
        for (y = 0; y < 32; y++) map[x][y] = 0;
    }

    for(var i =0; i < rooms.length; i++) {
        if(rooms[i].width >= 4 && rooms[i].height >= 4) {
            select_rooms.push(rooms[i]);
        }
    }
    console.log(select_rooms);
}

for(var k = 0; k < select_rooms.length; k++) {
    for(var i = 0; i < select_rooms[k].width; i++ ) {
        for(var j = 0; j < select_rooms[k].height; j++) map[i + select_rooms[k].position_x][j + select_rooms[k].position_y] = 1;
    }
}
// for(var i = 0; i < 32; i++){
//     console.log(map[i]);
// }

delaunay();
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
    // for(i = triangles.length; i; ) {
    //     ctx.beginPath();
    //     --i; ctx.moveTo(vertices[triangles[i]][0] * blockSize, vertices[triangles[i]][1] * blockSize);
    //     --i; ctx.lineTo(vertices[triangles[i]][0] * blockSize, vertices[triangles[i]][1] * blockSize);
    //     --i; ctx.lineTo(vertices[triangles[i]][0] * blockSize, vertices[triangles[i]][1] * blockSize);
    //     ctx.closePath();
    //     ctx.stroke();
    // }
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

min_spanning_trees();
function min_spanning_trees() {
    graph = new Graph(edges, select_rooms.length);
    spanningTree = prim(graph);
    console.log(spanningTree);

    // var floor = new PIXI.Graphics();
    // for(var i = 0; i < spanningTree.nodesCount - 1; i++) {
    //     floor.lineStyle(0.1, 0x0000FF, 1);
    //     floor.beginFill(0xFF700B, 0.5);
    //     floor.drawRect(select_rooms[parseInt(spanningTree.edges[i].e)].position_x * blockSize,
    //         select_rooms[parseInt(spanningTree.edges[i].e)].position_y * blockSize,
    //         select_rooms[parseInt(spanningTree.edges[i].e)].width * blockSize,
    //         select_rooms[parseInt(spanningTree.edges[i].e)].height * blockSize);
    //
    //     stage.addChild(floor);
    // }

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

        if(select_rooms[parseInt(spanningTree.edges[i].e)].position_x > select_rooms[spanningTree.edges[i].v].position_x)
        {
            if(delta_x < select_rooms[spanningTree.edges[i].v].width) close_x = true;
        } else {
            if(delta_x < select_rooms[parseInt(spanningTree.edges[i].e)].width) close_x = true;
        }
        if(select_rooms[parseInt(spanningTree.edges[i].e)].position_y > select_rooms[spanningTree.edges[i].v].position_y)
        {
            if(delta_y < select_rooms[parseInt(spanningTree.edges[i].e)].height) close_y = true;
        } else {
            if(delta_y < select_rooms[spanningTree.edges[i].v].width) close_y = true;
        }
        if(select_rooms[parseInt(spanningTree.edges[i].e)].position_x > select_rooms[spanningTree.edges[i].v].position_x) {
            large_x = select_rooms[parseInt(spanningTree.edges[i].e)];
            small_x = select_rooms[spanningTree.edges[i].v];
        } else {
            large_x = select_rooms[spanningTree.edges[i].v];
            small_x = select_rooms[parseInt(spanningTree.edges[i].e)];
        }
        if(select_rooms[parseInt(spanningTree.edges[i].e)].position_y > select_rooms[spanningTree.edges[i].v].position_y) {
            large_y = select_rooms[parseInt(spanningTree.edges[i].e)];
            small_y = select_rooms[spanningTree.edges[i].v];
        } else {
            large_y = select_rooms[spanningTree.edges[i].v];
            small_y = select_rooms[parseInt(spanningTree.edges[i].e)];
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
    for(var i = 0; i < 32; i++){
        console.log(map[i]);
    }
}

for (var i = 0; i <  32; i++) {
    for (var j = 0; j < 32; j++) {
        if(map[i][j] == 1) {
            var floor = new PIXI.Graphics();
            floor.lineStyle(0.1, 0x0000FF, 1);
            floor.beginFill(0xFF700B, 0.5);
            floor.drawRect(i * blockSize, j * blockSize, blockSize, blockSize);
            stage.addChild(floor);
        }
    }
}


animate();

function animate() {
    renderer.render(stage);
    requestAnimationFrame( animate );
}

function rnd(start, end) {
    return Math.floor(Math.random() * (end - start) + start);
}

setup();
function setup() {
    //Create the `player` sprite
    player = PIXI.Sprite.fromImage("images/cat.png");
    stage.addChild(player);
    camera.follow(player, player.width / 2, player.height / 2);

    //set start position
    player.position.x = (select_rooms[parseInt(spanningTree.edges[0].e)].position_x +
    Math.floor(select_rooms[parseInt(spanningTree.edges[0].e)].width / 2)) * blockSize;
    player.position.y = (select_rooms[parseInt(spanningTree.edges[0].e)].position_y +
    Math.floor(select_rooms[parseInt(spanningTree.edges[0].e)].height / 2)) * blockSize;

    //Capture the keyboard arrow keys
    var left = keyboard(37),
        up = keyboard(38),
        right = keyboard(39),
        down = keyboard(40);
    var nextPosition = {};
    function checkCollision(nextPosition) {
        if(map[nextPosition.x][nextPosition.y] == 0) return false;
        return true;
    }
    //Left arrow key `press` method
    left.press = function() {
        nextPosition = {x:  (player.x - blockSize) / blockSize, y: (player.y) / blockSize};
        if(checkCollision(nextPosition)) {
            player.x += -blockSize;
            player.y += 0;
        }
    };
    //Up
    up.press = function() {
        nextPosition = {x:  (player.x) / blockSize, y: (player.y - blockSize) / blockSize};
        if(checkCollision(nextPosition)) {
            player.x += 0;
            player.y += -blockSize;
        }
    };
    //Right
    right.press = function() {
        nextPosition = {x:  (player.x + blockSize) / blockSize, y: (player.y) / blockSize};
        if(checkCollision(nextPosition)) {
            player.x += blockSize;
            player.y += 0;
        }
    };
    //Down
    down.press = function() {
        nextPosition = {x:  (player.x) / blockSize, y: (player.y + blockSize) / blockSize};
        if(checkCollision(nextPosition)) {
            player.x += 0;
            player.y += blockSize;
        }
    };
    //Set the game state
    //state = play;
    //Start the game loop
    gameLoop();
}

function gameLoop() {
    requestAnimationFrame(gameLoop);
    camera.update();
    stage.position = new PIXI.Point(-camera.position.x, -camera.position.y);
    renderer.render(stage);
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


function Kruskal(graph) {
    var edges = graph.edges.sort(compare_distance);
    var nodesCount = graph.nodesCount;
    var parents = [];

    for (i = 0; i < nodesCount; i++) parents[i] = 0;

    console.log(edges);
    console.log(parents);

    function compare_distance(a,b) {
      if (a.distance < b.distance) return -1;
      else if (a.distance > b.distance) return 1;
      else return 0;
    }
}

function prim(graph) {
    var graph = graph;
    var queue;
    function compareEdges(a, b) {
        return b.distance - a.distance;
    }
    function init() {
        queue = new Heap(compareEdges);
    }
    return function () {
    init.call(this);
    var inTheTree = {};
    var startVertex = edges[0].e.id;
    var spannigTree = [];
    var parents = {};
    var distances = {};
    var current;
    inTheTree[startVertex] = true;
    queue.add({
        node: startVertex,
        distance: 0,
    });

    for (var i = 0; i < graph.nodesCount - 1; i += 1) {
        current = queue.extract().node;
        inTheTree[current] = true;
        edges.forEach(function (e) {
            if (inTheTree[e.v.id] && inTheTree[e.e.id]) {
                return;
            }
            var collection = queue.getCollection();
            var node;
            //   /console.log(node);
            if (e.e.id === current) {
                node = e.v.id;
            } else if (e.v.id === current) {
                node = e.e.id;
            } else {
                return;
            }
            for (var i = 0; i < collection.length; i += 1) {
                if (collection[i].node === node) {
                if (collection[i].distance > e.distance) {
                    queue.changeKey(i, {
                    node: node,
                    distance: e.distance
                });
                parents[node] = current;
                distances[node] = e.distance;
            }
            return;
        }
    }
    queue.add({
        node: node,
        distance: e.distance
        });
        parents[node] = current;
        distances[node] = e.distance;
    });
    }
    for (var node in parents) {
        spannigTree.push(new Edge(node, parents[node], distances[node]));
    }
        return new Graph(spannigTree, Object.keys(parents).length + 1);
    }();
}

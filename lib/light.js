var startLocation = {};
var _edges = [];
var select_edges = [];
var playerLocation = {};
var oldPlayerPosition = {};

var drawLOS = function(){

    // get center location of player
    playerLocation.x = Math.floor((player.position.x + player.width / 2) / blockSize);
    playerLocation.y = Math.floor((player.position.y + player.height / 2) / blockSize);
    // 输出 当前玩家的 坐标(x,y)格

    if (player.position.x != oldPlayerPosition.x || player.position.y != oldPlayerPosition.y) {
        // Firstly get the generated map
        getMap();

        // Secondly get the edges
        getForwardEdges();

        // Then, calculate the projection
        calculateProjections();

        oldPlayerPosition = { x: player.position.x, y: player.position.y };
    }
}


var getMap = function() {
    var cx = player.position.x / blockSize;
    var cy = player.position.y / blockSize;

    var w = Math.round(Math.ceil(width / blockSize / 3) / 2);
    var h = Math.round(Math.ceil(height / blockSize / 3) / 2);

    var startX = (cx - w - 1) > 0 ? cx - w - 1 : 0;
    var endX = (cx + w - 1) > (width - 2) ? width - 2 : cx + w - 1;
    var startY = (cy - h - 1) > 0 ? cy - h - 1 : 0;
    var endY = (cy + h - 1) > (height - 2) ? height - 2 : cy + h - 1;

    startLocation = { x: startX, y: startY };
    losMapSize = { width:endX - startX + 2, height:endY - startY + 2 };
    console.log(startLocation);

    var i, j;
    losMap = new Array(losMapSize.width);
    for (i = 0; i < losMapSize.width; i++) {
        losMap[i] = new Array(losMapSize.height);
        for(j=0; j<losMapSize.height; j++) {
            if (i==0 || j==0 || i==(losMapSize.width-1) || j==(losMapSize.height-1))
                losMap[i][j] = 2;
            else {
                losMap[i][j] = map[startX + i][startY + j];
            }
        }
    }
    //console.table(losMap);
}

function getForwardEdges() {
    var x, y, i;

    //var _edges = [];
    for (y=0; y< losMapSize.height; y++) {
        for (x = 0; x < losMapSize.width; x++) {
            if (losMap[x][y] == 2) {
                var topLeft = topLeftCorner(x, y);
                // check for up side, data direction >>>
                if ((y-1 >= 0) && (losMap[x][y-1] != 2) && (playerLocation.y -startLocation.y < y))
                    this.addEdge(topLeft, { x: topLeft.x + blockSize, y: topLeft.y});
                // check for down side, data direction <<<
                if ((y+1 < losMapSize.height) && (losMap[x][y+1] != 2) && (playerLocation.y - startLocation.y > y))
                    this.addEdge({ x: topLeft.x + blockSize, y: topLeft.y + blockSize}, { x: topLeft.x, y: topLeft.y + blockSize});
                // check for left side, data direction ^^^
                if ((x-1 >= 0) && (losMap[x-1][y] != 2) && (playerLocation.x - startLocation.x < x))
                    this.addEdge({ x: topLeft.x, y: topLeft.y + blockSize}, { x: topLeft.x, y: topLeft.y});
                // check for right side, data direction vvv
                if ((x+1 < losMapSize.width) && (losMap[x+1][y] != 2) && (playerLocation.x - startLocation.x > x))
                    this.addEdge({ x: topLeft.x + blockSize, y: topLeft.y}, { x: topLeft.x + blockSize, y: topLeft.y + blockSize});
            }
        }
    }

    for (i=_edges.length-1; i>=0; i--) {
        var e = _edges[i];
        var midPosition = { x:(e.p1.x + e.p2.x)/2, y:(e.p1.y + e.p2.y)/2 };
        e.distance = Math.round(Math.sqrt((midPosition.x - player.position.x)*(midPosition.x - player.position.x) + (midPosition.y - player.position.y)*(midPosition.y - player.position.y)));
        _edges[i] = e;
    }

    _edges.sort(function(x, y) {
        return x.distance - y.distance;
    });

    // Connect edges
    for (i=0; i<_edges.length; i++) {
        var eNow = _edges[i];
        if (eNow.prev != -1 && eNow.next != -1)
            continue;
        for(var j=0; j<_edges.length; j++) {
            if (i == j)
                continue;
            var eCheck = _edges[j];
            if (eCheck.prev != -1 && eCheck.next != -1)
                continue;
            if (eNow.p2.x == eCheck.p1.x && eNow.p2.y == eCheck.p1.y) {
                eNow.next = j;
                eCheck.prev = i;
            }
        }
    }
    console.log(_edges);
}

function calculateProjections() {
    var i;
    // Start from the beginning to project lines
    for (i=0; i<_edges.length; i++) {
        var e = _edges[i];
        var abc;
        var intersectionData;
        var lightSource = { x: playerLocation.x * blockSize + blockSize/2 , y: playerLocation.y * blockSize + blockSize/2};

        // Find not connected point for next
        if (e.next == -1) {
            abc = this.getLineABC(e.p2, lightSource);
            intersectionData = this.checkIntersection(abc, e.p2, i);

            // if found intersection point then split the edge at intersection point
            if (intersectionData.intersectID != -1) {
                this.updateEdge(i, intersectionData.intersectID, { x:intersectionData.x, y:intersectionData.y }, true);
            }
        }
        // Find not connected point for prev
        if (e.prev == -1) {
            abc = this.getLineABC(e.p1, lightSource);
            intersectionData = this.checkIntersection(abc, e.p1, i);

            // if found intersection point then split the edge at intersection point
            if (intersectionData.intersectID != -1) {
                this.updateEdge(i, intersectionData.intersectID, { x:intersectionData.x, y:intersectionData.y }, false);
            }
        }
    }
}

function checkIntersection(lineABC, point, currentID) {
    var i,
        p,
        abc;
    var found = false;
    var lightSource = { x: player.x + player.width/2, y: player.y + player.height/2 };

    for (i=0; i<_edges.length; i++) {
        // Skip current point
        if (i != currentID) {
            var edge = _edges[i];
            abc = this.getLineABC(edge.p1, edge.p2);
            p = this.getIntersectionPoint(abc, lineABC);
            if ((p.x == point.x) && (p.y == point.y))   continue;   // Skip current point, confirm
            // check direction, intersections in the middle will be ignored
            if ((lightSource.x > point.x) && (p.x > point.x))   continue;
            if ((lightSource.x < point.x) && (p.x < point.x))   continue;
            if ((lightSource.y > point.y) && (p.y > point.y))   continue;
            if ((lightSource.y < point.y) && (p.y < point.y))   continue;
            // check if the intersection point is not on the edge
            var bigX, bigY, smallX, smallY;
            if (edge.p1.x > edge.p2.x) {
                bigX = edge.p1.x;       smallX = edge.p2.x;
            } else {
                bigX = edge.p2.x;       smallX = edge.p1.x;
            }
            if (edge.p1.y > edge.p2.y) {
                bigY = edge.p1.y;       smallY = edge.p2.y;
            } else {
                bigY = edge.p2.y;       smallY = edge.p1.y;
            }
            // If the intersection point is note on the edge, ignore it
            if ((p.x < smallX) || (p.x > bigX) || (p.y < smallY) || (p.y > bigY))
                continue;
            found = true;
            break;
        } // end if
    } // end for
    // if not found, marked as not found with zero filled
    if (!found) {
        p = { x: 0, y: 0 };
        i = -1;
    }
    // return intersection point and intersect id
    return { x:p.x, y: p.y, intersectID:i};
}

var topLeftCorner = function(x, y) {
    //this.startLocation = startLocation;
    //Center position
    var cx = width/2;
    var cy = height/2;
    // Delta x, y
    // console.log(x,y);
    // console.log(x + startLocation.x);
    // console.log(playerLocation.x);
    var dx = (x + startLocation.x) * blockSize;

    //this.player.pos.x - this.playerLocation.x * this.tileSize
    var dy = (y + startLocation.y) * blockSize;
    return { x: dx, y: dy }
}

var addEdge = function(p1, p2) {
    var edge = new light_edge();
    edge.p1.x = p1.x;   edge.p2.x = p2.x;
    edge.p1.y = p1.y;   edge.p2.y = p2.y;
    _edges.push(edge);
}

var getLineABC = function(pt1, pt2) {
    var abc;
    if ((pt1.y == pt2.y) && (pt1.x == pt2.x)) {
        abc = { a:0, b:0, c:0 };
    } else if (pt1.x == pt2.x) {
        abc = { a:1, b:0, c:-pt1.x }
    } else {
        abc = { a:-(pt2.y - pt1.y) / (pt2.x - pt1.x), b:1, c:pt1.x * (pt2.y - pt1.y) / (pt2.x - pt1.x) - pt1.y };
    }
    return abc;
}

function getIntersectionPoint(abc1, abc2) {
    var p = { x:0, y:0 };
    var x = 0,
        y = 0;
    var a1 = abc1.a, b1 = abc1.b, c1 = abc1.c,
        a2 = abc2.a, b2 = abc2.b, c2 = abc2.c;

    if ((b1 == 0) && (b2 == 0)) {
        return p;
    } else if (b1 == 0) {
        x = -c1;
        y = -(a2 * x + c2) / b2;
    } else if (b2 == 0) {
        x = -c2;
        y = -(a1 * x + c1) / b1;
    } else {
        if ((a1 / b1) == (a2 / b1)) {
            return p;
        } else {
            x = (c1 - c2) / (a2  - a1);
            y = -(a1 * x) - c1;
        }
    }

    p = { x:x, y:y };
    return p;
}

function updateEdge(edgeID, targetEdgeID, p, isNext) {
    // The edge that start the projection
    var edgeStart = _edges[edgeID];
    // The target edge
    var edgeToBeSliced = _edges[targetEdgeID];

    // Calculate for the edge to be kept
    if (isNext) {
        edgeStart.next = targetEdgeID;
        edgeToBeSliced.p1 = p;
        edgeToBeSliced.prev = edgeID;
    } else {
        edgeStart.prev = targetEdgeID;
        edgeToBeSliced.p2 = p;
        edgeToBeSliced.next = edgeID;
    }

    // Update all the 3 edges
    _edges[edgeID] = edgeStart;
    _edges[targetEdgeID] = edgeToBeSliced;
}

function light_edge(p1, p2, prev, next, distance) {
    this.p1 = { x:0, y:0 },
    this.p2 = { x:0, y:0 },
    this.prev = -1,
    this.next = -1,
    this.distance = 0
}

function drawCalculatedEdges() {
    var world = document.getElementById('world');
    var ctx = world.getContext("2d");
    //ctx.strokeRect(0 - width/2, 0 - width/2, width, height);
    var edge = _edges[0];
    var next = edge.next;

    var scale = 1;

    ctx.lineWidth = 5;
    ctx.strokeStyle = 'rgba(255,0,0,0.5)';

    var startRadius = (startRadius == undefined) ? (height/2) : startRadius;
    var endRadius = (endRadius == undefined) ? (height/2) : endRadius;
    startColor = 'rgba(0, 0, 0, 0)';
    endColor = 'rgba(0, 0, 0, 0.55)';

    var grd = ctx.createRadialGradient(width/2 , height/2, startRadius, width/2, height/2, endRadius);
    grd.addColorStop(0, startColor);
    grd.addColorStop(1, endColor);
    ctx.fillStyle = grd;

    ctx.beginPath();
    //console.log(player.position.x,player.position.y);
    ctx.moveTo(-player.position.x, -player.position.y);
    ctx.lineTo(1000,1000);
    // for (var i = 0; i < _edges.length; i++) {
    //     var edge = _edges[i];
    //     ctx.moveTo(edge.p1.x - player.position.x , edge.p1.y - player.position.y);
    //     ctx.lineTo(edge.p2.x - player.position.x , edge.p2.y - player.position.y);
    // }
    // while (next > 0) {
    //     targetEdge = _edges[next];
    //     ctx.lineTo(targetEdge.p1.x - player.position.x , targetEdge.p1.y - player.position.y );
    //     ctx.lineTo(targetEdge.p2.x - player.position.x , targetEdge.p2.y - player.position.y );
    //     next = targetEdge.next;
    // }
    // targetEdge = _edges[next];
    // ctx.lineTo(targetEdge.p1.x - player.position.x , targetEdge.p1.y - player.position.y );
    // ctx.lineTo(targetEdge.p2.x - player.position.x , targetEdge.p2.y - player.position.y );
    ctx.stroke();

    // ctx.fill();
    //
    // ctx.fillStyle = endColor;
    // //ctx.lineTo(edge.p1.x -player.position.x, edge.p1.y -player.position.y);
    // ctx.moveTo(player.position.x -width/2, player.position.y - height/2);
    // ctx.lineTo(player.position.x +width/2, player.position.y - height/2);
    // ctx.lineTo(player.position.x +width/2, player.position.y + height/2);
    // ctx.lineTo(player.position.x -width/2, player.position.y + height/2);
    // ctx.lineTo(player.position.x -width/2, player.position.y - height/2);
    //
    // ctx.fill();
}

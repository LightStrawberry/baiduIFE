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

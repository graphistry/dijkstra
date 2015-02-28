var Heap = require('heap');


/**
 * @param {Graph} graph some graph.
 * @param {uint} source node to search from.
 * @return {Uint32Array} backlinks
 */
function dijkstra(graph, source) {


    var MAX = 10000000;
    if (MAX <= graph.vertices.length) {
        throw new Error('Graph too big for dijkstra');
    }

    var queue = new Heap(function (a, b) { return a.priority - b.priority; });
    var dist = new Uint32Array(graph.vertices.length);
    var prev = new Int32Array(graph.vertices.length);

    var items = [];

    dist[source] = 0;
    graph.vertices.forEach(function(vertex) {
        if (vertex !== source) {
            dist[vertex] = MAX;
            prev[vertex] = -1;
        }
        items[vertex] = { value: vertex, priority: source == vertex ? 0 : dist[vertex] };
        queue.push(items[vertex]);
    });

    while (!queue.empty()) {
        var next = queue.pop().value;
        var dists = graph.vertexToEdges[next];
        graph.vertexToNeighbors[next].forEach(function(neighbor) {
            var alt = dist[next] + dists[neighbor];
            if (alt < dist[neighbor]) {
                dist[neighbor] = alt;
                prev[neighbor] = next;
                var item = items[neighbor];
                item.priority = alt;
                queue.updateItem(item);
            }
        });
    }

    return prev;
}
module.exports.dijkstra = dijkstra;

/**
 * @constructor
 */
function Graph() {
  this.vertexToEdges = {};
  this.vertexToNeighbors = {};
  this.vertices = [];
}
module.exports.Graph = Graph;

Graph.prototype = {

    addVertex: function(vertex) {
        this.vertexToEdges[vertex] = {};
        this.vertexToNeighbors[vertex] = [];
        this.vertices.push(vertex);
    },

    addEdge: function(u, v, distance) {
        this.vertexToEdges[u][v] = distance;
        this.vertexToEdges[v][u] = distance;
        this.vertexToNeighbors[u].push(v);
        this.vertexToNeighbors[v].push(u);
    },

    removeEdge: function (u, v) {
        delete this.vertexToEdges[u][v];
        delete this.vertexToEdges[v][u];
        this.vertexToNeighbors[u] = this.vertexToNeighbors[u].filter(function (i) { return i !== v; });
        this.vertexToNeighbors[v] = this.vertexToNeighbors[v].filter(function (i) { return i !== u; });
    }

};

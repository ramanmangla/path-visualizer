/*
  Represents an undirected, unweighted graph.
*/
class Graph {
  /*
    Creates a graph with numVertices vertices.
    No edges, initially
  */
  constructor(numVertices) {
    this.vertices = [];

    // Create vertices 0, 1, 2, ..., numVertices - 1
    for(let i = 0 ; i < numVertices ; i++){
      let v = new Vertex(i);
      this.vertices.push(v);
    }

    // An array of tuples representing the edges in the graph.
    this.edges = [];

    /*
        Element i of adjacencyList has 2 attributes
        (1) adjacencyList[i].v: Instance of the vertex at index i
        (2) adjacencyList[i].adj: list of vertices adjacent to v
    */
    this.adjacencyList = [];
    for(let i = 0 ; i < numVertices ; i++){
      let vertexObj = {
        v: this.vertices[i],
        adj: []
      }
      this.adjacencyList.push(vertexObj);
    }
  }

  /*
    Adds an edge between vertices numbered v1 and v2
  */
  addEdge(v1, v2){
    // JS doesn't have tuples. So use an array of 2 elements
    const vertex1 = this.vertices[v1];
    const vertex2 = this.vertices[v2];
    const e = [vertex1, vertex2];
    this.edges.push(e);

    this.adjacencyList[v1].adj.push(this.vertices[v2]);
    this.adjacencyList[v2].adj.push(this.vertices[v1]);
  }

  /*
    Resets all vertices of the graph to default values
  */
  reset(){
    this.vertices.forEach(vertex => {
      vertex.color = 'w';
      vertex.isWall = false;
      vertex.distance = Number.MAX_SAFE_INTEGER;
      vertex.parent = null;
    });
  }

  /*
    Makes vertexNum a wall
  */
  makeWall(vertexNum){
    this.vertices[vertexNum].isWall = true;
  }

  /*
    Finds the shortest path between vertex number s and vertex number d in an 
    undirected, unweighted graph.
  */
  dijkstra(s, d){

    this.vertices.forEach((vertex) => {
      vertex.color = 'w';
      vertex.distance = Number.MAX_SAFE_INTEGER;
      vertex.parent = null;
    });

    this.vertices[s].color = 'g';
    this.vertices[s].distance = 0;
    this.vertices[s].parent = null;
    let q = [];
    q.push(this.vertices[s]);

    let destinationFound = false;

    while(q.length != 0){
      let currVertex = q.shift();
      let vertexNum = currVertex.num;

      for(let i = 0 ; i < this.adjacencyList[vertexNum].adj.length ; i++){
        let vertex = this.adjacencyList[vertexNum].adj[i];
        if(vertex.color == 'w' && !vertex.isWall){
          vertex.color = 'g';
          vertex.distance = currVertex.distance + 1;
          vertex.parent = currVertex;

          if(vertex.num === d){
            destinationFound = true;
            break;
          }

          q.push(vertex);
        }
      }

      currVertex.color = 'b';

      if(destinationFound){
        break;
      }
    }

    // We found the destination. Now follow parent pointers back to root to get path
    let v = this.vertices[d];
    let path = [];

    while(v != null){
      path.unshift(v);
      v = v.parent;
    }

    return path;
  }
}

// Vertex Class
class Vertex {
  /*
    Initialzes vertex number 'num'.
    Initially, all vertices are colored "white", have no parent, and are not walls
    They are also "infinitley" away from the source, as they haven't been discovered
  */
  constructor(num) {
    this.num = num;
    // All vertices are
    this.distance = Number.MAX_SAFE_INTEGER;
    // Initially, all vertices are white
    this.color = "w";
    this.parent = null;
    this.isWall = false;
  }
}

function makeGrid(row, col){
  let g = new Graph(col*row);

  for(let i = 0 ; i < row*col ; i++){
    if((i+1) % col !== 0){
      g.addEdge(i, i+1);
    }

    if((i+col) < row*col){
      g.addEdge(i, i+col);
    }
  }

  return g
}


// Test for Graph
let g = new Graph(7);
g.addEdge(0, 1);
g.addEdge(0, 2);
g.addEdge(1, 4);
g.addEdge(2, 3);
g.addEdge(3, 4);
g.addEdge(4, 5);
g.addEdge(5, 6);
g.addEdge(1, 6);
const p = g.dijkstra(0, 1);
p.forEach(vertex => {
  console.log(vertex.num);
});

console.log('-------------------------');

// Test for Wall
g = new Graph(5);
g.addEdge(0, 1);
g.addEdge(1, 2);
g.addEdge(0, 3);
g.addEdge(3, 4);
g.addEdge(4, 2);
g.makeWall(1);
const path = g.dijkstra(0, 2);
path.forEach(vertex => {
  console.log(vertex.num);
});

console.log('-------------------------');

g = makeGrid(4, 5);
console.log(g.adjacencyList);

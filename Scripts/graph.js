// Graph Class
class Graph {
  constructor(vertices, edges, adjacencyList) {
    this.vertices = vertices;
    this.edges = edges;
    this.adjacencyList = adjacencyList;
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

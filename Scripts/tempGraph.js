// Node Class
class Node {
  constructor() {
    // All vertices are
    this.distance = Number.MAX_SAFE_INTEGER;
    // Initially, all vertices are normal
    // Types: wall, start, end, normal
    this.type = "normal";
    // Parent for backtracking
    this.parent = null;
  }
}

// Graph Class
class Graph {
  constructor(rows, cols) {
    this.numOfNodes = rows * cols;
    this.matrix = [];

    for (let i = 0; i < rows; i++) {
      let temp = [];

      for (let j = 0; j < cols; j++) {
        let tempNode = new Node();
        temp.push(tempNode);
      }

      this.matrix.push(temp);
    }

    console.log(this.matrix);
  }
}

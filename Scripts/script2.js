// Left key press state
let mousePressed = false;

// Number of grid cols and rows
let columns;
let rows;

// cell size in pixels
let cellSize = 25;
// Accounting for grid gap
cellSize = cellSize + 5;

// Coordinates [row, col]
let startPoint = [];
let endPoint = [];

// Stores the grid cell that is part of the wall
let walls = [];

// Flags for moving start and end points
let startMove = false;
let endMove = false;

// Graph for grid
let graph;

let grid = $(".grid");

/*
  Makes a graph that is connected like a grid with
  given number of rows and cols
*/
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


/*
  Converts indices in the 2D grid into an index to represent the # of the grid
*/
const indicesToIndex = (row, col) => {
  return row * columns + (col + 1);
};

/*
  Converts the position of the mouse-click into a tuple representing the position
  in the 2D grid 
*/
const positionToIndices = event => {
  // [row, col];
  let indices = [];

  let leftPosition = event.pageX - grid.offset().left;
  let topPosition = event.pageY - grid.offset().top;

  // Indices for graph
  indices[0] = Math.floor(topPosition / cellSize);
  indices[1] = Math.floor(leftPosition / cellSize);

  return indices;
};

/*
  Removes givne class from the cell at the given index
*/
const removeCellClass = (num, className) => {
  $(".grid-cell:nth-child(" + num + ")").removeClass(
    className
  );
};

/*
  Sets the given class to the cell at the given index: (row, col)
*/
const setCellClass = (num, className) => {
  removeCellClass(num, "grid-cell-wall");
  removeCellClass(num, "grid-cell-start");
  removeCellClass(num, "grid-cell-end");
  removeCellClass(num, "grid-cell-visited");
  removeCellClass(num, "grid-cell-path");

  $(".grid-cell:nth-child(" + num + ")").addClass(
    className
  );
};


/*
  Generate the visual grid and add classes and event handlers 
  to the relevant elements.
*/
const gridGeneration = (callbackOne, callbackTwo) => {
  columns = Math.floor(grid.width() / cellSize);
  rows = Math.floor(grid.height() / cellSize);

  startPoint[0] = Math.floor(rows / 2);
  endPoint[0] = Math.floor(rows / 2);
  startPoint[1] = Math.floor(columns / 3);
  endPoint[1] = Math.floor((columns / 3) * 2);

  grid.css("grid-template-columns", "repeat(" + columns + ", 1fr)");
  grid.css("grid-template-rows", "repeat(" + rows + ", 1fr)");

  // Clearing the grid
  grid.html("");

  for(let num = 0 ; num < rows*columns ; num++){
    grid.append('<div class="grid-cell" draggable="false"></div>');
  }

  callbackOne();
  callbackTwo();
};

/*
  Generates an algorithmic representation of the graph.
*/
const generateGraph = () => {
  // Generate grid
  graph = makeGrid(rows, columns);

};

/*
  Sets the relevant event-handlers for the elements of the page
*/
const setEventHandlers = () => {
  // Mouse over (hover into) event for active wall cells
  $(".grid-cell").on("mouseover", event => {
    if (
      mousePressed === true &&
      !$(event.target).hasClass("grid-cell-start") &&
      !$(event.target).hasClass("grid-cell-end") &&
      !startMove &&
      !endMove
    ) {
      $(event.target).addClass("grid-cell-wall");
      let indices = positionToIndices(event);
      let index = indicesToIndex(indices[0], indices[1]);
      graph.makeWall(index-1);
      walls.push(index);
      if(graph.vertices[index-1].isWall === true){
        console.log("wall " + index + " is true");  
      }
      
    }
  });

  // Mouse down event for active wall cells
  $(".grid-cell").on("mousedown", event => {
    if (
      event.button === 0 &&
      !$(event.target).hasClass("grid-cell-start") &&
      !$(event.target).hasClass("grid-cell-end")
    ) {
      mousePressed = true;
      $(event.target).addClass("grid-cell-wall");
      let indices = positionToIndices(event);
      let index = indicesToIndex(indices[0], indices[1]);
      graph.makeWall(index-1);
      walls.push(index);
      if(graph.vertices[index-1].isWall){
        console.log("wall " + index + " is " + graph.vertices[index-1].isWall);  
      }
    } else if (
      event.button === 0 &&
      $(event.target).hasClass("grid-cell-start")
    ) {
      mousePressed = true;
      startMove = true;
    } else if (event.button === 0 && 
      $(event.target).hasClass("grid-cell-end")) {
      mousePressed = true;
      endMove = true;
    }
  });


  $(document).on("mouseup", event => {
    if ($(event.target).hasClass("grid-cell")) {
      if (startMove && !$(event.target).hasClass("grid-cell-wall")) {

        removeCellClass(indicesToIndex(startPoint[0], startPoint[1]), "grid-cell-start");
        $(event.target).removeClass("grid-cell-wall");
        $(event.target).addClass("grid-cell-start");
        startPoint = positionToIndices(event);

      } else if (endMove && !$(event.target).hasClass("grid-cell-wall")) {

        removeCellClass(indicesToIndex(endPoint[0], endPoint[1]), "grid-cell-end");
        $(event.target).removeClass("grid-cell-wall");
        $(event.target).addClass("grid-cell-end");
        endPoint = positionToIndices(event);

      }
    }

    mousePressed = false;
    startMove = false;
    endMove = false;
  });


  $("#clearButton").on("click", () => {
    $(".grid-cell").removeClass("grid-cell-wall");
    graph.reset();
  });

  // Set classes for random start and end points
  setCellClass(indicesToIndex(startPoint[0], startPoint[1]), "grid-cell-start");
  setCellClass(indicesToIndex(endPoint[0], endPoint[1]), "grid-cell-end");
};

$(() => {
  gridGeneration(setEventHandlers, generateGraph);
});

$(window).resize(() => {
  gridGeneration(setEventHandlers, generateGraph);
});

/*
  Finds the shortest path between vertex number s and vertex number d in an 
  undirected, unweighted graph.
*/
function dijkstra(s, d){
  console.log(s, d);
  console.log(graph);
  graph.vertices.forEach((vertex) => {
    vertex.color = 'w';
    vertex.distance = Number.MAX_SAFE_INTEGER;
    vertex.parent = null;
  });

  graph.vertices[s].color = 'g';
  setCellClass(s+1, "grid-cell-wall");
  graph.vertices[s].distance = 0;
  graph.vertices[s].parent = null;
  let q = [];
  q.push(graph.vertices[s]);

  let destinationFound = false;

  while(q.length != 0){
    let currVertex = q.shift();
    let vertexNum = currVertex.num;

    for(let i = 0 ; i < graph.adjacencyList[vertexNum].adj.length ; i++){
      let vertex = graph.adjacencyList[vertexNum].adj[i];
      if(vertex.color == 'w' && !vertex.isWall){
        vertex.color = 'g';

        setTimeout(function(){
          setCellClass(vertex.num+1, "grid-cell-discovered") 
        }, 3000);
        
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
    setTimeout(function(){
      setCellClass(currVertex.num+1, "grid-cell-visited") 
    }, 3000);

    if(destinationFound){
      break;
    }
  }

  // We found the destination. Now follow parent pointers back to root to get path
  let v = graph.vertices[d];
  let path = [];

  while(v != null){
    path.unshift(v);
    v = v.parent;
  }

  path.forEach(vertex => {
    setTimeout(function(){
      console.log("path ", vertex.num);
      setCellClass(vertex.num+1, "grid-cell-path")  
    }, 3000);
  });


  setCellClass(s+1, "grid-cell-start");
  setCellClass(d+1, "grid-cell-end");
  return path;
}



$("#dijkstraButton").on("click", () => {
  // Convert the index of the start cell into a number representing what child it is
  const startNum = indicesToIndex(startPoint[0], startPoint[1]) - 1;
  const endNum = indicesToIndex(endPoint[0], endPoint[1]) - 1;
  dijkstra(startNum, endNum);
});

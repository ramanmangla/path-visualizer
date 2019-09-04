// Left key press state
let mousePressed = false;

// Number of grid cols and rows
let columns;
let rows;

// Coordinates [row, col]
let startPoint = [];
let endPoint = [];

// cell size in pixels
let cellSize = 25;
// Accounting for grid gap
cellSize = cellSize + 5;

// Flags for moving start and end points
let startMove = false;
let endMove = false;

// Graph for grid
let graph;

let grid = $(".grid");

const indicesToIndex = (row, col) => {
  return row * columns + (col + 1);
};

const setCellClass = (row, col, className) => {
  removeCellClass(row, col, "grid-cell-active");
  removeCellClass(row, col, "grid-cell-start");
  removeCellClass(row, col, "grid-cell-end");
  removeCellClass(row, col, "grid-cell-visited");

  $(".grid-cell:nth-child(" + indicesToIndex(row, col) + ")").addClass(
    className
  );
};

const removeCellClass = (row, col, className) => {
  $(".grid-cell:nth-child(" + indicesToIndex(row, col) + ")").removeClass(
    className
  );
};

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

const gridGeneration = (callbackOne, callbackTwo) => {
  columns = Math.floor(grid.width() / cellSize);
  rows = Math.floor(grid.height() / cellSize);

  // // Random start and end points generation
  // startPoint[0] = Math.floor(Math.random() * rows);
  // endPoint[0] = Math.floor(Math.random() * rows);
  // startPoint[1] = Math.floor(Math.random() * (columns / 2));
  // endPoint[1] = Math.floor((columns / 2) * (Math.random() + 1));
  startPoint[0] = Math.floor(rows / 2);
  endPoint[0] = Math.floor(rows / 2);
  startPoint[1] = Math.floor(columns / 3);
  endPoint[1] = Math.floor((columns / 3) * 2);

  grid.css("grid-template-columns", "repeat(" + columns + ", 1fr)");
  grid.css("grid-template-rows", "repeat(" + rows + ", 1fr)");

  // Clearing the grid
  grid.html("");

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      // draggable = false prevents default browser behaviour
      grid.append('<div class="grid-cell" draggable="false"></div>');
    }
  }

  callbackOne();
  callbackTwo();
};

const generateGraph = () => {
  // Generate grid
  graph = new Graph(rows, columns);

  graph.matrix[startPoint[0]][startPoint[1]].type = "start";
  graph.matrix[endPoint[0]][endPoint[1]].type = "end";
};

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
      $(event.target).addClass("grid-cell-active");
      let indices = positionToIndices(event);
      graph.matrix[indices[0]][indices[1]].type = "wall";
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
      $(event.target).addClass("grid-cell-active");
      let indices = positionToIndices(event);
      graph.matrix[indices[0]][indices[1]].type = "wall";
    } else if (
      event.button === 0 &&
      $(event.target).hasClass("grid-cell-start")
    ) {
      mousePressed = true;
      startMove = true;
    } else if (event.button === 0) {
      mousePressed = true;
      endMove = true;
    }
  });

  // // Mouse up event for moving start and end points
  // $(".grid-cell").on("mouseup", event => {
  //   if (startMove) {
  //     removeCellClass(startPoint[0], startPoint[1], "grid-cell-start");
  //     $(event.target).addClass("grid-cell-start");

  //     startPoint = positionToIndices(event);
  //   } else if (endMove) {
  //     removeCellClass(endPoint[0], endPoint[1], "grid-cell-end");
  //     $(event.target).addClass("grid-cell-end");

  //     endPoint = positionToIndices(event);
  //   }

  //   mousePressed = false;
  //   startMove = false;
  //   endMove = false;
  // });

  $(document).on("mouseup", event => {
    if ($(event.target).hasClass("grid-cell")) {
      if (startMove && !$(event.target).hasClass("grid-cell-end")) {
        removeCellClass(startPoint[0], startPoint[1], "grid-cell-start");
        $(event.target).removeClass("grid-cell-active");
        $(event.target).addClass("grid-cell-start");

        graph.matrix[startPoint[0]][startPoint[1]].type = "normal";

        startPoint = positionToIndices(event);
        graph.matrix[startPoint[0]][startPoint[1]].type = "start";
      } else if (endMove && !$(event.target).hasClass("grid-cell-start")) {
        removeCellClass(endPoint[0], endPoint[1], "grid-cell-end");
        $(event.target).removeClass("grid-cell-active");
        $(event.target).addClass("grid-cell-end");

        graph.matrix[endPoint[0]][endPoint[1]].type = "normal";

        endPoint = positionToIndices(event);
        graph.matrix[endPoint[0]][endPoint[1]].type = "end";
      }
    }

    mousePressed = false;
    startMove = false;
    endMove = false;
  });

  $("#clearButton").on("click", () => {
    $(".grid-cell").removeClass("grid-cell-active");

    for (let i = 0; i < graph.matrix.length; i++) {
      for (let j = 0; j < graph.matrix[i].length; j++) {
        graph.matrix[i][j].type = "normal";
      }
    }
  });

  // Set classes for random start and end points
  setCellClass(startPoint[0], startPoint[1], "grid-cell-start");
  setCellClass(endPoint[0], endPoint[1], "grid-cell-end");
};

$(() => {
  gridGeneration(setEventHandlers, generateGraph);
});

$(window).resize(() => {
  gridGeneration(setEventHandlers, generateGraph);
});

const dijkstra = () => {
  let queue = [];
  let current;
  let pathFound = false;
  queue.push(startPoint);

  while (queue.length > 0) {
    let parent = current;
    current = queue.shift();

    if (current[0] == endPoint[0] && current[1] == endPoint[1]) {
      pathFound = true;
      break;
    }

    if (
      graph.matrix[current[0]][current[1]].type != "visited" &&
      graph.matrix[current[0]][current[1]].type != "wall"
    ) {
      if (current[0] - 1 >= 0 && current[1] >= 0) {
        if (
          graph.matrix[current[0] - 1][current[1]].type == "normal" ||
          graph.matrix[current[0] - 1][current[1]].type == "end"
        ) {
          queue.push([current[0] - 1, current[1]]);
        }
      }

      if (current[0] + 1 < rows && current[1] >= 0) {
        if (
          graph.matrix[current[0] + 1][current[1]].type == "normal" ||
          graph.matrix[current[0] + 1][current[1]].type == "end"
        ) {
          queue.push([current[0] + 1, current[1]]);
        }
      }

      if (current[0] >= 0 && current[1] - 1 >= 0) {
        if (
          graph.matrix[current[0]][current[1] - 1].type == "normal" ||
          graph.matrix[current[0]][current[1] - 1].type == "end"
        ) {
          queue.push([current[0], current[1] - 1]);
        }
      }

      if (current[0] >= 0 && current[1] + 1 < columns) {
        if (
          graph.matrix[current[0]][current[1] + 1].type == "normal" ||
          graph.matrix[current[0]][current[1] + 1].type == "end"
        ) {
          queue.push([current[0], current[1] + 1]);
        }
      }

      graph.matrix[current[0]][current[1]].type = "visited";
      setCellClass(current[0], current[1], "grid-cell-visited");
    }
  }

  setCellClass(startPoint[0], startPoint[0], "grid-cell-start");
  console.log(pathFound);
};

$("#dijkstraButton").on("click", () => {
  dijkstra();
});

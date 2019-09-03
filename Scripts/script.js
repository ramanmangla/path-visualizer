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
cellSize = cellSize + 4;

// Flags for moving start and end points
let startMove = false;
let endMove = false;

let grid = $(".grid");

const setCellClass = (row, col, className) => {
  let index = row * columns + (col + 1);
  $(".grid-cell:nth-child(" + index + ")").addClass(className);
};

const removeCellClass = (row, col, className) => {
  let index = row * columns + (col + 1);
  $(".grid-cell:nth-child(" + index + ")").removeClass(className);
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

const gridGeneration = callback => {
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
      grid.append('<div class="grid-cell" draggable="false"></div>');
    }
  }

  callback();
};

const setClickEvents = () => {
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

  $("#clearButton").on("click", () => {
    $(".grid-cell").removeClass("grid-cell-active");
  });

  // Set classes for random start and end points
  setCellClass(startPoint[0], startPoint[1], "grid-cell-start");
  setCellClass(endPoint[0], endPoint[1], "grid-cell-end");
};

$(document).on("mouseup", event => {
  if ($(event.target).hasClass("grid-cell")) {
    if (startMove) {
      removeCellClass(startPoint[0], startPoint[1], "grid-cell-start");
      $(event.target).removeClass("grid-cell-active");
      $(event.target).addClass("grid-cell-start");

      startPoint = positionToIndices(event);
    } else if (endMove) {
      removeCellClass(endPoint[0], endPoint[1], "grid-cell-end");
      $(event.target).removeClass("grid-cell-active");
      $(event.target).addClass("grid-cell-end");

      endPoint = positionToIndices(event);
    }
  }

  mousePressed = false;
  startMove = false;
  endMove = false;
});

$(() => {
  gridGeneration(setClickEvents);
});

$(window).resize(() => {
  gridGeneration(setClickEvents);
});

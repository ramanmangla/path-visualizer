// Mouse press state
let mousePressed = false;
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
      grid.append('<div class="grid-cell"></div>');
    }
  }

  callback();
};

const setClickEvents = () => {
  $(".grid-cell").on("mouseover", event => {
    if (
      mousePressed === true &&
      !$(event.target).hasClass("grid-cell-start") &&
      !$(event.target).hasClass("grid-cell-end")
    ) {
      $(event.target).addClass("grid-cell-active");
    }
  });

  $(".grid-cell").on("mousedown", event => {
    if (
      mousePressed === true &&
      !$(event.target).hasClass("grid-cell-start") &&
      !$(event.target).hasClass("grid-cell-end")
    ) {
      $(event.target).addClass("grid-cell-active");
    } else if ($(event.target).hasClass("grid-cell-start")) {
      startMove = true;
    } else {
      endMove = true;
    }
  });

  $("#clearButton").on("click", () => {
    $(".grid-cell").removeClass("grid-cell-active");
  });

  // Set classes for random start and end points
  setCellClass(startPoint[0], startPoint[1], "grid-cell-start");
  setCellClass(endPoint[0], endPoint[1], "grid-cell-end");
};

$(() => {
  gridGeneration(setClickEvents);
});

$(window).resize(() => {
  gridGeneration(setClickEvents);
});

$(document).on("mousedown", event => {
  // Left click
  if (event.button === 0) {
    mousePressed = true;
  }
});

$(document).on("mouseup", event => {
  // Left click
  if (event.button === 0) {
    mousePressed = false;
  }
});

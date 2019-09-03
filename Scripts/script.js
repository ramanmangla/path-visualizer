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

let grid = $(".grid");

const setCellClass = (row, col, className) => {
  let index = row * columns + (col + 1);
  $(".grid-cell:nth-child(" + index + ")").addClass(className);
};

const gridGeneration = callback => {
  columns = Math.floor(grid.width() / cellSize);
  rows = Math.floor(grid.height() / cellSize);

  // Random start and end points generation
  startPoint[0] = Math.floor(Math.random() * rows);
  endPoint[0] = Math.floor(Math.random() * rows);
  startPoint[1] = Math.floor(Math.random() * (columns / 2));
  endPoint[1] = Math.floor((columns / 2) * (Math.random() + 1));

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
    if (mousePressed === true) {
      $(event.target).addClass("grid-cell-active");
    }

    let leftPosition = event.pageX - grid.offset().left;
    let topPosition = event.pageY - grid.offset().top;

    // Indices for graph
    let colIndex = Math.floor(leftPosition / cellSize);
    let rowIndex = Math.floor(topPosition / cellSize);
  });

  $(".grid-cell").on("mousedown", event => {
    $(event.target).addClass("grid-cell-active");

    let leftPosition = event.pageX - grid.offset().left;
    let topPosition = event.pageY - grid.offset().top;

    // Indices for graph
    let colIndex = Math.floor(leftPosition / cellSize);
    let rowIndex = Math.floor(topPosition / cellSize);
  });

  $("#clearButton").on("click", () => {
    $(".grid-cell").removeClass("grid-cell-active");
  });

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
  if (event.button === 0) {
    mousePressed = true;
  }
});

$(document).on("mouseup", event => {
  if (event.button === 0) {
    mousePressed = false;
  }
});

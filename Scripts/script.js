// Mouse press state
let mousePressed = false;
// cell size in pixels
let columns;
let rows;
let cellSize = 25;
// Accounting for grid gap
cellSize = cellSize + 4;
let grid = $(".grid");

const gridGeneration = callback => {
  columns = Math.floor(grid.width() / cellSize);
  rows = Math.floor(grid.height() / cellSize);

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

    console.log(event.target);

    let leftPosition = event.pageX - grid.offset().left;
    let topPosition = event.pageY - grid.offset().top;
    let colIndex = Math.floor(leftPosition / cellSize);
    let rowIndex = Math.floor(topPosition / cellSize);
  });

  $(".grid-cell").on("mousedown", event => {
    $(event.target).addClass("grid-cell-active");

    console.log(event.target);

    let leftPosition = event.pageX - grid.offset().left;
    let topPosition = event.pageY - grid.offset().top;
    let colIndex = Math.floor(leftPosition / cellSize);
    let rowIndex = Math.floor(topPosition / cellSize);
  });

  $("#clearButton").on("click", () => {
    $(".grid-cell").removeClass("grid-cell-active");
  });
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

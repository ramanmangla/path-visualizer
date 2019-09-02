// cell size in pixels
let columns;
let rows;
let cellSize = 30;

const gridGeneration = () => {
  let grid = $(".grid");
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
};

$(() => {
  gridGeneration();
});

$(window).resize(() => {
  gridGeneration();
});

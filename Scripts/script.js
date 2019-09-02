// cell size in pixels
let columns;
let rows;
let cellSize = 30;
// Accounting for grid gap
cellSize = cellSize + 5;
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
  $(".grid-cell").on("click", event => {
    // $(this).addClass("grid-cell-active");
    $(event.target).addClass("grid-cell-active");

    console.log(event.target);
    // $(this).css("background");
    let leftPosition = event.pageX - grid.offset().left;
    let topPosition = event.pageY - grid.offset().top;

    let colIndex = Math.floor(leftPosition / cellSize);
    let rowIndex = Math.floor(topPosition / cellSize);

    // console.log($(this).offset().left);
  });
};

$(() => {
  gridGeneration(setClickEvents);
});

$(window).resize(() => {
  gridGeneration(setClickEvents);
});

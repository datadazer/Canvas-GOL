let golApp = (function() {
  let grid;
  class Grid {
    constructor() {
      this.cells = [];
      this.cellsGen2 = [];
      this.rowSize = 300;//148
      this.colSize = 300;//340
      this.generation = 0;
      this.aliveCells = {};
    }

    init() {
      for (let i = 0; i < this.rowSize; i++) {
        let rowContainer = [];
        for (let j = 0; j < this.colSize; j++) {
          let rect = new Rect();
          rect.x = j * 2 + 40;
          rect.y = i * 2 + 40;
          rect.row = i;
          rect.col = j;
          rect.initRandomState();
          rect.assignCellColor();
          rowContainer.push(rect);
        }
        grid.cells.push(rowContainer);
      }
    }
  }

  class Rect {
    constructor() {
      this.x = 0;
      this.y = 0;
      this.row = 0;
      this.col = 0;
      this.color = "#333333";
      this.size = 2;
      this.isAlive = false;
      this.previousState = false;
      this.aliveNeighbors = 0;
    }

    initRandomState() {
      let isAlive = false;
      if (Math.random() > 0.9) {
        isAlive = true;
      }
      this.isAlive = isAlive;
    }

    countAliveNeighbors(row, col) {
      //check tl, tc, tr, l, r, bl, bc, br

      // Note to self: left off at ignoring out of bounds values
      let cells = grid.cells;
      let aliveNeighborsCount = 0;

      //top middle
      if (row > 0) {
        if (cells[row - 1][col].isAlive) {
          aliveNeighborsCount++;
        }
      }

      //top left
      if (row > 0 && col > 0) {
        if (cells[row - 1][col - 1].isAlive) {
          aliveNeighborsCount++;
        }
      }

      //top right
      if (row > 0 && col < cells[row].length - 1) {
        if (cells[row - 1][col + 1].isAlive) {
          aliveNeighborsCount++;
        }
      }

      //left
      if (col > 0) {
        if (cells[row][col - 1].isAlive) {
          aliveNeighborsCount++;
        }
      }

      //right
      if (col < cells[row].length - 1) {
        if (cells[row][col + 1].isAlive) {
          aliveNeighborsCount++;
        }
      }

      //bottom middle
      if (row < cells.length - 1) {
        if (cells[row + 1][col].isAlive) {
          aliveNeighborsCount++;
        }
      }

      //bottom right
      if (row < cells.length - 1 && col < cells[row].length - 1) {
        if (cells[row + 1][col + 1].isAlive) {
          aliveNeighborsCount++;
        }
      }

      //bottom left
      if (row < cells.length - 1 && col > 0) {
        if (cells[row + 1][col - 1].isAlive) {
          aliveNeighborsCount++;
        }
      }

      this.aliveNeighbors = aliveNeighborsCount;
    }

    assignCellColor() {
      let color = "#333333";
      if (this.isAlive) {
        color = "#fff";
      }
      this.color = color;
    }

    update() {
      this.countAliveNeighbors(this.row, this.col);
      if (this.isAlive && (this.aliveNeighbors < 2 || this.aliveNeighbors > 3)) {
        this.isAlive = false;
        this.previousState = true;
      } else if (!this.isAlive && (this.aliveNeighbors === 3)) {
        this.isAlive = true;
        this.previousState = false;
      }
      this.assignCellColor();
    }
  }

  function init() {
    grid = new Grid();
    grid.init();
  }

  function update() {
    // nested for loop here is rough
    grid.cellsGen2 = [];
    grid.cells.forEach((rowContainer, row) => {
      let rowContainerGen2 = [];
      rowContainer.forEach((cell, col) => {
        let cellGen2 = new Rect();
        let hasChangedState = false;
        cellGen2.x = cell.x;
        cellGen2.y = cell.y;
        cellGen2.row = cell.row;
        cellGen2.col = cell.col;
        cellGen2.isAlive = cell.isAlive;
        cellGen2.color = cell.color;
        cellGen2.update();
        rowContainerGen2.push(cellGen2);
        hasChangedState = cell.previousState === cell.isAlive;

        if (hasChangedState && cellGen2.isAlive) {
          grid.aliveCells[`${cell.row}-${cell.col}`] = cellGen2;
        } else if (hasChangedState && !cellGen2.isAlive && grid.aliveCells[`${cell.row}-${cell.col}`] !== undefined) {
          delete grid.aliveCells[`${cell.row}-${cell.col}`];
        }
      });
      grid.cellsGen2.push(rowContainerGen2);
    });
    grid.cells = grid.cellsGen2;
    grid.generation++;
  }

  function draw() {
    let canvas = document.getElementById('canvas');
    if (canvas.getContext) {
      let ctx = canvas.getContext('2d');
      let aliveCellsArr = Object.keys(grid.aliveCells);
      ctx.clearRect(0, 0, 1400, 700);
      console.log(aliveCellsArr.length);

      aliveCellsArr.forEach((aliveCell) => {
        let rect = grid.aliveCells[aliveCell];
        ctx.fillStyle = rect.color;
        ctx.fillRect(rect.x, rect.y, rect.size, rect.size);
      });
    }
  }

  init();

  function performAnimation () {
    let debugTimerStart;
    let debugTimerEnd;
    let request = requestAnimationFrame(performAnimation);
    debugTimerStart = performance.now();
    update();
    draw();
    debugTimerEnd = performance.now();
    console.log(`play() took: ${debugTimerEnd - debugTimerStart}`);
    //console.log(grid.generation);
  }

  requestAnimationFrame(performAnimation);

})();

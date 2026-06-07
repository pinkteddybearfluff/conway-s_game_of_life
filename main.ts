const canvas = document.querySelector("canvas")!;
const ctx = canvas.getContext("2d")!;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let currentGrid: Array<Array<boolean>> = [];

const TILE_SIZE = 16;
const COL_TILES = Math.floor(canvas.width / TILE_SIZE);
const ROW_TILES = Math.floor(canvas.height / TILE_SIZE);

for (let i = 0; i < ROW_TILES; ++i) {
  currentGrid.push([]);
  for (let j = 0; j < COL_TILES; ++j) currentGrid[i].push(false);
}

currentGrid[3][2] = true;
currentGrid[3][3] = true;
currentGrid[3][4] = true;

const generationText = document.getElementById("generation");

function updateGrid(): Array<Array<boolean>> {
  let nextGrid: Array<Array<boolean>> = [];

  for (let i = 0; i < ROW_TILES; ++i) {
    nextGrid.push([]);
    for (let j = 0; j < COL_TILES; ++j) currentGrid[i].push(false);
  }

  for (let i = 0; i < ROW_TILES; ++i) {
    for (let j = 0; j < COL_TILES; ++j) {
      let neighbours = getNeighbours(i, j);
      if (currentGrid[i][j]) {
        if (neighbours < 2) nextGrid[i][j] = false;
        if (neighbours > 3) nextGrid[i][j] = false;
        if (neighbours === 3 || neighbours === 2) nextGrid[i][j] = true;
      } else {
        if (neighbours === 3) nextGrid[i][j] = true;
      }
    }
  }
  return nextGrid;
}

const getNeighbours = (i: number, j: number): number => {
  let sum = 0;
  if (i + 1 < ROW_TILES && currentGrid[i + 1][j]) sum += 1;
  if (j + 1 < COL_TILES && currentGrid[i][j + 1]) sum += 1;
  if (j > 0 && currentGrid[i][j - 1]) sum += 1;
  if (i > 0 && currentGrid[i - 1][j]) sum += 1;

  if (i + 1 < ROW_TILES && j + 1 < COL_TILES && currentGrid[i + 1][j + 1])
    sum += 1;
  if (i > 0 && j > 0 && currentGrid[i - 1][j - 1]) sum += 1;
  if (i > 0 && j + 1 < COL_TILES && currentGrid[i - 1][j + 1]) sum += 1;
  if (i + 1 < ROW_TILES && j > 0 && currentGrid[i + 1][j - 1]) sum += 1;

  return sum;
};

for (let i = 0; i < ROW_TILES; ++i) {
  console.log(currentGrid[i]);
}

function draw(): void {
  for (let i = 0; i < ROW_TILES; ++i) {
    for (let j = 0; j < COL_TILES; ++j) {
      if (currentGrid[i][j]) {
        ctx.fillStyle = "#f24c63";
        ctx.fillRect(j * TILE_SIZE, i * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }
  }
}

function update(): void {
  let newGrid = updateGrid();
  currentGrid = newGrid.map((rows) => [...rows]);
  ++generationCount;
  generationText!.textContent = `Gen: ${generationCount}`;
}

let lastUpdate = 0;

let running = false;
let creativeMode = true;

window.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();

  const x = Math.floor((event.clientX - rect.left) / TILE_SIZE);
  const y = Math.floor((event.clientY - rect.top) / TILE_SIZE);
  if (x >= 0 && x < COL_TILES && y >= 0 && y < ROW_TILES) {
    console.log(x, y, currentGrid[y]?.[x]);
    currentGrid[y][x] = !currentGrid[y][x];
    generationCount = 0;

    generationText!.textContent = `Gen: ${generationCount}`;
  }
});

let speed = 1;
let generationCount = 0;

window.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    running = !running;
    creativeMode = !creativeMode;
  }

  if (e.code === "ArrowUp") speed *= 2;
  if (e.code === "ArrowDown") speed *= 0.5;
  speed = Math.max(0.25, Math.min(4, speed));

  if (e.code == "add") console.log("+++");
  if (e.code == "KeyR") randomizeLife();
});

const fastButton = document.getElementById("faster");
fastButton?.addEventListener("click", (): void => {
  speed *= 2;
});

const slowButton = document.getElementById("slower");
slowButton?.addEventListener("click", (): void => {
  speed *= 0.5;
});

const randomButton = document.getElementById("randomize");
randomButton?.addEventListener("click", () => randomizeLife());

const runButton = document.getElementById("run");
runButton?.addEventListener("click", () => {
  running = !running;
  creativeMode = !creativeMode;
  if (running) {
    runButton.textContent = "Stop";
  } else {
    runButton.textContent = "Run";
  }
});

const clearButton = document.getElementById("clear");
clearButton?.addEventListener("click", () => {
  for (let i = 0; i < ROW_TILES; ++i) {
    for (let j = 0; j < COL_TILES; ++j) {
      currentGrid[i][j] = false;
    }
  }
  generationCount = 0;
  generationText!.textContent = `Gen: ${generationCount}`;
});

function randomizeLife(): void {
  for (let i = 0; i < ROW_TILES; ++i) {
    for (let j = 0; j < COL_TILES; ++j) currentGrid[i][j] = Math.random() < 0.3;
  }
}

function drawGrid() {
  for (let i = 1; i <= COL_TILES; ++i) {
    ctx.beginPath();
    ctx.moveTo(i * TILE_SIZE, 0);
    ctx.lineTo(i * TILE_SIZE, canvas.height);
    ctx.strokeStyle = "#b0a0b3";
    ctx.stroke();
  }
  for (let i = 1; i <= ROW_TILES; ++i) {
    ctx.beginPath();
    ctx.moveTo(0, i * TILE_SIZE);
    ctx.lineTo(canvas.width, i * TILE_SIZE);
    ctx.strokeStyle = "#b0a0b3";
    ctx.stroke();
  }
}
console.log(generationCount);

function animate(timestamp: number) {
  requestAnimationFrame(animate);

  if (creativeMode) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    draw();
    drawGrid();
  }

  if (timestamp - lastUpdate >= 200 / speed) {
    if (!running) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    update();
    draw();
    drawGrid();
    lastUpdate = timestamp;
  }
}

requestAnimationFrame(animate);

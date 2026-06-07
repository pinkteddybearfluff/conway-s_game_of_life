"use strict";
let tileSize = 16;
const COL_TILES = 500;
const ROW_TILES = 500;
const generationText = document.getElementById("generation");
const fastButton = document.getElementById("faster");
const slowButton = document.getElementById("slower");
const clearButton = document.getElementById("clear");
const runButton = document.getElementById("run");
const randomButton = document.getElementById("randomize");
const zoomInButton = document.getElementById("zoomIn");
const zoomOutButton = document.getElementById("zoomOut");
const upButton = document.getElementById("up");
const downButton = document.getElementById("down");
const leftButton = document.getElementById("left");
const rightButton = document.getElementById("right");
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let currentGrid = [];
let lastUpdate = 0;
let running = false;
let creativeMode = true;
let speed = 1;
let generationCount = 0;
let offsetX = -(COL_TILES / 2) * tileSize;
let offsetY = -(ROW_TILES / 2) * tileSize;
slowButton?.addEventListener("click", () => {
    speed *= 0.5;
    speed = Math.max(0.25, Math.min(4, speed));
});
randomButton?.addEventListener("click", () => {
    running = false;
    creativeMode = true;
    if (running) {
        runButton.textContent = "Stop";
    }
    else {
        runButton.textContent = "Run";
    }
    generationCount = 0;
    generationText.textContent = `Gen: ${generationCount}`;
    randomizeLife();
});
fastButton?.addEventListener("click", () => {
    speed *= 2;
    speed = Math.max(0.25, Math.min(4, speed));
});
runButton?.addEventListener("click", () => {
    running = !running;
    creativeMode = !creativeMode;
    if (running) {
        runButton.textContent = "Stop";
    }
    else {
        runButton.textContent = "Run";
    }
});
clearButton?.addEventListener("click", () => {
    for (let i = 0; i < ROW_TILES; ++i) {
        for (let j = 0; j < COL_TILES; ++j) {
            currentGrid[i][j] = false;
        }
    }
    running = false;
    creativeMode = true;
    if (running) {
        runButton.textContent = "Stop";
    }
    else {
        runButton.textContent = "Run";
    }
    generationCount = 0;
    generationText.textContent = `Gen: ${generationCount}`;
});
zoomInButton?.addEventListener("click", () => {
    tileSize *= 1.2;
    tileSize = Math.max(1.6, Math.min(36, tileSize));
    offsetX = -(COL_TILES / 2) * tileSize;
    offsetY = -(ROW_TILES / 2) * tileSize;
    console.log(tileSize);
});
zoomOutButton?.addEventListener("click", () => {
    tileSize /= 1.2;
    tileSize = Math.max(1.6, Math.min(36, tileSize));
    offsetX = -(COL_TILES / 2) * tileSize;
    offsetY = -(ROW_TILES / 2) * tileSize;
    console.log(tileSize);
});
leftButton?.addEventListener("click", () => {
    offsetX += tileSize * 4;
});
rightButton?.addEventListener("click", () => {
    offsetX -= tileSize * 4;
});
upButton?.addEventListener("click", () => {
    offsetY += tileSize * 4;
});
downButton?.addEventListener("click", () => {
    offsetY -= tileSize * 4;
});
window.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / tileSize);
    const y = Math.floor((event.clientY - rect.top) / tileSize);
    if (x >= 0 && x < COL_TILES && y >= 0 && y < ROW_TILES) {
        console.log(x, y, currentGrid[y]?.[x]);
        currentGrid[y][x] = !currentGrid[y][x];
        generationCount = 0;
        generationText.textContent = `Gen: ${generationCount}`;
    }
});
window.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        running = !running;
        creativeMode = !creativeMode;
    }
    if (e.code === "ArrowUp")
        speed *= 2;
    if (e.code === "ArrowDown")
        speed *= 0.5;
    speed = Math.max(0.25, Math.min(4, speed));
    if (e.code == "add")
        console.log("+++");
    if (e.code == "KeyR")
        randomizeLife();
});
for (let i = 0; i < ROW_TILES; ++i) {
    currentGrid.push([]);
    for (let j = 0; j < COL_TILES; ++j)
        currentGrid[i].push(false);
}
function updateGrid() {
    let nextGrid = [];
    for (let i = 0; i < ROW_TILES; ++i) {
        nextGrid.push([]);
        for (let j = 0; j < COL_TILES; ++j)
            currentGrid[i].push(false);
    }
    for (let i = 0; i < ROW_TILES; ++i) {
        for (let j = 0; j < COL_TILES; ++j) {
            let neighbours = getNeighbours(i, j);
            if (currentGrid[i][j]) {
                if (neighbours < 2)
                    nextGrid[i][j] = false;
                if (neighbours > 3)
                    nextGrid[i][j] = false;
                if (neighbours === 3 || neighbours === 2)
                    nextGrid[i][j] = true;
            }
            else {
                if (neighbours === 3)
                    nextGrid[i][j] = true;
            }
        }
    }
    return nextGrid;
}
const getNeighbours = (i, j) => {
    let sum = 0;
    if (i + 1 < ROW_TILES && currentGrid[i + 1][j])
        sum += 1;
    if (j + 1 < COL_TILES && currentGrid[i][j + 1])
        sum += 1;
    if (j > 0 && currentGrid[i][j - 1])
        sum += 1;
    if (i > 0 && currentGrid[i - 1][j])
        sum += 1;
    if (i + 1 < ROW_TILES && j + 1 < COL_TILES && currentGrid[i + 1][j + 1])
        sum += 1;
    if (i > 0 && j > 0 && currentGrid[i - 1][j - 1])
        sum += 1;
    if (i > 0 && j + 1 < COL_TILES && currentGrid[i - 1][j + 1])
        sum += 1;
    if (i + 1 < ROW_TILES && j > 0 && currentGrid[i + 1][j - 1])
        sum += 1;
    return sum;
};
function draw() {
    for (let i = 0; i < ROW_TILES; ++i) {
        for (let j = 0; j < COL_TILES; ++j) {
            if (currentGrid[i][j]) {
                ctx.fillStyle = "#f24c63";
                ctx.fillRect(j * tileSize + offsetX, i * tileSize + offsetY, tileSize, tileSize);
            }
        }
    }
}
function update() {
    let newGrid = updateGrid();
    currentGrid = newGrid.map((rows) => [...rows]);
    ++generationCount;
    generationText.textContent = `Gen: ${generationCount}`;
}
function randomizeLife() {
    for (let i = 0; i < ROW_TILES; ++i) {
        for (let j = 0; j < COL_TILES; ++j)
            currentGrid[i][j] = Math.random() < 0.3;
    }
}
function drawGrid() {
    //Vertical grid lines
    for (let i = 1; i <= COL_TILES; ++i) {
        ctx.beginPath();
        ctx.moveTo(i * tileSize + offsetX, 0);
        ctx.lineTo(i * tileSize + offsetX, canvas.height);
        ctx.strokeStyle = "#b0a0b3";
        ctx.stroke();
    }
    //horizontal grid lines
    for (let i = 1; i <= ROW_TILES; ++i) {
        ctx.beginPath();
        ctx.moveTo(0, i * tileSize + offsetY);
        ctx.lineTo(canvas.width, i * tileSize + offsetY);
        ctx.strokeStyle = "#b0a0b3";
        ctx.stroke();
    }
}
function animate(timestamp) {
    requestAnimationFrame(animate);
    if (creativeMode) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        draw();
        if (tileSize >= 12)
            drawGrid();
    }
    if (timestamp - lastUpdate >= 200 / speed) {
        if (!running)
            return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        update();
        draw();
        if (tileSize >= 12)
            drawGrid();
        lastUpdate = timestamp;
    }
}
requestAnimationFrame(animate);

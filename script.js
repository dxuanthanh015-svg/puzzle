function formatTime(totalSeconds) {
    var m = Math.floor(totalSeconds / 60);
    var s = totalSeconds % 60;
    return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
}

var elapsedSec = 0;
var timeId = null;
var clockEl = document.getElementById("clockdisplay");

function updateClock() {
    clockEl.textContent = formatTime(elapsedSec);
}

function stopTimer() {
    if (timeId !== null) {
        clearInterval(timeId);
        timeId = null;
    }
}

function startTimer() {
    stopTimer();
    elapsedSec = 0;
    updateClock();

    timeId = setInterval(function () {
        elapsedSec++;
        updateClock();
    }, 1000);
}

var tiles = document.querySelectorAll(".tile");
var emptyIndex = 11;

function swap(i, j) {
    let temp = tiles[i].textContent;
    tiles[i].textContent = tiles[j].textContent;
    tiles[j].textContent = temp;
    tiles[i].className = "tile";
    tiles[j].className = "tile";
    if (tiles[i].textContent === "") {
        tiles[i].classList.add("empty");
    } else {
        tiles[i].classList.add("c" + tiles[i].textContent);
    }

    if (tiles[j].textContent === "") {
        tiles[j].classList.add("empty");
    } else {
        tiles[j].classList.add("c" + tiles[j].textContent);
    }
}

var steps = 0;

function move(direction) {
    let row = Math.floor(emptyIndex / 4);
    let col = emptyIndex % 4;
    let target = -1;
    if (direction === "up" && row > 0) target = emptyIndex - 4;
    if (direction === "down" && row < 2) target = emptyIndex + 4;
    if (direction === "left" && col > 0) target = emptyIndex - 1;
    if (direction === "right" && col < 3) target = emptyIndex + 1;
    if (target !== -1) {
        swap(emptyIndex, target);
        emptyIndex = target;
        steps++;
        if (checkWin()) {
            winGame();
        }
    }
}

document.addEventListener("keydown", function (e) {

    const btn = document.getElementById("btn-toggle");

    if (btn.dataset.state !== "playing") return;

    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
    }

    if (e.key === "w" || e.key === "W") move("up");
    if (e.key === "s" || e.key === "S") move("down");
    if (e.key === "a" || e.key === "A") move("left");
    if (e.key === "d" || e.key === "D") move("right");

    if (e.key === "ArrowUp") move("up");
    if (e.key === "ArrowDown") move("down");
    if (e.key === "ArrowLeft") move("left");
    if (e.key === "ArrowRight") move("right");
});

function moveRandom() {
    let moves = [];
    let row = Math.floor(emptyIndex / 4);
    let col = emptyIndex % 4;
    if (row > 0) moves.push(emptyIndex - 4);
    if (row < 2) moves.push(emptyIndex + 4);
    if (col > 0) moves.push(emptyIndex - 1);
    if (col < 3) moves.push(emptyIndex + 1);
    let target = moves[Math.floor(Math.random() * moves.length)];
    swap(emptyIndex, target);
    emptyIndex = target;
}

function shufflePuzzle(times = 100) {
    for (let i = 0; i < times; i++) {
        moveRandom();
    }
}

function checkWin() {
    for (let i = 0; i < tiles.length - 1; i++) {
        if (tiles[i].textContent != (i + 1)) {
            return false;
        }
    }
    return true;
}

function winGame() {
    stopTimer();
    document.getElementById("win-message").classList.remove("hidden");
    var btn = document.getElementById("btn-toggle");
    btn.textContent = "Chơi lại";
    btn.dataset.state = "idle";
    saveHistory();
}

var gameCount = 0;

function saveHistory() {
    gameCount++;
    var tbody = document.getElementById("history-body");
    var tr = document.createElement("tr");
    tr.innerHTML = `
        <td>${gameCount}</td>
        <td>${steps}</td>
        <td>${formatTime(elapsedSec)}</td>
    `;
    tbody.appendChild(tr);
}

var btnToggle = document.getElementById("btn-toggle");
btnToggle.addEventListener("click", function () {
    if (btnToggle.dataset.state === "idle") {
        steps = 0;
        document.getElementById("win-message").classList.add("hidden");
        shufflePuzzle(100);
        startTimer();
        btnToggle.dataset.state = "playing";
        btnToggle.textContent = "Kết thúc";
        btnToggle.classList.add("btn-stop");
    } else {
        stopTimer();
        steps = 0;
        btnToggle.dataset.state = "idle";
        btnToggle.textContent = "Bắt đầu";
        btnToggle.classList.remove("btn-stop");
    }
});

updateClock();
var constants = {
    EASY_BOMB_AMOUNT: 10,
    MEDIUM_BOMB_AMOUNT: 40,
    HARD_BOMB_AMOUNT: 99,
    EASY_WIDTH: 8,
    EASY_HEIGHT: 8,
    MEDIUM_WIDTH: 16,
    MEDIUM_HEIGHT: 16,
    HARD_WIDTH: 30,
    HARD_HEIGHT: 16
}
var gameOver = false;
var gameSection = document.getElementById("game");
var cells = [];
var width, height;

function displayBoard() {
    if (document.getElementById("easy").checked) {
        width = constants.EASY_WIDTH;
        height = constants.EASY_HEIGHT;
    } else if (document.getElementById("medium").checked) {
        width = constants.MEDIUM_WIDTH;
        height = constants.MEDIUM_HEIGHT;
    } else {
        width = constants.HARD_WIDTH;
        height = constants.HARD_HEIGHT;
    }
    generateBoard(width, height);
}

function generateBoard(width, height) {
    for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
            var cell = document.createElement("div");
            cell.className = "cell";
            cell.addEventListener("click", startGame);
            gameSection.appendChild(cell);
            cells.push(cell);
        }
        gameSection.appendChild(document.createElement("br"));
    }
}

function clearBoard(ele) {
    while (ele.firstChild) {
        ele.removeChild(ele.firstChild);
    }
    cells = [];
}

function startGame(event) {
    var clickedIndex = cells.indexOf(event.target);
    cells.forEach(function(ele) {
        ele.removeEventListener("click", startGame);
        ele.addEventListener("click", function(event) {
            event.target.innerHTML = event.target.value;
        });
    });
    event.target.value = 0; //set the first clicked cell to safe
    event.target.innerHTML = event.target.value;
    setBomb(clickedIndex);
}

function setBomb(index) {
    var difficulty = document.querySelector("input[type=radio]:checked").id;
    defuseSurrounding(index); //defuse all the cells surrounded first cell
    if (difficulty === "easy") {
        setRandomBomb(constants.EASY_BOMB_AMOUNT, index);
    } else if (difficulty === "medium") {
        setRandomBomb(constants.MEDIUM_BOMB_AMOUNT, index);
    } else {
        setRandomBomb(constants.HARD_BOMB_AMOUNT, index);
    }
    //Set all the rest cells to safe cell
    cells.forEach(function(cell) {
        if (cell.value === undefined) {
            cell.value = 0;
        }
    });
}

function defuseSurrounding(index) {
    var UPPER_LIMIT = (width * height) - 1;
    if (index - width - 1 >= 0) cells[index - width - 1].value = 0;
    if (index - width >= 0) cells[index - width].value = 0;
    if (index - width + 1 >= 0) cells[index - width + 1].value = 0;
    if (index - 1 >= 0) cells[index - 1].value = 0;
    if (index + 1 <= UPPER_LIMIT) cells[index + 1].value = 0;
    if (index + width - 1 <= UPPER_LIMIT) cells[index + width - 1].value = 0;
    if (index + width <= UPPER_LIMIT) cells[index + width].value = 0;
    if (index + width + 1 <= UPPER_LIMIT) cells[index + width + 1].value = 0;
}

function setRandomBomb(maxBomb, index) {
    var UPPER_LIMIT = (width * height);
    for (i = 0; i < maxBomb;) {
        var index = Math.floor(Math.random() * UPPER_LIMIT);
        if (cells[index].value === undefined) {
            cells[index].value = 1;
            i++;
        } else {
            continue;
        }
    }
}

document.getElementById("newGame").addEventListener("click", function() {
    clearBoard(gameSection);
    displayBoard();
});

displayBoard();

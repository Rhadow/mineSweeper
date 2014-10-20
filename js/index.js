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

var gameSection = document.getElementById("game");
var cells = [];

function displayBoard() {
    if (document.getElementById("easy").checked) {
        generateBoard(constants.EASY_WIDTH, constants.EASY_HEIGHT);
    } else if (document.getElementById("medium").checked) {
        generateBoard(constants.MEDIUM_WIDTH, constants.MEDIUM_HEIGHT);
    } else {
        generateBoard(constants.HARD_WIDTH, constants.HARD_HEIGHT);
    }
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
    var difficulty = document.querySelector("input[type=radio]:checked").id;
    var clickedIndex = cells.indexOf(event.target);
    cells.forEach(function(ele) {
        ele.removeEventListener("click", startGame);
        ele.addEventListener("click", function(event) {
            console.log(event.target.value);
        });
    });
    event.target.value = 0; //set the first clicked cell to safe
    setBomb(difficulty, clickedIndex);
}


function setBomb(difficulty, index) {
    defuseSurrounding(difficulty, index);
    setRandomBomb(difficulty, index);
    cells.forEach(function(cell){
    	if(cell.value === undefined){
    		cell.value = 0;
    	}
    });
}

function defuseSurrounding(difficulty, index) {
    if (difficulty === "easy") {
        var UPPER_LIMIT = (constants.EASY_WIDTH * constants.EASY_HEIGHT) - 1;
        if (index - constants.EASY_WIDTH - 1 > 0) cells[index - constants.EASY_WIDTH - 1].value = 0;
        if (index - constants.EASY_WIDTH > 0) cells[index - constants.EASY_WIDTH].value = 0;
        if (index - constants.EASY_WIDTH + 1 > 0) cells[index - constants.EASY_WIDTH + 1].value = 0;
        if (index - 1 > 0) cells[index - 1].value = 0;
        if (index + 1 < UPPER_LIMIT) cells[index + 1].value = 0;
        if (index + constants.EASY_WIDTH - 1 < UPPER_LIMIT) cells[index + constants.EASY_WIDTH - 1].value = 0;
        if (index + constants.EASY_WIDTH < UPPER_LIMIT) cells[index + constants.EASY_WIDTH].value = 0;
        if (index + constants.EASY_WIDTH + 1 < UPPER_LIMIT) cells[index + constants.EASY_WIDTH + 1].value = 0;
    } else if (difficulty === "medium") {
        var UPPER_LIMIT = (constants.MEDIUM_WIDTH * constants.MEDIUM_HEIGHT) - 1;
        if (index - constants.MEDIUM_WIDTH - 1 > 0) cells[index - constants.MEDIUM_WIDTH - 1].value = 0;
        if (index - constants.MEDIUM_WIDTH > 0) cells[index - constants.MEDIUM_WIDTH].value = 0;
        if (index - constants.MEDIUM_WIDTH + 1 > 0) cells[index - constants.MEDIUM_WIDTH + 1].value = 0;
        if (index - 1 > 0) cells[index - 1].value = 0;
        if (index + 1 < UPPER_LIMIT) cells[index + 1].value = 0;
        if (index + constants.MEDIUM_WIDTH - 1 < UPPER_LIMIT) cells[index + constants.MEDIUM_WIDTH - 1].value = 0;
        if (index + constants.MEDIUM_WIDTH < UPPER_LIMIT) cells[index + constants.MEDIUM_WIDTH].value = 0;
        if (index + constants.MEDIUM_WIDTH + 1 < UPPER_LIMIT) cells[index + constants.MEDIUM_WIDTH + 1].value = 0;
    } else {
        var UPPER_LIMIT = (constants.HARD_WIDTH * constants.HARD_HEIGHT) - 1;
        if (index - constants.HARD_WIDTH - 1 > 0) cells[index - constants.HARD_WIDTH - 1].value = 0;
        if (index - constants.HARD_WIDTH > 0) cells[index - constants.HARD_WIDTH].value = 0;
        if (index - constants.HARD_WIDTH + 1 > 0) cells[index - constants.HARD_WIDTH + 1].value = 0;
        if (index - 1 > 0) cells[index - 1].value = 0;
        if (index + 1 < UPPER_LIMIT) cells[index + 1].value = 0;
        if (index + constants.HARD_WIDTH - 1 < UPPER_LIMIT) cells[index + constants.HARD_WIDTH - 1].value = 0;
        if (index + constants.HARD_WIDTH < UPPER_LIMIT) cells[index + constants.HARD_WIDTH].value = 0;
        if (index + constants.HARD_WIDTH + 1 < UPPER_LIMIT) cells[index + constants.HARD_WIDTH + 1].value = 0;
    }
}

function setRandomBomb(difficulty, index) {
    if (difficulty === "easy") {
    	var UPPER_LIMIT = (constants.EASY_WIDTH * constants.EASY_HEIGHT);
        for (i = 0; i < constants.EASY_BOMB_AMOUNT;) {
            var index = Math.floor(Math.random() * UPPER_LIMIT);
            if(cells[index].value === undefined){
            	cells[index].value = 1;
            	i++;
            }else{
            	continue;
            }
        }
    } else if (difficulty === "easy") {
    	var UPPER_LIMIT = (constants.MEDIUM_WIDTH * constants.MEDIUM_HEIGHT);
        for (i = 0; i < constants.MEDIUM_BOMB_AMOUNT;) {
            var index = Math.floor(Math.random() * UPPER_LIMIT);
            if(cells[index].value === undefined){
            	cells[index].value = 1;
            	i++;
            }else{
            	continue;
            }
        }
    } else {
    	var UPPER_LIMIT = (constants.HARD_WIDTH * constants.HARD_HEIGHT);
        for (i = 0; i < constants.HARD_BOMB_AMOUNT;) {
            var index = Math.floor(Math.random() * UPPER_LIMIT);
            if(cells[index].value === undefined){
            	cells[index].value = 1;
            	i++;
            }else{
            	continue;
            }
        }
    }
}

document.getElementById("newGame").addEventListener("click", function() {
    clearBoard(gameSection);
    displayBoard();
})

displayBoard();

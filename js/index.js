//Setting up game constants
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
var cells = []; //array that holds the information of each cell
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
    document.getElementById("gameOver").innerHTML = "";
}

function startGame(event) {
    cells.forEach(function(ele) {
        ele.removeEventListener("click", startGame);
        ele.addEventListener("click", cellListener);
        ele.addEventListener("contextmenu", flagListener);
    });
    event.target.value = 0; //set the first clicked cell to safe    
    setBomb(cells.indexOf(event.target));
    checkSurroundingBombs(cells.indexOf(event.target));
}

function setBomb(index) {
    var difficulty = document.querySelector("input[type=radio]:checked").id;
    //defuse all the cells surrounded first cell
    defuseSurrounding(index);
    //Set the bombs into random cells
    if (difficulty === "easy") {
        setRandomBomb(constants.EASY_BOMB_AMOUNT, index);
    } else if (difficulty === "medium") {
        setRandomBomb(constants.MEDIUM_BOMB_AMOUNT, index);
    } else if (difficulty === "hard") {
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
    if (index - width >= 0) cells[index - width].value = 0;
    //For right most cells, skip defusing the bombs on their right  
    if (index % width !== (width - 1)) {
        if (index + 1 <= UPPER_LIMIT) cells[index + 1].value = 0;
        if (index - width + 1 >= 0) cells[index - width + 1].value = 0;
        if (index + width + 1 <= UPPER_LIMIT) cells[index + width + 1].value = 0;
    }
    //For left most cells, skip defusing the bombs on their left
    if (index % width !== 0) {
        if (index - 1 >= 0) cells[index - 1].value = 0;
        if (index + width - 1 <= UPPER_LIMIT) cells[index + width - 1].value = 0;
        if (index - width - 1 >= 0) cells[index - width - 1].value = 0;
    }
    if (index + width <= UPPER_LIMIT) cells[index + width].value = 0;
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

function cellListener(event) {
    var difficulty = document.querySelector("input[type=radio]:checked").id;
    checkSurroundingBombs(cells.indexOf(event.target));
    if (difficulty === "easy") {
        isGameOver(event.target, constants.EASY_BOMB_AMOUNT);
    } else if (difficulty === "medium") {
        isGameOver(event.target, constants.MEDIUM_BOMB_AMOUNT);
    } else if (difficulty === "hard") {
        isGameOver(event.target, constants.HARD_BOMB_AMOUNT);
    }
    event.target.removeEventListener("click", cellListener);
}

function checkSurroundingBombs(index) {
    var result = 0;
    var UPPER_LIMIT = (width * height) - 1;
    if (index - width >= 0 && cells[index - width].value) result++;
    //For right most cells, skip checking the bombs on their right  
    if (index % width !== (width - 1)) {
        if (index + 1 <= UPPER_LIMIT && cells[index + 1].value) result++;
        if (index - width + 1 >= 0 && cells[index - width + 1].value) result++;
        if (index + width + 1 <= UPPER_LIMIT && cells[index + width + 1].value) result++;
    }
    //For left most cells, skip checking the bombs on their left  
    if (index % width !== 0) {
        if (index - 1 >= 0 && cells[index - 1].value) result++;
        if (index + width - 1 <= UPPER_LIMIT && cells[index + width - 1].value) result++;
        if (index - width - 1 >= 0 && cells[index - width - 1].value) result++;
    }
    if (index + width <= UPPER_LIMIT && cells[index + width].value) result++;
    //If there are no surrounding bombs, recursively find the cell that has bombs around, also skip the cells that has been checked
    if (result === 0) {
        if (!cells[index].classList.contains("flag")) {
            cells[index].classList.add("clicked");
            cells[index].removeEventListener("contextmenu", flagListener);
        }
        if (index - width >= 0 && !cells[index - width].classList.contains("clicked")) checkSurroundingBombs(index - width);
        //For right most cells, skip checking the bombs on their right  
        if (index % width !== (width - 1)) {
            if (index + 1 <= UPPER_LIMIT && !cells[index + 1].classList.contains("clicked")) checkSurroundingBombs(index + 1);
            if (index - width + 1 >= 0 && !cells[index - width + 1].classList.contains("clicked")) checkSurroundingBombs(index - width + 1);
            if (index + width + 1 <= UPPER_LIMIT && !cells[index + width + 1].classList.contains("clicked")) checkSurroundingBombs(index + width + 1);
        }
        //For left most cells, skip defusing the bombs on their left  
        if (index % width !== 0) {
            if (index - 1 >= 0 && !cells[index - 1].classList.contains("clicked")) checkSurroundingBombs(index - 1);
            if (index + width - 1 <= UPPER_LIMIT && !cells[index + width - 1].classList.contains("clicked")) checkSurroundingBombs(index + width - 1);
            if (index - width - 1 >= 0 && !cells[index - width - 1].classList.contains("clicked")) checkSurroundingBombs(index - width - 1);
        }
        if (index + width <= UPPER_LIMIT && !cells[index + width].classList.contains("clicked")) checkSurroundingBombs(index + width);
    } else {
        if (!cells[index].classList.contains("flag")) {
            cells[index].classList.add("clicked");
            cells[index].removeEventListener("contextmenu", flagListener);
            cells[index].innerHTML = result;
        }
    }
}

function revealBoard(hasWon) {
    cells.forEach(function(cell) {
        cell.removeEventListener("click", cellListener);
        cell.removeEventListener("contextmenu", flagListener);
        checkSurroundingBombs(cells.indexOf(cell));
        if (cell.value === 1) {
            if (!hasWon) {
                cell.classList.add("bomb");
            } else {
                cell.classList.add("flag");
            }
            cell.innerHTML = "B";
        }
        if (cell.value === 0 && cell.classList.contains("flag")) {
            cell.classList.remove("flag");
            cell.classList.add("wrong");
            cell.innerHTML = "X";
        }
    });
}

function isGameOver(target, maxBomb) {
    var hasWon = false;
    if (target.value === 1) {
        target.classList.add("bomb");
        target.innerHTML = "B";
        revealBoard(hasWon);
        document.getElementById("gameOver").innerHTML = "YOU LOSE!"
    } else {
        var clickedCells = cells.filter(function(cell) {
            return cell.value === 0 && cell.classList.contains("clicked");
        });
        if (clickedCells.length === (width * height) - maxBomb) {
            hasWon = true
            revealBoard(hasWon);
            document.getElementById("gameOver").innerHTML = "YOU WIN!"
        }
    }

}

function flagListener(event) {
    event.preventDefault();
    event.target.innerHTML = (event.target.innerHTML === "F" ? "" : "F");
    event.target.classList.toggle("flag");
    if (event.target.classList.contains("flag")) {
        event.target.removeEventListener("click", cellListener);
    } else {
        event.target.addEventListener("click", cellListener);
    }
}

document.getElementById("newGame").addEventListener("click", function() {
    clearBoard(gameSection);
    displayBoard();
});

Array.prototype.forEach.call(document.querySelectorAll("input[type=radio]"), function(ele) {
    ele.addEventListener("change", function() {
        clearBoard(gameSection);
        displayBoard();
    });
});

displayBoard();

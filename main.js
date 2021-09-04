// TODO: FiraCode
// TODO: Fix game over being called before placement token changes

/**
 * Add click events to all circles in array
 * @param {HTMLCollection} placementCircles 
 */
function setupPlacementCircles(placementCircles) {
    for (let i = 0; i < placementCircles.length; i++) {
        placementCircles[i].index = i;
        placementCircles[i].addEventListener("click", placementCircleClick);
    }
}

/**
 * call wrapper for addToken (for growth)
 * @param {Element} caller 
 */
function placementCircleClick(placementCircle) {
    addToken(columns[placementCircle.target.index]);
}

/**
 * initalizes all columns 
 * @param {HTMLCollection} columns 
 */
function setupColumns(columns) {
    for (let i = 0; i < columns.length; i++) {
        columns[i].availableSlots = 6;
    };
}

/**
 * adds a token of current players color
 * @param {Element} column 
 */
function addToken(column) {
    if (column.availableSlots) {
        let targetCell = column.children[column.availableSlots - 1];
        targetCell.children[0].style.backgroundColor = isPlayer1Turn ? 'red' : 'blue';
        // Store who owns
        targetCell.player = isPlayer1Turn ? 1 : 2;
        column.availableSlots--;
        checkWin(outputText, targetCell);
        if (isGameOver) {
            gameOver(placementCircles);
            return;
        }
    }
    changeTurn(placementCircles, outputText);

}

/**
 * 
 * @param {HTMLCollection} placementCircles 
 * @param {Element} outputText
 */
function changeTurn(placementCircles, outputText) {
    isPlayer1Turn = !isPlayer1Turn;

    let textTurn = isPlayer1Turn ? "Player 1" : "Player 2";
    outputText.textContent = `Your turn ${textTurn}!`;

    let classRemove = isPlayer1Turn ? 'placement-circle-player2' : 'placement-circle-player1';
    let classAdd = isPlayer1Turn ? 'placement-circle-player1' : 'placement-circle-player2';
    for (let circle of placementCircles) {
        circle.classList.add(classAdd);
        circle.classList.remove(classRemove);
    }
}

/**
 * 
 * @param {HTMLCollection} columns 
 * @param {Element} outputText 
 * @param {Element} targetCell 
 * @returns 
 */
function checkWin(outputText, targetCell) {
    let winCheckResult = isVerticalConnect(targetCell);
    handleWinCheckResult(winCheckResult, outputText);


    winCheckResult = isHorizontalConnect(targetCell);
    handleWinCheckResult(winCheckResult, outputText);


    winCheckResult = isMainDiagnonalConnect(targetCell);
    handleWinCheckResult(winCheckResult, outputText);


    winCheckResult = isCrossDiagonalConnect(targetCell);
    handleWinCheckResult(winCheckResult, outputText);

}

function handleWinCheckResult(winCheckResult) {
    if (winCheckResult == 1) {
        outputWinner(winCheckResult, outputText);
        isGameOver = true;
    }
    else if (winCheckResult == 2) {
        outputWinner(winCheckResult, outputText);
        isGameOver = false;
    }
}

//TODO: refactor isVerticalConnect
function isVerticalConnect(targetCell) {
    // who played the token
    let player = targetCell.player;
    let orginalCell = targetCell;

    let count = 1;

    while (targetCell.top && targetCell.top.player == player) {

        targetCell = targetCell.top;
        count++;
    }
    targetCell = orginalCell;
    while (targetCell.bottom && targetCell.bottom.player == player) {

        targetCell = targetCell.bottom;
        count++;
    }

    if (count >= 4) return player;
    return -1;
}

function isMainDiagnonalConnect(targetCell) {
    let player = targetCell.player;
    let originalCell = targetCell;

    let count = 1;
    while (targetCell.topLeft && targetCell.topLeft.player == player) {
        targetCell = targetCell.topLeft;
        count++;
    }

    targetCell = originalCell;
    while (targetCell.bottomRight && targetCell.bottomRight.player == player) {
        targetCell = targetCell.bottomRight;
        count++;
    }

    if (count >= 4) return player;
    return -1;
}


function outputWinner(winner, outputText) {
    outputText.textContent = `Player ${winner} wins!`;
}

function isCrossDiagonalConnect(targetCell) {
    let player = targetCell.player;
    let originalCell = targetCell;

    let count = 1;
    while (targetCell.topRight && targetCell.topRight.player == player) {
        targetCell = targetCell.topRight;
        count++;
    }

    targetCell = originalCell;
    while (targetCell.bottomLeft && targetCell.bottomLeft.player == player) {
        targetCell = targetCell.bottomLeft;
        count++;
    }

    if (count >= 4) return player;
    return -1;
}

/**
 * 
 * @param {Element} targetCell 
 */
function isHorizontalConnect(targetCell) {
    // who played the token
    let player = targetCell.player;
    let orginalCell = targetCell;

    let count = 1;
    while (targetCell.left && targetCell.left.player == player) {
        targetCell = targetCell.left;
        count++;
    }

    targetCell = orginalCell;
    while (targetCell.right && targetCell.right.player == player) {
        targetCell = targetCell.right;

        count++;
    }

    if (count >= 4) return player;
    return -1;
}

function reset() {
    outputText.textContent = "Your turn Player 1!";

    for (let col = 0; col < 7; col++) {
        for (let row = 0; row < 6; row++) {
            let targetCell = columns[col].children[row].children[0];
            targetCell.style.backgroundColor = 'white';
            targetCell.player = 0;
            columns[col].availableSlots = 6;
            isPlayer1Turn = true;
        }
    }
    initialize(placementCircles);
}

/**
 * 
 * @param {HTMLCollection} placementCircle 
 */
function gameOver(placementCircles) {
    // drop placementCircle click event
    for (circle of placementCircles) {
        circle.removeEventListener("click", placementCircleClick);
    }
}

function initialize(placementCircles, columns) {
    setupPlacementCircles(placementCircles);
    storeNeighborCells(columns);
    isGameOver = false;
}

/**
 * Adds neighboring cells as properties of cell
 * @param {HTMLCollection} columns 
 */
function storeNeighborCells(columns) {
    for (let col = 0; col < 7; col++) {
        for (let row = 0; row < 6; row++) {
            let cell = columns[col].children[row];
            // left
            if (col > 0) {
                cell.left = columns[col - 1].children[row];
                // bottom left
                if (row < 5) cell.bottomLeft = columns[col - 1].children[row + 1];
                // top left
                if (row > 0) cell.topLeft = columns[col - 1].children[row - 1];
            }
            // right
            if (col < 6) {
                cell.right = columns[col + 1].children[row];
                // bottom right
                if (row < 5) cell.bottomRight = columns[col + 1].children[row + 1];
                // top right
                if (row > 0) cell.topRight = columns[col + 1].children[row - 1];
            }
            // top
            if (row > 0) {
                cell.top = columns[col].children[row - 1];
            }
            // bottom
            if (row < 5) {
                cell.bottom = columns[col].children[row + 1];
            }
        }
    }
}


// ***********    MAIN    *************
let placementCircles = document.getElementsByClassName("placement-circle");

let isGameOver;

let columns = document.getElementsByClassName("column");
setupColumns(columns);

let resetButton = document.getElementById("reset");
resetButton.addEventListener("click", reset);

let outputText = document.getElementById("output-text");

let isPlayer1Turn = true;

initialize(placementCircles, columns);

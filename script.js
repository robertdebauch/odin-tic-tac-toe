const gameboard = Gameboard();
const playerOne = createPlayer("playerOne", "X", 'human');

let currentGameController = null;
let selectedGameMode = null;

// const playerTwo = chooseGameMode();
// const playerTwo = createPlayer("playerTwo", "O", 'computer');
// const gameController = GameController(gameboard, playerOne, playerTwo);

const messageBoard = document.querySelector('.gamelog-info');
const startButton = document.querySelector('#start');
const pvpModeButton = document.querySelector('#pvp');
const pveModeButton = document.querySelector('#pve');

pvpModeButton.addEventListener('click', () => {
    pvpModeButton.classList.add('active');
    selectedGameMode = 'pvp';
    startButton.classList.remove('disabled');
    // and also choose this mode
});

pveModeButton.addEventListener('click', () => {
    pveModeButton.classList.add('active');
    selectedGameMode = 'pve';
    startButton.classList.remove('disabled');
    // and also choose this mode
});


function displayInformation(text) {
    let information = document.createElement('p');
    information.textContent = text;
    information.classList.add('infotext');
    messageBoard.appendChild(information);

    setTimeout(() => {
        messageBoard.scrollTop = messageBoard.scrollHeight;
    }, 10);
}

function clearInformation() {
    messageBoard.innerHTML = "";
}

function startGamePreparation() {

    pvpModeButton.classList.remove('active');
    pveModeButton.classList.remove('active');
    pvpModeButton.classList.add('disabled');
    pveModeButton.classList.add('disabled');
    startButton.classList.add('disabled');
    restartButton.classList.remove('disabled');
}

startButton.addEventListener('click', () => {
    let playerOne;
    let playerTwo;

    if (selectedGameMode === 'pvp') {
        playerOne = createPlayer("playerOne", "X", "human");
        playerTwo = createPlayer("playerTwo", "O", "human");
        startGamePreparation();

    } else if (selectedGameMode === 'pve') {
        playerOne = createPlayer("playerOne", "X", "human");
        playerTwo = createPlayer("playerTwo", "O", "computer");
        startGamePreparation();
    }

    currentGameController = GameController(gameboard, playerOne, playerTwo);

    currentGameController.startGame(selectedGameMode === 'pvp' ? 'PvP' : 'PvE');

});

const restartButton = document.querySelector('#restart');
restartButton.addEventListener('click', fullReset);


function Cell() {
    const EMPTY_CELL = "_";
    let value = EMPTY_CELL;

    const getValue = () => value;

    const setValue = (mark) => {
        value = mark;
    }

    const isEmpty = () => {
        if (value === EMPTY_CELL) {
            return true;
        } else {
            return false;
        }
    }

    return { setValue, getValue, isEmpty }
}

function renderBoard(gameboard) {
    if (!gameboard) {
        displayInformation('renderBoard: gameboard is undefined')
        return;
    }
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        if (isNaN(row) || isNaN(col)) {
            displayInformation(`Invalid row/col ${row} ${col}`)
            return;
        }
        const cellObj = gameboard.getCell(row, col);
        if (!cellObj) {
            displayInformation(`No cell at (${row},${col})`)
            return;
        }
        const cellValue = cellObj.getValue();
        if (cellValue === "_") {
            cell.textContent = "";
        } else {
            cell.textContent = cellValue;
        }
    });
}

function fullReset() {
    currentGameController = null;
    gameboard.createBoard();
    renderBoard(gameboard);
    clearInformation();
    pvpModeButton.classList.remove('disabled');
    pveModeButton.classList.remove('disabled');
    pvpModeButton.classList.remove('active');
    pveModeButton.classList.remove('active');
    restartButton.classList.add('disabled');
    startButton.classList.add('disabled');
    selectedGameMode = null;
}

function updateStatsUI(numberOfGames, playerOneWins, playerTwoWins, draws) {
    document.querySelector('#games_number').textContent = numberOfGames;
    document.querySelector('#one_stat').textContent = playerOneWins;
    document.querySelector('#two_stat').textContent = playerTwoWins;
    document.querySelector('#draw_stat').textContent = draws;
}

document.querySelectorAll('.cell').forEach(cell => {
    cell.addEventListener('click', () => {
        if (!currentGameController || !currentGameController.isGameActive()) return;
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        currentGameController.humanTurn(row, col, gameboard);
    })
})

function Gameboard() {
    const board = [];
    const rows = 3;
    const columns = 3;

    const createBoard = () => {
        for (let i = 0; i < rows; i++) {
            board[i] = [];

            for (let j = 0; j < columns; j++) {
                board[i].push(Cell());
            }
        }
    }

    createBoard();

    const printBoard = () => {
        for (let i = 0; i < board.length; i++) {
            console.log(board[i].map(cell => cell.getValue()).join(''));
        }
    }

    const winLines = [
        [[0, 0], [0, 1], [0, 2]],
        [[1, 0], [1, 1], [1, 2]],
        [[2, 0], [2, 1], [2, 2]],
        [[0, 0], [1, 0], [2, 0]],
        [[0, 1], [1, 1], [2, 1]],
        [[0, 2], [1, 2], [2, 2]],
        [[0, 0], [1, 1], [2, 2]],
        [[2, 0], [1, 1], [0, 2]],
    ]

    const getWinLines = () => {
        return winLines;
    }

    const getCell = (x, y) => {
        return board[x][y];
    }

    function checkWin(mark) {
        return winLines.some(line => line.every(([x, y]) => board[x][y].getValue() === mark));
    }

    function gameResult(success, winner) {
        return { success, winner }
    };

    // STEP 0
    const addMark = (x, y, mark) => {

        // STEP 1:
        if (x < board.length && y < board[x].length) {
            const cell = board[x][y];

            // STEP 2:
            if (cell.isEmpty()) {

                // displayInformation('cell is empty, proceed')

                cell.setValue(mark);
                printBoard();
                renderBoard(gameboard)
                const status = checkWin(mark);

                if (status === true) {
                    const weHaveWinner = gameResult(true, true);
                    console.log(weHaveWinner);
                    return weHaveWinner;

                } else if (status === false) {
                    displayInformation('WINNER? NO, NO WINNER YET!')
                    const noWinnerYet = gameResult(true, false);
                    console.log(noWinnerYet);
                    return noWinnerYet;
                }

            } else {
                displayInformation('cell is NOT empty, CHOOSE DIFFERENT CELL!');
                return false;
            }

        } else {
            return false;
        }

    }

    return { printBoard, addMark, checkWin, createBoard, getWinLines, getCell }
}


function createPlayer(name, mark, type = 'human') {
    return { name, mark, type }
}

function chooseGameMode() {
    let choice = prompt("Computer or human?", "");

    if (choice === 'computer') {
        return createPlayer("playerTwo", "O", "computer");
    } else if (choice === 'human') {
        return createPlayer("playerTwo", "O", "human");
    } else {
        return createPlayer("playerTwo", "O", "computer");
    }
}

function GameController(gameboard, playerOne, playerTwo) {

    let currentPlayer = playerOne;
    // let turnLimit = 9; 
    let turn = 0;
    let gameFinished = false;
    let gameResult;

    // function getCurrentPlayerType() {
    //     return currentPlayer.type;
    // } <- CAN BE USEFUL LATER?

    function isGameActive() {
        return !gameFinished;
    }

    function findBestMove(mark) {
        const winlines = gameboard.getWinLines();

        for (let i = 0; i < winlines.length; i++) {
            let line = winlines[i];
            let marksCount = 0;
            let threshold = 2;
            let emptyCellPosition = null;
            for (let j = 0; j < line.length; j++) {
                const [x, y] = line[j];
                const cell = gameboard.getCell(x, y);
                if (cell.getValue() === mark) {
                    marksCount++;
                } else if (cell.isEmpty()) {
                    emptyCellPosition = { x, y };
                }
            }
            //
            if (marksCount === threshold && emptyCellPosition) {
                return emptyCellPosition;
            }
        }
        return null;
    }

    function checkDraw() {
        if (turn === 9) {
            gameFinished = true;
            gameResult = { draw: true };
            displayInformation('DRAW! PLAY AGAIN!')
            stats.updateStats(gameResult);
            renderBoard(gameboard);
            return true;
        } else {
            return false;
        }
    }

    function switchPlayer() {
        currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
        turn++;
    }

    function humanTurn(row, col, gameboard) {
        const r = Number(row);
        const c = Number(col);

        if (isNaN(r) || isNaN(c)) return false;

        displayInformation(`round ${turn + 1} and ${currentPlayer.name} making his turn`)

        if (!isGameActive() || currentPlayer.type !== 'human') return false;
        if (!gameboard.getCell(r, c).isEmpty()) {
            displayInformation('THIS CELL IS NOT EMPTY! TRY AGAIN!')
            return false;
        }

        const result = gameboard.addMark(r, c, currentPlayer.mark);

        if (result === false) return false;

        if (result.winner === true) {
            gameFinished = true;

            displayInformation('WE HAVE A WINNER!');
            displayInformation(`it's ${currentPlayer.name}!`);
            gameResult = { winner: currentPlayer.name };
            stats.updateStats(gameResult);
            return true;
        }

        switchPlayer();
        checkDraw();

        renderBoard(gameboard);

        if (isGameActive() && currentPlayer.type === 'computer') {

            displayInformation('BEFORE WE MOVE ON');
            displayInformation('PLEASE READ THE MESSAGE FROM OUR SPONSOR');

            setTimeout(() => {
                computerTurn(gameboard);
            }, 500);
        }

        return true;
    }

    function computeMove() {

        const bestCompMove = findBestMove('O');
        if (bestCompMove) {

            displayInformation('THE COMPUTOR FOUND HIS THE BEST MOVE! HE IS READY TO USE IT! AND...');

            return bestCompMove;
        }

        const blockHumanMove = findBestMove('X');
        if (blockHumanMove) {

            displayInformation('HAHA! THE COMPUTER FOUND YOUR BEST MOVE!');
            displayInformation('HE IS GONNA BLOCK IT ANY MOMENT! AND...');

            return blockHumanMove;
        }

        let x;
        let y;
        let threshold = 3;

        do {
            x = Math.floor(Math.random() * threshold);
            y = Math.floor(Math.random() * threshold);
        } while (!gameboard.getCell(x, y).isEmpty());

        return { x, y };
    }

    function computerTurn() {
        if (!isGameActive() || currentPlayer.type !== 'computer') {
            return;
        }

        displayInformation(`round ${turn + 1} and ${currentPlayer.name} making his turn`);
        const coords = computeMove();
        const result = gameboard.addMark(coords.x, coords.y, currentPlayer.mark);

        if (result.winner === true) {
            gameFinished = true;
            displayInformation(`WE HAVE A WINNER!!!`);
            displayInformation(`YOU KNOW HIM! YOU LOVE HIM!`);
            displayInformation(`IT'S ${currentPlayer.name}!`);
            displayInformation(`'crowd noises'`);
            gameResult = { winner: currentPlayer.name, };
            stats.updateStats(gameResult);
            renderBoard(gameboard);
            return;
        }

        switchPlayer();
        checkDraw();

        renderBoard(gameboard);
    }

    const GameStatistic = () => {
        let playerOneWins = 0;
        let playerTwoWins = 0;
        let draws = 0;
        let numberOfGames = 0;

        const updateStats = (result) => {
            if (result.winner) {
                if (result.winner === playerOne.name) {
                    playerOneWins++;
                } else if (result.winner === playerTwo.name) {
                    playerTwoWins++;
                }
            } else if (result.draw === true) {
                draws++;
            }
            numberOfGames++;
            updateStatsUI(numberOfGames, playerOneWins, playerTwoWins, draws);
        }

        return { updateStats }
    }

    const stats = GameStatistic();

    function startGame(mode) {
        gameFinished = false;
        turn = 0;
        currentPlayer = playerOne;
        gameboard.createBoard();
        renderBoard(gameboard);
        clearInformation();
        displayInformation(`Game started in ${mode} mode`);
        
    }

    return { GameStatistic, humanTurn, computerTurn, isGameActive, startGame }
}


function initializeGame(gameboard, controller) {
    gameboard.printBoard();
    renderBoard(gameboard);
}



// initializeGame(gameboard, currentGameController);


const gameboard = Gameboard();
const playerOne = createPlayer("playerOne", "X", 'human');
// const playerTwo = chooseGameMode();
const playerTwo = createPlayer("playerTwo", "O", 'computer');
const gameController = GameController(gameboard, playerOne, playerTwo);

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
        console.error('renderBoard: gameboard is undefined');
        return;
    }
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        if (isNaN(row) || isNaN(col)) {
            console.error('Invalid row/col', row, col);
            return;
        }
        const cellObj = gameboard.getCell(row, col);
        if (!cellObj) {
            console.error(`No cell at (${row},${col})`);
            return;
        }
        const cellValue = cellObj.getValue();
        // cell.textContent = cellValue === "_" ? "" : cellValue;
        if (cellValue === "_") {
            cell.textContent = "";
        } else {
            cell.textContent = cellValue;
        }
    });
}

function updateStatsUI(numberOfGames, playerOneWins, playerTwoWins, draws) {
    document.querySelector('#games_number').textContent = numberOfGames;
    document.querySelector('#one_stat').textContent = playerOneWins;
    document.querySelector('#two_stat').textContent = playerTwoWins;
    document.querySelector('#draw_stat').textContent = draws;
}

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
            console.log('y is correct -> STEP 2');
            const cell = board[x][y];

            // STEP 2:
            if (cell.isEmpty()) {
                console.log('cell is empty, proceed');

                cell.setValue(mark);
                printBoard();
                renderBoard(gameboard)
                const status = checkWin(mark);

                if (status === true) {
                    const weHaveWinner = gameResult(true, true);
                    console.log(weHaveWinner);
                    return weHaveWinner;

                } else if (status === false) {
                    console.log('no winner yet')
                    const noWinnerYet = gameResult(true, false);
                    console.log(noWinnerYet);
                    return noWinnerYet;
                }

            } else {
                console.log('cell is NOT empty, back to STEP 0');
                return false;
            }

        } else {
            console.log('y is out of range, back to STEP 0');
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
            console.log('MESSAGE FROM OUR SPONSOR:');
            console.log('DRAW!');
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


        console.log(`round ${turn + 1} and ${currentPlayer.name} making his turn`);

        if (!isGameActive() || currentPlayer.type !== 'human') return false;
        if (!gameboard.getCell(r, c).isEmpty()) {
            console.log('THIS CELL IS NOT EMPTY! AGAIN!')
            return false;
        }

        const result = gameboard.addMark(r, c, currentPlayer.mark);

        if (result === false) return false;

        if (result.winner === true) {
            gameFinished = true;

            console.log('we have winner');
            console.log(`it's ${currentPlayer.name}!`)
            gameResult = { winner: currentPlayer.name };
            stats.updateStats(gameResult);
            return true;
        }

        switchPlayer();
        checkDraw();

        renderBoard(gameboard);

        if (isGameActive() && currentPlayer.type === 'computer') {
            console.log('BEFORE WE MOVE ON');
            console.log('PLEASE READ THE MESSAGE FROM OUR SPONSOR');
            setTimeout(() => {
                computerTurn(gameboard);
            }, 500);
        }

        return true;
    }

    function computeMove() {

        const bestCompMove = findBestMove('O');
        if (bestCompMove) {
            console.log('THE COMPUTER FOUND HIS THE BEST MOVE! HE IS READY TO USE IT! AND...')
            return bestCompMove;
        }

        const blockHumanMove = findBestMove('X');
        if (blockHumanMove) {
            console.log('THE COMPUTER FOUND YOUR BEST MOVE! HE IS GONNA BLOCK IT ANY MOMENT! AND...');
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

        console.log(`round ${turn + 1} and ${currentPlayer.name} making his turn`);
        const coords = computeMove();
        const result = gameboard.addMark(coords.x, coords.y, currentPlayer.mark);

        if (result.winner === true) {
            gameFinished = true;
            console.log('we have winner');
            console.log(`it's ${currentPlayer.name}!`)
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

    const newGame = () => {
        gameboard.createBoard();
        renderBoard(gameboard)
        currentPlayer = playerOne;
        turn = 0;
        gameResult = '';
        gameFinished = false;
    }

    const restartButton = document.querySelector('#restart');
    restartButton.addEventListener('click', newGame);


    return { GameStatistic, humanTurn, computerTurn, isGameActive }
}

document.querySelectorAll('.cell').forEach(cell => {
    cell.addEventListener('click', () => {
        if (!gameController.isGameActive()) return;
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        gameController.humanTurn(row, col, gameboard);
    })
})

function initializeGame(gameboard, controller) {
    gameboard.printBoard();
    renderBoard(gameboard);
}



initializeGame(gameboard, gameController);


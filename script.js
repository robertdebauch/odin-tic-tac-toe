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
                const status = checkWin(mark);

                if (status === true) {
                    console.log('we have winner');
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
    let turnLimit = 9;
    let turn = 0;
    let gameFinished = false;
    let gameResult;


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

    function createTurn(coordinates) {

        const makeTurn = () => {
            while (true) {

                const coords = coordinates();
                const outcome = gameboard.addMark(coords.x, coords.y, currentPlayer.mark);
                if (outcome !== false) {

                    console.log('outcome IS ' + outcome.winner)
                    return outcome;
                } else {
                    console.log('invalid values, please try again')
                }
            }
        }

        return { makeTurn }
    }

    function humanTurn() {
        let x = Number(prompt('choose x coordinate', ''));
        let y = Number(prompt('choose y coordinate', ''));
        return { x, y }
    }

    function computerTurn() {

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

    const GameStatistic = () => {
        let playerOneWins = 0;
        let playerTwoWins = 0;
        let draws = 0;
        let numberOfGames = 0;

        const updateStats = (result) => {
            if (result.winner) {
                if (result.name === playerOne.name) {
                    playerOneWins++;
                } else if (result.name === playerTwo.name) {
                    playerTwoWins++;
                }
            } else if (result.draw === true) {
                draws++;
            }
            numberOfGames++;
        }

        const showStats = () => {
            console.log(`Player One Statistic: ${playerOneWins}`);
            console.log(`Player Two Statistic: ${playerTwoWins}`);
            console.log(`Number of Draws: ${draws}`);
            console.log(`Total Number of Games: ${numberOfGames}`);
        }

        return { updateStats, showStats }
    }

    const stats = GameStatistic();

    const currentTurn = () => {
        let coordinates;

        console.log(`round ${turn + 1} and ${currentPlayer.name} making his turn`);

        if (currentPlayer.type === 'human') {
            coordinates = humanTurn;
        } else if (currentPlayer.type === 'computer') {
            coordinates = computerTurn;
        }
        const result = createTurn(coordinates).makeTurn();
        return result;
    }

    const gameCycle = () => {


        while (gameFinished === false) {

            while (turn < turnLimit) {

                const result = currentTurn();

                if (result.winner === true) {
                    console.log('AND THE WINNER IS...');
                    console.log(`${currentPlayer.name}`)

                    gameResult = { winner: currentPlayer.name };
                    stats.updateStats(gameResult);
                    gameFinished = true;
                    break;

                } else if (result.winner === false) {
                    currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne; // switch players
                    turn++;

                    if (turn === turnLimit) {
                        console.log('DRAW');
                        gameResult = { draw: true }
                        stats.updateStats(gameResult);
                        gameFinished = true;
                        break;
                    }
                }

                console.log(result);
            }

            console.log('current game status: ');
            console.log(`finished? ${gameFinished}`);
            console.log('and what is the result?');
            console.log(gameResult);

            stats.showStats();

            let question = confirm('Would you like to start new game?');


            if (question === true) {
                gameFinished = false;
                newGame();
            } else if (question === false) {
                console.log('Ok! You can restart next time.');
                break;
            }

        }
    }

    const newGame = () => {
        gameboard.createBoard();
        currentPlayer = playerOne;
        turn = 0;
        gameResult = '';
        gameFinished = false;
    }

    return { gameCycle, GameStatistic }
}


function initializeGame() {
    const gameboard = Gameboard();
    gameboard.printBoard();
    const playerOne = createPlayer("playerOne", "X", 'human');
    const playerTwo = chooseGameMode();
    const gameController = GameController(gameboard, playerOne, playerTwo);
    gameController.gameCycle();
}

initializeGame();
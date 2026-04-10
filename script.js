function Cell() {
    let value = "_";

    const getValue = () => value;

    const setValue = (mark) => {
        value = mark;
    }

    const isEmpty = () => {
        if (value === "_") {
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

    // new version    
    const createBoard = () => {
        for (let i = 0; i < rows; i++) {
            board[i] = [];

            for (let j = 0; j < columns; j++) {
                board[i].push(Cell());
            }
        }
        return board;
    }

    createBoard();

    // new version
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

    function checkWin(mark) {
        return winLines.some(line => line.every(([x, y]) => board[x][y].getValue() === mark));
    }

    // STEP 0
    const addMark = (x, y, mark) => {

        function gameResult(success, winner) {
            return { success, winner }
        };

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

    return { printBoard, addMark, checkWin, createBoard }
}

const gameboard = Gameboard();
gameboard.printBoard();

function createPlayer(name, mark, type = 'human') {
    return { name, mark, type }
}

const playerOne = createPlayer("playerOne", "X", 'human');
const playerTwo = createPlayer("playerTwo", "O", 'computer');


function GameController() {

    let currentPlayer = playerOne;
    let turnLimit = 9;
    let turn = 0;
    let gameFinished = false;
    let gameResult;

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
        let threshold = 3;
        let x = Math.floor(Math.random() * threshold);
        let y = Math.floor(Math.random() * threshold);

        return { x, y }
    }

    const GameStatistic = () => {
        let playerOneWins = 0;
        let playerTwoWins = 0;
        let draws = 0;
        let numberOfGames = 0;

        const updateStats = (result) => {
            if (result.winner) {
                if (currentPlayer.name === playerOne.name) {
                    playerOneWins++;
                } else if (currentPlayer.name === playerTwo.name) {
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

const gameController = GameController();
gameController.gameCycle();


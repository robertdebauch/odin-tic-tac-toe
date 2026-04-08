function Gameboard() {
    const board = [];
    const rows = 3;
    const columns = 3;

    // const createBoard = () => board;

    const createBoard = () => {
        for (let i = 0; i < rows; i++) {
            board[i] = [];

            for (let j = 0; j < columns; j++) {
                board[i].push('_');
            }
        }
        return board;
    }

    createBoard();


    const printBoard = () => {
        for (let i = 0; i < board.length; i++) {
            console.log(board[i].join(''));
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
        for (let i = 0; i < winLines.length; i++) {
            const line = winLines[i];
            const coord1 = board[line[0][0]][line[0][1]];
            const coord2 = board[line[1][0]][line[1][1]];
            const coord3 = board[line[2][0]][line[2][1]];
            if (coord1 === mark &&
                coord2 === mark &&
                coord3 === mark) {
                console.log('FOUND WIN LINE');
                return true;
            }
        }
        console.log('NO WIN LINES HERE');
        return false;
    }


    // STEP 0
    const addMark = (x, y, mark) => {

        function gameResult(success, winner) {
            return { success, winner }
        };

        let emptyCell = '_';
        // STEP 1:
        if (x < board.length) {
            console.log('x is correct -> STEP 2');

            // STEP 2:
            if (y < board[x].length) {
                console.log('y is correct -> STEP 3');

                // STEP 3:
                if (board[x][y] === emptyCell) {
                    console.log('cell is empty, proceed');

                    board[x][y] = mark;
                    printBoard();

                    let status = checkWin(mark);

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

        } else {
            console.log('x is out of range, back to STEP 0');
            return false;
        }

    }

    return { printBoard, addMark, checkWin, createBoard }
}

const gameboard = Gameboard();
gameboard.printBoard();

function createPlayer(name, mark) {
    return { name, mark }
}

const playerOne = createPlayer("playerOne", "X");
const playerTwo = createPlayer("playerTwo", "O");

function playerTurn(player, gameboard) {

    // const getValue = () => {
    //     console.log('getValue called');
    //     let x = Number(prompt('choose x coordinate', ''));
    //     let y = Number(prompt('choose y coordinate', ''));
    //     console.log('getValue finished, return value');
    //     return { x, y }
    // }

    const temporaryRandomValue = () => {
        let threshold = 3;
        let x = Math.floor(Math.random() * threshold);
        let y = Math.floor(Math.random() * threshold);
        console.log(x);
        console.log(y);

        return { x, y }
    }

    const makeTurn = () => {
        while (true) {

            // const coords = getValue();
            const coords = temporaryRandomValue();
            const OUTCOME = gameboard.addMark(coords.x, coords.y, player.mark);
            if (OUTCOME !== false) {

                console.log('OUTCOME IS ' + OUTCOME.winner)
                return OUTCOME;
            } else {
                console.log('invalid values, please try again')
            }
        }
    }

    return { makeTurn }
}


function GameController() {

    let currentPlayer = playerOne;
    let turnLimit = 9;
    let turn = 0;
    let gameFinished = false;
    let gameResult;

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
        console.log(`round ${turn + 1} and ${currentPlayer.name} making his turn`);
        const result = playerTurn(currentPlayer, gameboard).makeTurn();

        return result
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


/*
nothing to see here yet

function Cell() {
    let value = 0;

    const addPlayerMark = (player) => {
        value = addMark(); ???    
    }

    const getValue = () => value;

    return { addPlayerMark, getValue }
}

*/
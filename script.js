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
    
    /* game statistic is also an option, no? */
    /*
    function GameStatistic(playerOne, playerTwo, result) {
        let playerOneWinCount = 0;
        let playerTwoWinCount = 0;
        let drawCount = 0;

        const getGameStatistic = () => {
            if (playerOne is winner after the game is finished)
            return playerOneStat ++ 1
            else if (playerTwo is winner after the game is finished)
            return playerTwoStat ++ 1
            else (like if its a draw)
            return drawCount ++ 1
        }
            and what's next? don't know yet.
    }
        */

    const currentTurn = () => {
        console.log(`${currentPlayer.name} is making his turn`);
        const result = playerTurn(currentPlayer, gameboard).makeTurn();

        return result
    }

    const startGame = () => {

        if (gameFinished === true) {
            console.log('game is finished');
        } else {

            while (turn < turnLimit) {
                const result = currentTurn();

                if (result.winner === true) {
                    console.log('AND THE WINNER IS...');
                    console.log(`${currentPlayer.name}`)
                    break;
                } else if (result.winner === false) {
                    currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne; // switch players
                    
                    turn++;
                    if (turn === turnLimit) {
                        console.log('DRAW');
                        gameFinished = true;
                        break;
                    }
                }

                console.log(result);
                console.log('end');
            }
        }
        gameFinished = true;
        newGame();
    }

    const newGame = () => {
        let answer = confirm('Would you like to start new game?');
        if (gameFinished === true) {
            if (answer === true) {
                restartGame();
            } else if (answer === false) {
                console.log('Ok! You can restart next time. Just type gameController.restartGame()');
            }
        }
    }

    const restartGame = () => {

        gameboard.createBoard();
        currentPlayer = playerOne;
        turn = 0;
        gameFinished = false;
    
        startGame();
        console.log(`I see this if confirm dialog results in no?`)
    }

    return { startGame }
}

const gameController = GameController();
gameController.startGame();


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
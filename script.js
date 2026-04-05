function Gameboard() {
    const board = [];
    const rows = 3;
    const columns = 3;

    for (let i = 0; i < rows; i++) {

        board[i] = [];


        for (let j = 0; j < columns; j++) {
            board[i].push(' □ ');
        }
    }

    const createBoard = () => board;


    const printBoard = () => {
        for (let i = 0; i < board.length; i++) {
            console.log(board[i].join(''));
        }
    }

    // check winner
    // should be just array with arrays?
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


    // const checkWin = (mark) => {
    //     const lines = Object.values(winLines);

    //     for (let i = 0; i < Object.keys(winLines).length; i++) {
    //         console.log(i);
    //         if (board[x][y] === winLines.i[x][y]) {
    //             console.log('can we see the mark? ' + mark)
    //         } else {
    //             console.log('not the same')
    //         }
    //     }
    // }

    // easy mode
    const checkWin = (mark) => {
        console.log('start checking');

        if (board[0][0] === mark && board[0][1] === mark && board[0][2] === mark) {
            console.log('supersame 1 hor');
            return true;
        } else if (board[1][0] === mark && board[1][1] === mark && board[1][2] === mark) {
            console.log('supersame 2 hor');
            return true;
        } else if (board[2][0] === mark && board[2][1] === mark && board[2][2] === mark) {
            console.log('supersame 3 hor');
            return true;
        } else if (board[0][0] === mark && board[1][0] === mark && board[2][0] === mark) {
            console.log('supersame 4 ver ');
            return true;
        } else if (board[0][1] === mark && board[1][1] === mark && board[2][1] === mark) {
            console.log('supersame 5 ver');
            return true;
        } else if (board[0][2] === mark && board[1][2] === mark && board[2][2] === mark) {
            console.log('supersame 6 ver');
            return true;
        } else if (board[0][0] === mark && board[1][1] === mark && board[2][2] === mark) {
            console.log('supersame 7 diag');
            return true;
        } else if (board[2][0] === mark && board[1][1] === mark && board[0][2] === mark) {
            console.log('supersame 8 diag');
            return true;
        } else {
            console.log('no winner yet');
            return false;
        }
    }


    // STEP 0
    const addMark = (x, y, mark) => {

        function gameResult(success, winner) {

            return { success, winner }
        };

        let emptyCell = ' □ ';
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
                        console.log('no luck')
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

    return { printBoard, addMark, checkWin }
}

const gameboard = Gameboard();
gameboard.printBoard();

function createPlayer(player, mark) {
    return { player, mark }
}

const playerOne = createPlayer("playerOne", "X");
const playerTwo = createPlayer("playerTwo", "O");

function playerTurn(player, gameboard) {

    // const testCases = {
    //     case1: ['1,1', '1,2', '2,1', '2,2', '2,0', '0,1', '0,0', '1,0', '0,2']
    // }

    // console.log(testCases.case1)


    const getValue = () => {
        console.log('getValue called');
        let x = Number(prompt('choose x coordinate', ''));
        let y = Number(prompt('choose y coordinate', ''));
        console.log('getValue finished, return value');
        return { x, y }
    }

    const temporaryRandomValue = () => {
        console.log('getting random values');
        let threshold = 3;
        let x = Math.floor(Math.random() * threshold);
        let y = Math.floor(Math.random() * threshold);
        console.log('random values captured');
        console.log(x);
        console.log(y);

        return { x, y }
    }

    const makeTurn = () => {
        console.log('executing make turn');
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

const startGame = () => {
    let currentPlayer = playerOne;
    let turnLimit = 9;
    let turn = 0;

    while (turn < turnLimit) {
        const result = playerTurn(currentPlayer, gameboard).makeTurn();

        if (result.winner === true) {
            console.log('AND THE WINNER IS...');
            console.log(`${currentPlayer.player}`)
            break;
        } else if (result.winner === false) {
            currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne; // switch players
            turn++;
            if (turn === turnLimit) {
                console.log('DRAW');
                break;
            }
        }

        console.log('result is ' + result);
        console.log('end');
    }

}

startGame();
// playerTurn(playerOne, gameboard).makeTurn();
// playerTurn(playerTwo, gameboard).makeTurn();


// X win in the last turn
// gameboard.addMark(1, 1, 'X');
// gameboard.addMark(1, 2, 'O');
// gameboard.addMark(2, 1, 'X');
// gameboard.addMark(2, 2, 'O');
// gameboard.addMark(2, 0, 'X');
// gameboard.addMark(0, 1, 'O');
// gameboard.addMark(0, 0, 'X');
// gameboard.addMark(1, 0, 'O');
// gameboard.addMark(0, 2, 'X'); 

// DRAW
// gameboard.addMark(1, 1, 'X');
// gameboard.addMark(0, 2, 'O');
// gameboard.addMark(2, 1, 'X');
// gameboard.addMark(2, 2, 'O');
// gameboard.addMark(2, 0, 'X');
// gameboard.addMark(0, 1, 'O');
// gameboard.addMark(0, 0, 'X');
// gameboard.addMark(1, 0, 'O');
// gameboard.addMark(1, 2, 'X');

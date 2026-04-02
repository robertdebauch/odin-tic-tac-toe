// const board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

function Gameboard() {
    const board = []; // private
    const rows = 3; // private
    const columns = 3; // private

    for (let i = 0; i < rows; i++) {
        // create empty arrays
        board[i] = [];

        // fill with cells
        for (let j = 0; j < columns; j++) {
            board[i].push(' □ ');
        }
    }

    const createBoard = () => board; // board, don't return it YET
    // i will return it later somehow, when i need it to design ui?

    // draw board
    const printBoard = () => {
        for (let i = 0; i < board.length; i++) {
            console.log(board[i].join('')); // print board in console
        }
    }

    // add mark STEP 0
    const addMark = (x, y, mark) => {
        // console.log('can i see the board?');
        console.log(board + 'yes');

        let isValidMove;
        let emptyCell = ' □ '; // TEMPORARY

        // STEP 1:
        if (x < board.length) {
            console.log('x is correct, -> STEP 2');

            // STEP 2:
            if (y < board[x].length) {
                console.log('y is correct, -> STEP 3');

                // STEP 3:
                if (board[x][y] === emptyCell) {
                    console.log('cell is empty, proceed');

                    board[x][y] = mark;
                    printBoard();
                    return isValidMove = true;
                    // here is function call to change turn

                } else {
                    // here is function call to redo turn
                    console.log('cell is NOT empty, back to STEP 0');
                    return isValidMove = false;
                }

            } else {
                // here is function call to redo turn
                console.log('y is out of range, back to STEP 0');
                return isValidMove = false;
            }

        } else {
            // here is function call to redo turn
            console.log('x is out of range, back to STEP 0');
            return isValidMove = false;
        }
    }

    // return 
    return { printBoard, addMark }
}


const gameboard = Gameboard();
gameboard.printBoard();

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


function createPlayer(player, mark) {

    return { player, mark }
}

const playerOne = createPlayer("playerOne", "X");
const playerTwo = createPlayer("playerTwo", "O");

function playerTurn(player, gameboard) {

    

    const getValue = () => {
        console.log('getValue called');
        let x = Number(prompt('choose x coordinate', ''));
        let y = Number(prompt('choose y coordinate', ''));
        console.log('getValue finished, return value');
        return { x, y }
    }


    const makeTurn = () => { 
        console.log('executing make turn');
        const coords = getValue();
        return gameboard.addMark(coords.x, coords.y, player.mark); 
    }

    return { makeTurn }
}

playerTurn(playerOne, gameboard).makeTurn();
playerTurn(playerTwo, gameboard).makeTurn();
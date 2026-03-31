function Gameboard() {
    // coordinates 
    const x = 3; // rows
    const y = 3; // columns
    // to create board, i need to use indices like n-1?
    const board = [];
    
    for (i = 0; i < x; i++) {
        board[i] = [];
        
        for (j = 0; j < y; j++) {
            board[i].push(Cell());
        }
    }
    

    return board;
}

function Cell() {
    let value = "";

    const addMark = (playerMark) => {
        value = playerMark;
    };

    const getValue = () => value;

    return { addMark, getValue };
}



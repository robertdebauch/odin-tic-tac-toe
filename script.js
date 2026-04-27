// i should also create separate button for continue the game in current settings
// because there is no point in statistic if i reset it each time?

const gameboard = Gameboard();
const playerOne = createPlayer("playerOne", "X", 'human');

let currentGameController = null;
let selectedGameMode = null;

const UI = (function () {
    const elements = {
        cells: document.querySelectorAll('.cell'),
        messageBoard: document.querySelector('.gamelog-info'),
        numberOfGames: document.querySelector('#games_number'),
        playerOneWins: document.querySelector('#one_stat'),
        playerTwoWins: document.querySelector('#two_stat'),
        drawStat: document.querySelector('#draw_stat'),
        instructions: document.querySelectorAll('.step'),
        pvpModeButton: document.querySelector('#pvp'),
        pveModeButton: document.querySelector('#pve'),
        startButton: document.querySelector('#start'),
        restartButton: document.querySelector('#restart'),
        nextButton: document.querySelector('#next'),
        playerOneNameInput: document.querySelector('#playerOneNameInput'),
        playerTwoNameInput: document.querySelector('#playerTwoNameInput'),
        playerOneStatLabel: document.querySelector('#playerOne_stat'),
        playerTwoStatLabel: document.querySelector('#playerTwo_stat'),
        playerOneEditIcon: document.querySelector('#playerOneEditIcon'),
        playerTwoEditIcon: document.querySelector('#playerTwoEditIcon'),
    };

    function showEditHint(player, show) {
        let icon;

        if (player === 'playerOne') {
            icon = elements.playerOneEditIcon;
        } else if (player === 'playerTwo') {
            icon = elements.playerTwoEditIcon;
        }

        if (show) {
            icon.style.display = 'block';
        } else {
            icon.style.display = 'none';
        }
    }

    showEditHint('playerOne', false);
    showEditHint('playerTwo', false);


    function setPlayersInputs(mode) {
        const playerOne = elements.playerOneNameInput;
        const playerTwo = elements.playerTwoNameInput;

        playerOne.classList.remove('humanoid', 'player-two');
        playerTwo.classList.remove('humanoid', 'player-two');
        elements.playerOneStatLabel.classList.remove('humanoid', 'player-two');
        elements.playerTwoStatLabel.classList.remove('humanoid', 'player-two');

        if (mode === 'pvp') {
            playerOne.disabled = false;
            playerTwo.disabled = false;
            playerOne.value = 'Humanoid 1';
            playerTwo.value = 'Humanoid 2';
            playerOne.classList.add('humanoid');
            playerTwo.classList.add('player-two');
            elements.playerOneStatLabel.textContent = 'Humanoid 1 Wins';
            elements.playerTwoStatLabel.textContent = 'Humanoid 2 Wins';
            elements.playerOneStatLabel.classList.add('humanoid');
            elements.playerTwoStatLabel.classList.add('player-two');

            showEditHint('playerOne', true);
            showEditHint('playerTwo', true);

        } else if (mode === 'pve') {
            playerOne.disabled = false;
            playerTwo.disabled = true;
            playerOne.value = 'Humanoid';
            playerTwo.value = 'Computor';
            playerOne.classList.add('humanoid');
            playerTwo.classList.add('player-two');
            elements.playerOneStatLabel.textContent = 'Humanoid Wins';
            elements.playerTwoStatLabel.textContent = 'Computor Wins';
            elements.playerOneStatLabel.classList.add('humanoid');
            elements.playerTwoStatLabel.classList.add('player-two');

            showEditHint('playerOne', true);
            showEditHint('playerTwo', false);
        }
    }

    function enablePlayerInputs(enabled) {
        elements.playerOneNameInput.disabled = !enabled;
        elements.playerTwoNameInput.disabled = !enabled;
    }

    function getPlayerNames() {
        return {
            playerOne: elements.playerOneNameInput.value.trim() || 'Humanoid 1',
            playerTwo: elements.playerTwoNameInput.value.trim() || (elements.playerTwoNameInput.disabled ? 'Computor' : 'Humanoid 2'),
        };
    }

    function resetPlayersInfo() {
        elements.playerOneNameInput.value = 'Humanoid';
        elements.playerTwoNameInput.value = 'Opponent';
        elements.playerOneNameInput.disabled = true;
        elements.playerTwoNameInput.disabled = true;
        elements.playerTwoNameInput.classList.remove('computor', 'humanoid');
        elements.playerTwoNameInput.classList.add('humanoid');
        elements.playerOneStatLabel.textContent = 'Humanoid 1 Wins';
        elements.playerTwoStatLabel.textContent = 'Opponent Wins';
        showEditHint('playerOne', false);
        showEditHint('playerTwo', false);
    }

    function drawWinLine(winningLine) {
        const lineElement = document.querySelector('.win-line');

        if (!winningLine || !lineElement) {
            if (lineElement) {
                lineElement.style.display = 'none'
            }
            return;
        }

        // destructuring to choose correct lines
        const [firstCoord, , lastCoord] = winningLine;
        const firstCell = document.querySelector(`.cell[data-row="${firstCoord[0]}"][data-col="${firstCoord[1]}"]`);
        const lastCell = document.querySelector(`.cell[data-row="${lastCoord[0]}"][data-col="${lastCoord[1]}"]`);

        if (!firstCell || !lastCell) {
            lineElement.style.display = 'none';
            return;
        }

        const boundingBox = document.querySelector('.gameboard').getBoundingClientRect();
        const firstCellBB = firstCell.getBoundingClientRect();
        const lastCellBB = lastCell.getBoundingClientRect();

        // center of the first cell bb
        const x1 = firstCellBB.left + firstCellBB.width / 2 - boundingBox.left;
        const y1 = firstCellBB.top + firstCellBB.height / 2 - boundingBox.top;

        // center of the last cell bb
        const x2 = lastCellBB.left + lastCellBB.width / 2 - boundingBox.left;
        const y2 = lastCellBB.top + lastCellBB.height / 2 - boundingBox.top;

        // delta
        const dx = x2 - x1;
        const dy = y2 - y1;

        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;

        // render settings
        lineElement.style.display = 'block';
        lineElement.style.width = length + 'px';
        lineElement.style.left = x1 + 'px';
        lineElement.style.top = (y1 - 4) + 'px';
        lineElement.style.transform = `rotate(${angle}deg)`;
    }


    function renderBoard(gameboard) {

        if (!gameboard) {
            displayInformation('renderBoard: gameboard is undefined')
            return;
        }

        const winningLine = gameboard.getWinningLine();
        const gameOver = winningLine !== null || gameboard.isBoardFull();

        elements.cells.forEach(cell => {
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
            const prevValue = cell.textContent;

            if (cellValue === "_") {
                cell.textContent = "";
            } else {
                cell.textContent = cellValue;
            }

            let stateDescription;
            if (cellValue === "_") {
                stateDescription = "EMPTY";
            } else {
                stateDescription = `MARKED ${cellValue}`;
            }
            cell.setAttribute('aria-label', `cell, row ${row + 1}, column ${col + 1}, ${stateDescription}`);


            if (cellValue !== "_" && cell.textContent !== prevValue) {
                cell.classList.add('pop');

                function handleAnimationEnd() {
                    cell.classList.remove('pop');
                    cell.removeEventListener('animationend', handleAnimationEnd);
                }

                cell.addEventListener('animationend', handleAnimationEnd);
            }

            cell.classList.remove('mark-x', 'mark-o');
            if (cellValue === 'X') cell.classList.add('mark-x');
            else if (cellValue === 'O') cell.classList.add('mark-o');

            cell.classList.remove('winning-cell');
            cell.classList.remove('neutral-cell');

            if (winningLine) {
                const winAchieved = winningLine.some(([x, y]) => x === row && y === col);
                if (winAchieved) {
                    cell.classList.add('winning-cell');
                }
            }

            if (gameOver) {
                const isCellInWinningLine = winningLine
                    ? winningLine.some(([x, y]) => x === row && y === col)
                    : false;

                if (!isCellInWinningLine) {
                    cell.classList.add('neutral-cell');
                }
            }
        });

        if (winningLine) {
            drawWinLine(winningLine);
        } else {
            const lineElement = document.querySelector('.win-line');
            if (lineElement) {
                lineElement.style.display = 'none';
            }
        }
    }

    function displayInformation(text) {
        let infotext = document.createElement('p');
        infotext.textContent = text;
        infotext.classList.add('infotext');
        elements.messageBoard.appendChild(infotext);

        setTimeout(() => {
            elements.messageBoard.scrollTop = elements.messageBoard.scrollHeight;
        }, 10);
    }

    function clearInformation() {
        elements.messageBoard.innerHTML = "";
    }

    function updateStatsUI(numberOfGames, playerOneWins, playerTwoWins, draws) {
        elements.numberOfGames.textContent = numberOfGames;
        elements.playerOneWins.textContent = playerOneWins;
        elements.playerTwoWins.textContent = playerTwoWins;
        elements.drawStat.textContent = draws;
    }

    function updateStatLabels(playerOneName, playerTwoName) {
        elements.playerOneStatLabel.textContent = playerOneName + ` Wins`;
        elements.playerTwoStatLabel.textContent = playerTwoName + ` Wins`;
    }

    function highlightStep(currentStep) {
        elements.instructions.forEach((step) => {
            step.classList.remove('active');
        });

        currentStep.classList.add('active');
    }

    function setModeButtonsStatus(mode) {

        if (mode === 'pvp') {
            elements.pvpModeButton.classList.add('active');
            elements.pveModeButton.classList.remove('active');
        } else if (mode === 'pve') {
            elements.pveModeButton.classList.add('active');
            elements.pvpModeButton.classList.remove('active');
        } else {
            elements.pvpModeButton.classList.remove('active');
            elements.pveModeButton.classList.remove('active');
        }

    }

    function setGameModeState({ startEnabled, continueEnabled, restartEnabled, }) {

        if (startEnabled !== undefined) {
            elements.startButton.classList.toggle('disabled', !startEnabled);
        }

        if (continueEnabled !== undefined) {
            elements.nextButton.classList.toggle('disabled', !continueEnabled);
        }

        if (restartEnabled !== undefined) {
            elements.restartButton.classList.toggle('disabled', !restartEnabled);
        }


    };


    function getElement(key) {
        return elements[key];
    }

    return {
        setPlayersInputs, enablePlayerInputs, getPlayerNames, resetPlayersInfo, renderBoard, displayInformation, clearInformation, updateStatsUI,
        updateStatLabels, highlightStep, setModeButtonsStatus, setGameModeState, showEditHint, getElement,
    };
})();

UI.highlightStep(document.querySelector('.first-step'));

UI.getElement('pvpModeButton').addEventListener('click', () => {

    UI.setModeButtonsStatus('pvp');
    UI.setPlayersInputs('pvp');
    selectedGameMode = 'pvp';

    UI.setGameModeState({
        startEnabled: true,
        restartEnabled: false
    });

    UI.highlightStep(document.querySelector('.second-step'));
});

UI.getElement('pveModeButton').addEventListener('click', () => {

    UI.setModeButtonsStatus('pve');
    UI.setPlayersInputs('pve');
    selectedGameMode = 'pve';

    UI.setGameModeState({
        startEnabled: true,
        restartEnabled: false
    });

    UI.highlightStep(document.querySelector('.second-step'));
});

UI.getElement('startButton').addEventListener('click', () => {

    if (!selectedGameMode) {
        return;
    }

    const playerNames = UI.getPlayerNames();
    const playerOne = createPlayer(playerNames.playerOne, "X", "human");

    let playerTwo;

    if (selectedGameMode === 'pvp') {
        playerTwo = createPlayer(playerNames.playerTwo, "O", "human");
    } else {
        playerTwo = createPlayer(playerNames.playerTwo, "O", "computer");
    }

    UI.enablePlayerInputs(false);
    UI.setGameModeState({ startEnabled: false, continueEnabled: false, restartEnabled: false });
    UI.setModeButtonsStatus(null);
    UI.getElement('pvpModeButton').classList.add('disabled');
    UI.getElement('pveModeButton').classList.add('disabled');

    currentGameController = GameController(gameboard, playerOne, playerTwo);
    currentGameController.startGame(selectedGameMode);

});

UI.getElement('restartButton').addEventListener('click', fullReset);

const nextButton = UI.getElement('nextButton');

if (nextButton) {
    nextButton.addEventListener('click', () => {
        if (currentGameController) {
            currentGameController.nextRound();
        }
    });
}

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

function fullReset() {
    currentGameController = null;
    gameboard.createBoard();
    UI.renderBoard(gameboard);
    UI.clearInformation();
    UI.updateStatsUI(0, 0, 0, 0);
    UI.getElement('pvpModeButton').classList.remove('disabled');
    UI.getElement('pveModeButton').classList.remove('disabled');
    UI.setModeButtonsStatus(null);
    UI.setGameModeState({
        startEnabled: false,
        continueEnabled: false,
        restartEnabled: false,
    });

    UI.showEditHint('playerOne', false);
    UI.showEditHint('playerTwo', false);

    selectedGameMode = null;

    UI.resetPlayersInfo();
    UI.enablePlayerInputs(false);
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

    let winningLine = null;

    const setWinningLine = (line) => {
        winningLine = line;
    };

    const getWinningLine = () => winningLine;

    const clearWinningLine = () => {
        winningLine = null;
    };

    const createBoard = () => {
        for (let i = 0; i < rows; i++) {
            board[i] = [];

            for (let j = 0; j < columns; j++) {
                board[i].push(Cell());
            }
        }
        clearWinningLine();
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

        const winningLine = winLines.find(line =>
            line.every(([x, y]) => board[x][y].getValue() === mark)
        );

        if (winningLine) {
            return winningLine;
        } else {
            return null;
        }

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

                cell.setValue(mark);
                printBoard();
                UI.renderBoard(gameboard)
                const status = checkWin(mark);

                if (Array.isArray(status)) {
                    setWinningLine(status);
                    const weHaveWinner = gameResult(true, true);
                    console.log(weHaveWinner);
                    return weHaveWinner;

                } else {
                    UI.displayInformation('WINNER? NO, NO WINNER YET!')
                    const noWinnerYet = gameResult(true, false);
                    console.log(noWinnerYet);
                    return noWinnerYet;
                }

            } else {
                UI.displayInformation('cell is NOT empty, CHOOSE DIFFERENT CELL!');
                return false;
            }

        } else {
            return false;
        }

    }

    function isBoardFull() {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                if (board[i][j].isEmpty()) return false;
            }
        }
        return true;
    }



    return { printBoard, addMark, checkWin, createBoard, getWinLines, getCell, setWinningLine, getWinningLine, clearWinningLine, isBoardFull }
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
    let turn = 0;
    let gameFinished = false;
    let gameResult;

    function endGame() {
        UI.highlightStep(document.querySelector('.fourth-step'));
        UI.setGameModeState({ continueEnabled: true, restartEnabled: true });
    }

    function nextRound() {
        if (!gameFinished) {
            return;
        }

        UI.setGameModeState({
            continueEnabled: false, restartEnabled: false,
        });

        gameFinished = false;
        turn = 0;
        currentPlayer = playerOne;
        UI.updateStatLabels(playerOne.name, playerTwo.name);
        gameboard.createBoard();
        UI.clearInformation();
        UI.renderBoard(gameboard);
        UI.highlightStep(document.querySelector('.third-step'));
        UI.displayInformation('NEXT ROUND!');
        UI.displayInformation('MAKE MOVES! DO IT!');
    }

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
            endGame();
            gameResult = { draw: true };
            UI.displayInformation('DRAW! PLAY AGAIN!')
            stats.updateStats(gameResult);
            UI.renderBoard(gameboard);
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

        UI.displayInformation(`round ${turn + 1} and ${currentPlayer.name} making his turn`)

        if (!isGameActive() || currentPlayer.type !== 'human') return false;
        if (!gameboard.getCell(r, c).isEmpty()) {
            UI.displayInformation('THIS CELL IS NOT EMPTY! TRY AGAIN!')
            return false;
        }

        const result = gameboard.addMark(r, c, currentPlayer.mark);

        if (result === false) return false;

        if (result.winner === true) {
            gameFinished = true;
            endGame();

            UI.displayInformation('WE HAVE A WINNER!');
            UI.displayInformation(`it's ${currentPlayer.name}!`);
            gameResult = { winner: currentPlayer.name };
            stats.updateStats(gameResult);
            UI.renderBoard(gameboard);
            return true;
        }

        switchPlayer();
        checkDraw();

        UI.renderBoard(gameboard);

        if (isGameActive() && currentPlayer.type === 'computer') {

            UI.displayInformation('BEFORE WE MOVE ON');
            UI.displayInformation('PLEASE READ THE MESSAGE FROM OUR SPONSOR');

            setTimeout(() => {
                computerTurn(gameboard);
            }, 500);
        }

        return true;
    }

    function computerMove() {
        const winMove = findBestMove('O');

        if (winMove) {
            UI.displayInformation('THE COMPUTOR HAS FOUND A WAY TO WIN!');
            UI.displayInformation('AND...');
            return winMove;
        }

        const blockHumanMove = findBestMove('X');
        if (blockHumanMove) {
            UI.displayInformation('HAHA! THE COMPUTER FOUND YOUR BEST MOVE!');
            UI.displayInformation('HE IS GONNA BLOCK IT ANY MOMENT! AND...');
            return blockHumanMove;
        }

        return getUltraMove();
    }

    function getUltraMove() {
        const center = { x: 1, y: 1 };
        if (gameboard.getCell(1, 1).isEmpty()) {
            return center;
        }

        const corners = [
            { x: 0, y: 0 },
            { x: 0, y: 2 },
            { x: 2, y: 0 },
            { x: 2, y: 2 }
        ];

        const humanCorners = corners.filter(corner => gameboard.getCell(corner.x, corner.y).getValue() === 'X');

        if (humanCorners.length === 2) {
            const emptyCorner = corners.find(corner => gameboard.getCell(corner.x, corner.y).isEmpty());

            if (emptyCorner) {
                return emptyCorner;
            }
        }

        const randomizedCorners = [...corners].sort(() => Math.random() - 0.5);

        for (let corner of randomizedCorners) {
            if (gameboard.getCell(corner.x, corner.y).isEmpty()) {
                return corner;
            }
        }

        const edges = [
            { x: 0, y: 1 },
            { x: 1, y: 0 },
            { x: 1, y: 2 },
            { x: 2, y: 1 }
        ];

        const randomizedEdges = [...edges].sort(() => Math.random() - 0.5);

        for (let edge of randomizedEdges) {
            if (gameboard.getCell(edge.x, edge.y).isEmpty()) {
                return edge;
            }
        }

        return null;
    }

    function computerTurn() {
        if (!isGameActive() || currentPlayer.type !== 'computer') {
            return;
        }

        UI.displayInformation(`round ${turn + 1} and ${currentPlayer.name} making his turn`);
        const coords = computerMove();
        const result = gameboard.addMark(coords.x, coords.y, currentPlayer.mark);

        if (result.winner === true) {
            gameFinished = true;
            endGame();
            UI.displayInformation(`WE HAVE A WINNER!!!`);
            UI.displayInformation(`YOU KNOW HIM! YOU LOVE HIM!`);
            UI.displayInformation(`IT'S ${currentPlayer.name}!`);
            UI.displayInformation(`'crowd noises'`);
            gameResult = { winner: currentPlayer.name, };
            stats.updateStats(gameResult);
            UI.renderBoard(gameboard);
            return;
        }

        switchPlayer();
        checkDraw();

        UI.renderBoard(gameboard);
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
            UI.updateStatsUI(numberOfGames, playerOneWins, playerTwoWins, draws);
        }

        return { updateStats }
    }

    const stats = GameStatistic();

    function startGame(mode) {
        gameFinished = false;
        turn = 0;
        currentPlayer = playerOne;
        UI.updateStatLabels(playerOne.name, playerTwo.name);
        gameboard.createBoard();
        UI.renderBoard(gameboard);
        UI.clearInformation();
        UI.highlightStep(document.querySelector('.third-step'));
        UI.displayInformation(`Game started in ${mode} mode`);
        UI.showEditHint('playerOne', false);
        UI.showEditHint('playerTwo', false);
    }

    return { GameStatistic, humanTurn, computerTurn, isGameActive, startGame, nextRound }
}

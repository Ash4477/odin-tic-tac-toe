const GameBoard = function() {
    const board = Array.from(document.querySelectorAll('.game-box > div'));
    const cols = 3;
    const rows = 3;

    const getCellValue = (position) => board[position].textContent;

    const checkWin = (playerSign) => {
        if (checkRows(playerSign) || checkCols(playerSign) || checkDiagonals(playerSign)) {
            return true;
        }
        return false;
    };

    const checkDraw = () => {
        return board.filter(cell => cell.textContent === "-").length === 0;
    };

    const checkRows = (playerSign) => {
        for (let i = 0; i < rows*cols; i += 3) {
            if ((getCellValue(i) === playerSign) && 
                (getCellValue(i+1) === playerSign) && 
                (getCellValue(i+2) === playerSign)) {
                return true;
            }
        }
        return false;
    };

    const checkCols = (playerSign) => {
        for (let i = 0; i < cols; i++) {
            console.log(i +" " + getCellValue(i) + " COL " + playerSign);
            if ((getCellValue(i) === playerSign) && (getCellValue(i+3) === playerSign) && (getCellValue(i+6) === playerSign)) {
                return true;
            }
        }
        return false;
    };

    const checkDiagonals = (playerSign) => {
        if ((getCellValue(0) === playerSign) && (getCellValue(4) === playerSign) && (getCellValue(8) === playerSign)) return true;
        if ((getCellValue(2) === playerSign) && (getCellValue(4) === playerSign) && (getCellValue(6) === playerSign)) return true;
        return false;

    };

    const resetBoard = () => board.forEach(div => {
        div.textContent = '-'
    });

    return { resetBoard, checkWin, checkDraw };
} ();

const GameController = function(player1, player2) {
    let activePlayer = player1;

    const init = () => {
        displayBoard();
        renderPlayerTags();

        // activating cells
        const cells = Array.from(document.querySelectorAll('.game-box > div'));
        cells.forEach(cell => {
            cell.addEventListener('click', () => {
                if (cell.textContent !== "-") return

                cell.textContent = activePlayer.getSign();
                if (GameBoard.checkWin(activePlayer.getSign())) {
                    endGame("win");
                    return;
                };
                if (GameBoard.checkDraw()) {
                    endGame("draw")
                }
                toggleActivePlayer();
            });
        });
    };

    const endGame = (state) => {
        const dialog = document.querySelector('.win-box');
        const winText = dialog.querySelector('h2');
        const playAgainBtn = dialog.querySelector('button');

        if (state === 'win') winText.textContent = `"${activePlayer.getName()}" Won`;
        else winText.textContent = `It's a Draw`;
        
        dialog.showModal();
        playAgainBtn.addEventListener("click", () => {
            dialog.close();
            GameBoard.resetBoard();
        });
    };

    const renderPlayerTags = () => {
        document.querySelector('.score-board').classList.remove("hide");
        const player1Tag = document.querySelector('.score-board > p:first-child');
        const player2Tag = document.querySelector('.score-board > p:last-child');

        player1Tag.textContent = player1.getName() + ": " + player1.getSign();
        player2Tag.textContent = player2.getName() + ": " + player2.getSign();
    }

    const displayBoard = () => {
        const parent = document.querySelector('.game-box');
        parent.classList.remove("hide");
    }

    const toggleActivePlayer = () => {
        if (activePlayer === player1) {
            activePlayer = player2
        } else {
            activePlayer = player1;
        }
    };

    init();
};

const Player = (name, sign) => {
    const getName = () => name;
    const getSign = () => sign;

    return { getName, getSign };
};

const startGame = () => {
    const startButton = document.querySelector('.start');
    const dialog = document.querySelector('dialog');
    const playButton = document.querySelector('.play');
    startButton.addEventListener("click", () => {
        startButton.parentNode.removeChild(startButton);
        dialog.showModal();
    });
    playButton.addEventListener("click", (event) => {
        event.preventDefault();
        const player1 = Player(document.querySelector(".p1").value, "X");
        const player2 = Player(document.querySelector(".p2").value, "O");
        dialog.close();
        GameController(player1, player2);
    })
};

startGame();
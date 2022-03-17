class Game {

    constructor(player1, player2) {
        this._playing = false;
        this._player1 = player1;
        this._player2 = player2;
        this._turn = player1;
        this._board = null;
        this._pieces_placed = 4;
        this._possible_moves = new Array();
    }

    get turn() {
        return this._turn;
    }

    get opponent() {
        return this._turn == this._player1 ? this._player2 : this._player1;
    }

    get board() {
        return this._board;
    }

    move_directions = [
        { row: -1, col: 0 },
        { row: -1, col: 1 },
        { row: 0, col: 1 },
        { row: 1, col: 1 },
        { row: 1, col: 0 },
        { row: 1, col: -1 },
        { row: 0, col: -1 },
        { row: -1, col: -1 },
    ]

    /**
     * Create new board
     * @param {number} length -> board length 
     */
    newBoard(length) {
        this._board = new Board(length);
    }


    /**
     * Starts a new game; 
     * calls all methods to initialize the game
     * @param {*} board_length -> board length 
     */
    newGame(board_length) {

        this._player1.color == "white" ? this._turn = this._player1 : this._turn = this._player2;

        this._playing = true;
        this.newBoard(board_length); // create Board
        this.board.printBoard(); // print board
        this.fillBoard(); //  add Cells and pieces
        this.addEventsToBoard(); // add listeners to board
        this.board.fillLayout(this._player1, this._player2); // add players to layout
        this.getMoves();

    }

    /**
     * fills Board() with Cell() and Piece()
     */
    fillBoard() {

        // create cells
        for (let row = 1; row <= this._board.length; row++) {
            for (let col = 1; col <= this._board.length; col++) {
                this._board.addCell(new Cell(row, col));
            }
        }

        // add starting pieces
        let starting_pieces = [
            { row: this._board.length / 2, col: this._board.length / 2, color: "white" },
            { row: this._board.length / 2, col: this._board.length / 2 + 1, color: "black" },
            { row: this._board.length / 2 + 1, col: this._board.length / 2, color: "black" },
            { row: this._board.length / 2 + 1, col: this._board.length / 2 + 1, color: "white" },
        ]


        let cell;
        starting_pieces.forEach(piece => {

            // create Pieces
            cell = this.getCell(piece.row, piece.col)
            cell.piece = piece.color

            // print to board
            this._board.placePiece(piece.row, piece.col, piece.color)
        });

    }

    /**
     * Adds event listeners to board
     */
    addEventsToBoard() {

        //surrender buttons
        $("#p1-surrender").click(() => {
            this.surrender(this._player1)
        });

        $("#p2-surrender").click(() => {
            this.surrender(this._player2)
        });


        // board cells
        for (let row = 1; row <= this.board.length; row++) {
            for (let col = 1; col <= this.board.length; col++) {

                $(`#${row}-${col}`).on("click", () => {

                    if (this._playing) {

                        // check mpove
                        if (this._possible_moves.find(cell => cell.row == row && cell.col == col)) 
                            this.placePiece(row, col)

                        else if (this.getCell(row, col).isEmpty()){
                           
                            // display wrong move toast
                            Swal.fire({
                                toast: true,
                                title: '<p style="text-align: center"> nonono </p>',
                                icon: "warning",
                                position: 'center',
                                showConfirmButton: false,
                                timer: 1000,
                                width: '25%',
                            })

                        }

                    }

                });

            }
        }

    }

    /**
     * retrieves cell() with given coordinates
     * @param {number} row -> cell row
     * @param {number} col -> cell col
     * @returns cell object
     */
    getCell(row, col) {
        return this._board.cells.find(cell => cell.row == row && cell.col == col);
    }

    /**
     * retrieves all empty cells
     * @returns array of Pieces
     */
    getEmptyCells() {
        return this._board.cells.find(cell => cell.piece == null);
    }

    /**
     * retrieves cells with pieces that match the color
     * @param {string} color -> piece color
     * @returns array of Pieces
     */
    getPieces(color) {
        return this._board.cells.filter(cell => cell.piece == color)
    }

    /**
     * Get current player all possible moves
     */
    getMoves() {

        let cells = this.getPieces(this._turn.color);

        for (let cell of cells) {
            for (let move of this.move_directions) {

                // check if move is possible
                let move_result = this.checkMove(cell.row, cell.col, move.row, move.col, this.turn.color)
                if (move_result) 
                    this._possible_moves.push(move_result)
                
            }
        }

        // show moves on board 
        for (let move of this._possible_moves) 
            this._board.showMove(move.row, move.col, this.turn.color)
        
    }

    /**
     * Iterates from starting position in given direction, until determine if move is possible
     * @param {number} row -> starting row
     * @param {number} col -> starting col
     * @param {number} move_row -> row move direction
     * @param {number} move_col -> col move direction
     * @param {boolean} opponent_piece -> whether an opponeny piece has been found or not 
     * @returns -> if move is possible, returns the coordinate, else false
     */
    checkMove(row, col, move_row, move_col, color, opponent_piece = false) {

        // check if moves are inside the board
        if (!this.isMoveInsideBoard(row + move_row, col + move_col)) 
            return false
        
        // check move
        else {
            
            // ally piece foudnn, or empty space without finding previously an enemy piece
            if (this.getCell(row + move_row, col + move_col).piece == color || (!opponent_piece && !this.getCell(row + move_row, col + move_col).piece)) 
                return false

            // empty space with enemy piece previously 
            else if (this.getCell(row + move_row, col + move_col).piece == null && opponent_piece) 
                return { row: row + move_row, col: col + move_col, id: `${row + move_row}-${col + move_col}` }

            // enemy piece
            else if (this.getCell(row + move_row, col + move_col).piece != color) 
                return this.checkMove(row + move_row, col + move_col, move_row, move_col, color, true)
            
        }

    }

    /**
     * Checks if given position is inside the board
     * @param {number} row 
     * @param {number} col 
     * @returns -> true if is inside the board, else false
     */
    isMoveInsideBoard(row, col){
        return (row < 1 || row > this._board.length || col < 1 || col > this._board.length) ? false : true
    }

    /**
     * place piece in given position
     * @param {number} row 
     * @param {number} col 
     */
    placePiece(row, col) {

        this._board.hideMoves()
        this._possible_moves = []

        // place piece
        this.getCell(row, col).piece = this._turn.color
        this._board.placePiece(row, col, this._turn.color)

        this.checkCapturedPieces(row, col)

        // check if all pieces have been placed
        if (this._pieces_placed == Math.pow(this._board.cells.length, 2))
            this.endGame()

        // check if opponent has moves left
        else if (!this.checkMovesLeft(this.opponent)){

            // check if current player has moves left
            if (!this.checkMovesLeft(this.turn)) 
                //if both players have no moves left, end the game
                this.endGame()
            
            // if opponent no moves left skip turn
            else
                this.getMoves()
            
        } else
            this.changeTurn()

    }

    /**
     * captured pieces during move
     * @param {number} row -> row of placed piece
     * @param {number} col -> cell of placed piece
     */
    checkCapturedPieces(row, col) {

        let captured_pieces = 0;
        let captured = false;
        let row_aux = row;
        let col_aux = col;

        // check pieces to capture in every direction
        for (let move of this.move_directions) {

            // search for opponent pieces
            while (this.isMoveInsideBoard(row_aux + move.row, col_aux + move.col) && 
                    this.getCell(row_aux + move.row, col_aux + move.col).piece == this.opponent.color && !captured ) {

                // look for another piece of the same color in the next cell
                if (this.isMoveInsideBoard(row_aux + move.row * 2, col_aux + move.col * 2) && 
                    this.getCell(row_aux + move.row * 2, col_aux + move.col * 2).piece == this.turn.color) {
                    
                    // if so capture all pieces in between
                    captured_pieces += this.captureFromTo(row, col, row_aux + move.row , col_aux + move.col, move.row, move.col)
                    captured = true;

                }

                row_aux += move.row;
                col_aux += move.col;

            }

            // reset for next direction
            row_aux = row;
            col_aux = col;
            captured = false;

        }

        //update player pieces
        this.turn.pieces += captured_pieces + 1
        this.opponent.pieces -= captured_pieces
        this._board.updatePieces( this.turn.color, this.turn.pieces)
        this._board.updatePieces( this.opponent.color, this.opponent.pieces)
        

        // check if opponent has no pieces left, if so, end the game
        if (this.opponent.pieces == 0) 
            this.winner(this.turn)    

    }

    /**
     * Captures all pieces from starting to ending position
     * @param {number} row -> row to start capturing form
     * @param {number} col -> col to start capturing from
     * @param {number} to_row -> capture to this row
     * @param {number} to_col -> capture to this col
     * @param {number} move_row -> row move direction
     * @param {number} move_col -> col move direction
     * @returns -> number of pieces captured
     */
    captureFromTo(row, col, to_row, to_col, move_row, move_col) {
        
        let captured_pieces = 0

        while (row != to_row || col != to_col) {

            this._board.placePiece(row + move_row, col + move_col, this._turn.color)
            this.getCell(row + move_row, col + move_col).piece = this._turn.color
            
            row += move_row
            col += move_col
            captured_pieces += 1

        }

        return captured_pieces

    }

    /**
     * checks whether a player has moves left
     * @param {Player} player -> player to check 
     * @returns -> true if has moves left, else false
     */
    checkMovesLeft(player) {

        let cells = this.getPieces(player.color)

        for (let cell of cells) {
            for (let move of this.move_directions) {

                if (this.checkMove( cell.row, cell.col, move.row , move.col, player.color))
                    return true
                
            }
        }

        return false
    }

    /**
     * basically changes turn
     */
    changeTurn() {

        this.board.changeTurn(this._turn, this.opponent);

        this._turn == this._player1 ? this._turn = this._player2 : this._turn = this._player1;

        this.getMoves();

    }

    /**
     * Looks who which player has more pieces and calls winner modal
     */
    endGame(){
        this._player1.pieces > this._player2.pieces ? this.winner(this._player1) : this.winner(this._player2)
    }

    /**
     * ends game, and shows winner modal
     * @param {Player} winner -> player who has won
     */
    winner(winner) {

        this._playing = false;

        Swal.fire({

            text: `${winner.name} WINS with ${winner.pieces}!!!`,
            imageUrl: './resources/images/win.jpg',
            imageWidth: 400,
            imageHeight: 300,
            imageAlt: 'dale nen',

        }).then(() => {
            this.newGameModal();
        })

    }

    skipTurnModal() {

            // confirm surrender
            Swal.fire({

                title: `${this.opponent.name} has no moves, the turn will be skipped`,
                position: 'center',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Yeee',
                showCancelButton: false,
                width: '40%',

            }).then(() => {

                    this.getMoves()
                
            })

    }

    /**
     * shows surrender modal, and asks for rematch
     * @param {Player} player -> player who has surrendered
     */
    surrender(player) {

        if (this._playing && this._turn == player) {

            // confirm surrender
            Swal.fire({

                title: 'Are you sure you want to surrender?',
                icon: 'question',
                position: 'center',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Yeee',
                showCancelButton: true,
                cancelButtonColor: '#d33',
                cancelButtonText: 'Noo',
                width: '40%',

            }).then((result) => {
                if (result.isConfirmed) {

                    this._playing = false;

                    // surrender alert
                    Swal.fire({

                        text: `${player.name} has surrended`,
                        showConfirmButton: true,
                        imageUrl: './resources/images/ff.gif',
                        imageWidth: 400,
                        imageHeight: 300,
                        imageAlt: 'uwu',
                        width: '40%',

                    }).then(() => {
                        this.newGameModal()
                    })

                }
            })

        }
    }

    /**
     * shows modal to start a new game
     */
    newGameModal() {

        Swal.fire({

            title: 'Do you want to play another game?',
            icon: 'question',
            position: 'center',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Yeee',
            showCancelButton: true,
            cancelButtonColor: '#d33',
            cancelButtonText: 'Noo',
            width: '40%',

        }).then((result) => {

            if (result.isConfirmed) 
                this.newGame(this._board._board_length)
            else
                this._board.hideMoves()

        })

    }

}
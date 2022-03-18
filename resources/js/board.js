class Board {

    constructor(length) {
        this._cells = new Array;
        this._board_length = length;
        this._possible_moves = new Array;
    }

    get cells() {
        return this._cells;
    }

    get length() {
        return this._board_length;
    }

    get possibleMoves() {
        return this._possible_moves;
    }

    /**
     * pushes a Cell() into _cells array
     * @param {Cell} cell -> object to add to array
     */
    addCell(cell) {
        this._cells.push(cell);
    }

    /**
     * Prints all checkers and piece images to board HTML
     */
    printBoard() {

        let board_HTML = "";

        // fill board with cells
        for (let row = 1; row <= this._board_length; row++) {

            board_HTML += `<div class="row" style="height: ${100/this._board_length}%">`;

            for (let col = 1; col <= this._board_length; col++) {

                board_HTML += `<div class="cell bg-success border border-white d-flex justify-content-center align-items-center p-1" 
                id="${row}-${col}" style="width: ${100/this._board_length}%"></div>`;

            }

            board_HTML += `</div>`;

        }

        $("#board").html(board_HTML);

    }

    /**
     * Fills layout wiht player info, such as names or piece color
     * @param {Player} player1 -> player object
     * @param {Player} player2 -> player object
     */
    fillLayout(player1, player2){

        // fill player 1
        $("#p1").html(player1.name);
        $("#p1-avatar").attr("id", `${player1.color}-avatar`);
        $("#p1-color").css("backgroundImage", `url(./resources/images/piece_${player1.color}.png)`);
        $("#p1-pieces").attr("id", `${player1.color}-pieces`);
        $(`#${player1.color}-pieces`).html(2);
        if (player1.color == "black"){
            $(`#${player1.color}-pieces`).addClass("text-light")
        }

        // fill player 2
        $("#p2").html(player2.name);
        $("#p2-avatar").attr("id", `${player2.color}-avatar`);
        $("#p2-color").css("backgroundImage", `url(./resources/images/piece_${player2.color}.png)`);
        $("#p2-pieces").attr("id", `${player2.color}-pieces`);
        $(`#${player2.color}-pieces`).html(2)
        if (player2.color == "black"){
            $(`#${player2.color}-pieces`).addClass("text-light")
        }

        // set avatar opacity
        if( player1.color == "white"){
            $(`#${player1.color}-avatar`).css("opacity", "1" );
            $(`#${player2.color}-avatar`).css("opacity", "0.5" );
        }else{
            $(`#${player2.color}-avatar`).css("opacity", "1" );
            $(`#${player1.color}-avatar`).css("opacity", "0.5" );
        }

    }

    /**
     * places a placeholder of a piece in given cell
     * @param {number} row -> cell row
     * @param {number} col -> cell col
     * @param {String} color -> wanted color
     */
    showMove(row, col, color) {

        let piece_HTML = `<img class="img-fluid piece_placeholder" src="./resources/images/piece_${color}.png">`;

        $(`#${row}-${col}`).html(piece_HTML); // place piece

        let highlightedCell = `#${row}-${col}`
        this._possible_moves.push(highlightedCell); // add cell to possible moves array

    }

    /**
     * clears all placeholder pieces
     */
    hideMoves(){

        let cells = this.possibleMoves;

        for (let cell of cells) {
            $(`${cell}`).html("")
        }
        
        this._possible_moves = [];
    }

    /**
     * place piece image to given position
     * @param {number} row -> piece current row
     * @param {number} col -> piece current col
     */
     placePiece(row, col, color){

        let piece_HTML = `<img class="img-fluid" src="./resources/images/piece_${color}.png">`;

        $(`#${row}-${col}`).html(piece_HTML);

    }

    /**
     * Updates pieces score
     * @param {String} color -> color of the player
     * @param {number} pieces -> new number of pieces
     */
    updatePieces( color, pieces){
        $(`#${color}-pieces`).html(pieces)
    }

    /**
     * changes avatar opacity according to turn
     * @param {Player} playing -> current player 
     * @param {Player} opponent -> next player
     */
    changeTurn(playing, opponent){

        $(`#${playing.color}-avatar`).css("opacity", "0.5" );
        $(`#${opponent.color}-avatar`).css("opacity", "1" );

    }
}
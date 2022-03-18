$(document).ready(() => {

  let game_started = false

  checkOrientation()
  $(window).on("orientationchange", checkOrientation)

  /**
   * Shows modal, and adds listeners to pieces and buttons
   */
  function startGameModal() {

    $('#myModal').modal('show')

    let game_info = {
      p1_nick: "Player 1",
      p1_color: "white",
      p2_nick: "Player 2",
      p2_color: "black",
      board_length: 8 
    }

    // disable start game button
    $("#guide_checkbox").on("change", () => {

      if ($("#guide_checkbox").prop("checked")) 
        $("#start_game").prop("disabled", false)
      else 
        $("#start_game").prop("disabled", true)
      

    });

    // add listeners to piece select
    $("#p1-w").on("click", () => { p1w_p2b() })
    $("#p1-b").on("click", () => { p1b_p2w() })
    $("#p2-w").on("click", () => { p1b_p2w() })
    $("#p2-b").on("click", () => { p1w_p2b() })

    /**
     * adds selected piece color to game_info
     * adds selected_piece to p1-white and p2-black
     * removes selected_piece from p1-black and p2-white
     */
    function p1w_p2b() {
      $("#p1-w").addClass("piece_selected")
      game_info.p1_color = "white"
      $("#p2-b").addClass("piece_selected")
      game_info.p2_color = "black"

      $("#p1-b").removeClass("piece_selected")
      $("#p2-w").removeClass("piece_selected")
    }

    /**
     * adds selected piece color to game_info
     * adds selected_piece to p1-black and p2-white
     * removes selected_piece from p1-white and p2-black
     */
    function p1b_p2w() {
      $("#p1-b").addClass("piece_selected")
      game_info.p1_color = "black"
      $("#p2-w").addClass("piece_selected")
      game_info.p2_color = "white"

      $("#p1-w").removeClass("piece_selected")
      $("#p2-b").removeClass("piece_selected")
    }


    // "submit" modal data to init()
    $("#start_game").on("click", () => {

      // get player nicks
      if ($("#p1-nickname").val() != "") 
        game_info.p1_nick = $("#p1-nickname").val()
      
      if ($("#p2-nickname").val() != "") 
        game_info.p2_nick = $("#p2-nickname").val()

      // get board size
      game_info.board_length = $("#board-length option:selected").val()
      
      init(game_info)

    })

  }

  /**
   * Checks if screen orientation is landscape;
   * shows/hides modal depending on game status and orientation
   */
  function checkOrientation() {

    if (screen.orientation.type == "landscape-primary") {

      if (!game_started) 
        startGameModal()
      
    } else {
      $("#myModal").modal('hide')
      $("#myModal").hide()
    }

  }

  /**
   * Initializes the game
   * Creates the player objects and then a new Game
   */
  function init(game_info) {

    game_started = true
    
    let player1 = new Player(game_info.p1_nick, game_info.p1_color);
    let player2 = new Player(game_info.p2_nick, game_info.p2_color);

    let game = new Game(player1, player2)

    // game.newGame(game_info.board_length)
    game.newGame(4)

  }

})
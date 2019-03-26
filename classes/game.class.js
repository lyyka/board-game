class Game{

    constructor(player1, player2) {
        this.board = new Board(30, 8);
        this.board.init();

        this.player1 = player1;
        this.player2 = player2;

        this.turn = 1;
    }
    
    changeTurn(){
        if(this.turn == 1){
            this.turn = 2;
        }
        else{
            this.turn = 1;
        }
    }

}
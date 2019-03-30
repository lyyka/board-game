class Game{

    constructor() {
        this.log = new Logger();
        this.board = new Board(30, 8, this);
    }

    start(){
        this.board.drawBoard();

        this.turn = 1;
        this.log.logTurn(this);
    }
    
    changeTurn(){
        if(this.turn == 1){
            this.turn = 2;
        }
        else{
            this.turn = 1;
        }
        this.log.logTurn(this);
    }

}
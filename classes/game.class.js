class Game{

    // constructs new game
    // initializes new message logger for this game and creates new board
    constructor() {
        this.log = new Logger();
        this.board = new Board(60, 8, this);
    }

    // happens when game starts
    start(){
        // draws board
        this.board.drawBoard();
        // logs that game started
        this.log.logMessage('Game started!');

        // turn is 1 by default
        this.turn = 1;
        // logs turn
        this.log.logTurn(this);

        // set interval to generate power ups on fields
        this.generatePowerUp = this.generatePowerUp.bind(this);
        setInterval(this.generatePowerUp, 12000);
    }

    generatePowerUp(){
        // you can only generate SQRT(fields_number) + 1 number of power ups on board
        if(this.board.countPowerUps() <= Math.sqrt(this.board.fieldsNumber) + 1){
            let loop = true;
            while(loop){
                const rand_x = Math.floor(Math.random() * Math.floor(this.board.fieldsNumber));
                const rand_y = Math.floor(Math.random() * Math.floor(this.board.fieldsNumber));

                // see if power up does not overlap with player or with another power up
                if (rand_x != this.player1.position.x && rand_x != this.player2.position.x &&
                    rand_y != this.player1.position.y && rand_y != this.player2.position.y &&
                    this.board.fields[rand_x][rand_y].power_up == undefined) {

                    loop = false;

                    // available power ups
                    const power_ups = [
                        'hp_potion',
                        'attack_power'
                    ];

                    // random index
                    const power_up_index = Math.floor(Math.random() * Math.floor(power_ups.length));

                    // get random field
                    const field = this.board.fields[rand_x][rand_y];

                    // add power up to field
                    field.addPowerUp(power_ups[power_up_index]);
                }
            }
        }
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
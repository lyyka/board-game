class Game{

    // constructs new game
    // initializes new message logger for this game and creates new board
    constructor() {
        this.log = new Logger();
        this.board = new Board(60, 8, this);
        this.ui = new UI();
    }

    // happens when game starts
    start(){
        // enables keyboard input (controlling) of the game
        this.keyboard = true;
        // draws board
        this.board.drawBoard();
        // logs that game started
        this.log.logMessage('Game started!');

        // turn is 1 by default
        this.turn = 1;
        // logs turn
        this.log.logTurn(this);

        // set interval to generate power ups on fields
        this.doTheFight = this.doTheFight.bind(this);
        this.generatePowerUp = this.generatePowerUp.bind(this);
        setInterval(this.generatePowerUp, 2000);
    }

    blockKeyboard(){
        this.keyboard = false;
    }

    displayFightingDialog(){
        const p1_labels = this.ui.fightingModalLabels.player1;
        for(var i = 0; i < p1_labels.length; i++){
            p1_labels[i].style.color = this.player1.color;
        }
        const p2_labels = this.ui.fightingModalLabels.player2;
        for (var i = 0; i < p2_labels.length; i++) {
            p2_labels[i].style.color = this.player2.color;
        }
        this.blockKeyboard();
        this.ui.fightingModalButton.addEventListener('click', this.doTheFight, {
            once: true
        });
        this.ui.fightingModal.modal({
            backdrop: 'static',
            keyboard: false
        });
    }

    doTheFight(){
        const decisions = this.ui.getPlayersDecisions();
        if(decisions.player1 == 'attack'){
            if(decisions.player2 == 'defend'){
                this.player2.hp -= this.player1.attack_power / 2;
            }
            else{
                this.player2.hp -= this.player1.attack_power;
            }
        }   
        if(decisions.player2 == 'attack'){
            if (decisions.player1 == 'defend') {
                this.player1.hp -= this.player1.attack_power / 2;
            }
            else {
                this.player1.hp -= this.player1.attack_power;
            }
        }
        
        if(this.player1.hp <= 0){

        }
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
                        'hp',
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
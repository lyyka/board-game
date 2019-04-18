class Game{

    // constructs new game
    // initializes new message logger for this game and creates new board
    constructor(options={}) {
        this.log = new Logger();
        this.board = new Board(64, 10, this);
        this.ui = new UI();
        this.powerUpInterval = undefined;
        this.options = options; // will be set on startGame() in init
    }

    // happens when game starts
    start(){
        // enables keyboard input (controlling) of the game
        this.keyboard = true;

        // draws board
        this.board.drawBoard();

        // logs that game started
        this.log.clear();
        this.log.logMessage('Game started!');

        // turn is 1 by default
        this.turn = 1;
        this.board.drawAvailableFields();

        // logs turn
        this.log.logTurn(this);

        // set interval to generate power ups on fields
        this.doTheFight = this.doTheFight.bind(this);
        this.generatePowerUp = this.generatePowerUp.bind(this);
        const time = this.options.fasterPowerups ? 1200 : 2000; // time based on options
        this.powerUpInterval = setInterval(this.generatePowerUp, time);

        if(this.options.deadFields){
            this.blockFields();
        };
    }

    drawStatuses(){
        // remove current images if game restarted
        while (this.ui.playerStatuses.player1.image.firstChild) {
            this.ui.playerStatuses.player1.image.removeChild(this.ui.playerStatuses.player1.image.firstChild);
        }
        while (this.ui.playerStatuses.player2.image.firstChild) {
            this.ui.playerStatuses.player2.image.removeChild(this.ui.playerStatuses.player2.image.firstChild);
        }

        this.ui.playerStatuses.wrap.classList.remove('d-none');

        // first player
        const p1_img_el = document.createElement('img');
        p1_img_el.src = this.player1.image.src;
        p1_img_el.width = 64;
        p1_img_el.classList.add('img-fluid');
        this.ui.playerStatuses.player1.image.appendChild(p1_img_el);
        this.ui.playerStatuses.player1.hp.innerText = "HP: " + this.player1.hp;
        this.ui.playerStatuses.player1.ap.innerText = "Attack power: " + this.player1.attack_power;
        this.ui.playerStatuses.player1.crit_damage.innerText = "Critical damage: " + (this.player1.crit_damage * 100) + "%";

        // second player
        const p2_img_el = document.createElement('img');
        p2_img_el.src = this.player2.image.src;
        p2_img_el.width = 64;
        p2_img_el.classList.add('img-fluid');
        this.ui.playerStatuses.player2.image.appendChild(p2_img_el);
        this.ui.playerStatuses.player2.hp.innerText = "HP: " + this.player2.hp;
        this.ui.playerStatuses.player2.ap.innerText = "Attack power: " + this.player2.attack_power;
        this.ui.playerStatuses.player2.crit_damage.innerText = "Critical damage: " + (this.player2.crit_damage * 100) + "%";
    }

    clearEverything(){
        clearInterval(this.powerUpInterval);
        this.ui = undefined;
        this.log = undefined;
        // clear canvas and remove listeners on click
        this.board.destroy();
        this.board = undefined;
        // unplug players
        this.player1 = undefined;
        this.player2 = undefined;
    }

    // normal ending, when someone wins
    end(winnerInfo){
        // hide fight modal
        this.ui.fightingModal.modal("hide");

        // show winning player on modal
        this.ui.showWinningModal(winnerInfo);
        this.clearEverything();
    }

    unblockKeyboard(){
        this.keyboard = true;
    }

    blockKeyboard(){
        this.keyboard = false;
    }

    displayFightingDialog(){
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
        let game_end = false;
        let winnerInfo = undefined;
        if(decisions.player1 == 'attack'){
            let damage = undefined;
            if(decisions.player2 == 'defend'){
                damage = this.options.oneShotGame ? this.player2.hp : this.player1.attack_power / 2;
                this.player2.hp -= damage;
            }
            else{
                damage = this.options.oneShotGame ? this.player2.hp : this.player1.attack_power;
                this.player2.hp -= damage;
            }
            this.log.logMessage('Player 1 dealt ' + damage + 'DMG to Player 2');
            if(this.player2.hp <= 0){
                this.log.logMessage('Player 1 WON!');
                game_end = true;
                winnerInfo = {
                    label: 'Player 1',
                    obj: this.player1
                };
            }
        }
        if(decisions.player2 == 'attack' && !game_end){
            let damage = undefined;
            if (decisions.player1 == 'defend') {
                damage = this.options.oneShotGame ? this.player1.hp : this.player2.attack_power / 2;
                this.player1.hp -= damage;
            }
            else {
                damage = this.options.oneShotGame ? this.player1.hp : this.player2.attack_power;
                this.player1.hp -= damage;
            }
            this.log.logMessage('Player 2 dealt ' + damage + 'DMG to Player 1');
            if (this.player1.hp <= 0) {
                this.log.logMessage('Player 2 WON!');
                game_end = true;
                winnerInfo = {
                    label: 'Player 2',
                    obj: this.player2
                };
            }
        }

        if(game_end){
            this.end(winnerInfo);
        }
        else{
            this.board.movePlayer(this.player1, {
                x: 1,
                y: 1
            }, true);

            this.board.movePlayer(this.player2, {
                x: this.board.fieldsNumber,
                y: this.board.fieldsNumber
            }, true);

            this.ui.fightingModal.modal("hide");
            this.unblockKeyboard();
        }
    }

    generatePowerUp(){
        // you can only generate SQRT(fields_number) + 1 number of power ups on board
        if(this.board.countPowerUps() <= this.options.maxPowerups){
            let loop = true;
            while(loop){
                const rand_x = Math.floor(Math.random() * Math.floor(this.board.fieldsNumber));
                const rand_y = Math.floor(Math.random() * Math.floor(this.board.fieldsNumber));

                // get random field
                const field = this.board.fields[rand_x][rand_y];

                // see if power up does not overlap with player or with another power up
                if (rand_x + 1 != this.player1.position.x && rand_x + 1 != this.player2.position.x &&
                    rand_y + 1 != this.player1.position.y && rand_y + 1 != this.player2.position.y &&
                    field.power_up == undefined && !field.dead) {

                    loop = false;

                    // available power ups
                    const power_ups = [
                        'hp',
                        'hp_adv',
                        'attack_power',
                        'attack_power_adv',
                        'crit_damage'
                    ];

                    // random index
                    const power_up_index = Math.floor(Math.random() * Math.floor(power_ups.length));

                    // add power up to field
                    field.addPowerUp(power_ups[power_up_index]);
                }
            }
        }
    }

    blockFields(){
        // you can only generate SQRT(fields_number) + 1 number of power ups on board
        for(var i = 0; i <= this.options.maxDeadFields; i++){
            let loop = true;
            while(loop){
                const rand_x = Math.floor(Math.random() * Math.floor(this.board.fieldsNumber));
                const rand_y = Math.floor(Math.random() * Math.floor(this.board.fieldsNumber));

                // get random field
                const field = this.board.fields[rand_x][rand_y];

                // see if power up does not overlap with player or with another power up
                if (rand_x + 1 != this.player1.position.x && rand_x + 1 != this.player2.position.x &&
                    rand_y + 1 != this.player1.position.y && rand_y + 1 != this.player2.position.y &&
                    field.power_up == undefined && !field.dead) {

                    loop = false;

                    // block field
                    field.block();
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
        this.board.drawAvailableFields();
    }

}

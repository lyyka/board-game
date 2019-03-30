class Player{
    constructor(attack_power, hp, color, game){
        this.game = game;
        this.attack_power = attack_power;
        this.hp = hp;
        this.color = color;
    }

    setPosition(x, y){
        this.position = {
            x: x,
            y: y
        }
    }

    updatePlayerPosition(x, y){
        this.setPosition(x, y);

        let player = '';
        if(this.game.turn == 1){
            player = 'Player 1 ';
        }
        else{
            player = 'Player 2 ';
        }
        this.game.log.logMessage(player + 'moved to (' + (x+1) + ', ' + (y+1) + ')', this.color);
    }
}
class Player{
    
    // constructs new player
    // attack_power - how much damage will player deal to others
    // hp - how much health this player will have
    // color - prefered color
    // game - game object to which this player belongs
    constructor(attack_power, hp, color, game){
        this.attack_power = attack_power;
        this.hp = hp;
        this.color = color;
        this.game = game;
    }

    // sets this players position
    setPosition(x, y){
        this.position = {
            x: x,
            y: y
        }
    }

    // on update position, set position + log the movement
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
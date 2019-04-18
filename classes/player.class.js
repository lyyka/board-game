class Player{

    // constructs new player
    // attack_power - how much damage will player deal to others
    // hp - how much health this player will have
    // color - prefered color
    // game - game object to which this player belongs
    constructor(attack_power, hp, image, game){
        this.attack_power = attack_power;
        this.hp = hp;
        this.maxMoveDistance = 3;
        this.crit_damage = 0;
        // this.color = color;
        this.image = image;
        this.game = game;
    }

    // sets this players position
    setPosition(x, y){
        this.position = {
            x: x,
            y: y
        }
    }

    // aply power up
    applyPowerup(power_up){
        if(power_up == 'hp'){
            this.hp += 10;
        }
        if(power_up == 'hp_adv'){
            this.hp += 20;
        }
        if(power_up == 'attack_power'){
            this.attack_power += 10;
        }
        if(power_up == 'attack_power_adv'){
            this.attack_power += 20;
        }
        if(power_up == 'crit_damage'){
            this.crit_damage += 0.05;
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
        this.game.log.logMessage(player + 'moved to (' + (x) + ', ' + (y) + ')');
    }
}

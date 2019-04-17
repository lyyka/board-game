class Field{

    constructor(x, y, board, dead = false){
        // board to which this field belongs to
        this.board = board;

        // position
        this.position = {
            x: x,
            y: y
        };

        // indicates if the field is "dead", or not accessible
        this.dead = dead;

        // indicates if field had power up
        this.power_up = undefined;
    }

    addPowerUp(power_up){
        this.power_up = power_up;
        this.board.drawPowerUp(this.position.x, this.position.y, power_up);
    }

    block(){
        this.dead = true;
        this.board.blockField(this.position.x, this.position.y);
    }

}

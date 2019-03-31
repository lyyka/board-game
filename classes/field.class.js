class Field{

    constructor(x, y, board){
        // board to which this field belongs to
        this.board = board;

        // position
        this.position = {
            x: x,
            y: y
        };

        // indicates if field had power up
        this.power_up = undefined;
    }

    addPowerUp(power_up){
        this.power_up = power_up;
        this.board.drawPowerUp(this.position.x, this.position.y, power_up);
    }

}
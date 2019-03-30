class Board{
    constructor(fieldSize, fieldsNumber, gameInstance){
        // game this board belongs to
        this.game = gameInstance;

        // number of fields and size of each field
        this.fieldsNumber = fieldsNumber;
        this.fieldSize = fieldSize;

        // DOM element of canvas setup
        this.boardCanvasEl = document.getElementById('board');
        this.boardCanvasEl.width = (this.fieldsNumber * this.fieldSize) + 4;
        this.boardCanvasEl.height = (this.fieldsNumber * this.fieldSize) + 4;

        // get canvas context
        this.boardCanvasContext = this.boardCanvasEl.getContext('2d');
        this.boardCanvasContext.lineWidth = 2;

        // bind this
        this.onClick = this.onClick.bind(this);

        // on canvas click, get clicked square
        this.boardCanvasEl.addEventListener('click', this.onClick);
        this.boardCanvasEl.addEventListener('mouseover', this.onMouseOver);
    }

    onClick(e){
        const pos = this.getPositionSquare(e);

        const x = pos.x;
        const y = pos.y;

        let player = undefined;
        let move_distance = 100;

        // set player based on turn
        if (this.game.turn == 1) {
            player = this.game.player1;
        }
        else if (this.game.turn == 2) {
            player = this.game.player2;
        }
        // calc players move distance
        move_distance = Math.abs(Math.pow(player.position.x - x + 1, 2) + Math.pow(player.position.y - y + 1, 2));
        if(player != undefined){
            if (move_distance > 2 || move_distance == 0) {
                // move distance greater than 2, or on the same spot
                alert('You can only move to fields around you');
            }
            else {
                // player moved

                // clear current player from his position
                this.clearCurrentPlayer();

                // update players position
                player.updatePlayerPosition(x - 1, y - 1);

                // change turns in game
                this.game.changeTurn();

                // draw player again
                this.drawPlayer(player);
            }
        }
    }

    getPositionSquare(e){
        const x_offset = e.offsetX;
        const y_offset = e.offsetY;

        const x = Math.ceil(x_offset / this.fieldSize);
        const y = Math.ceil(y_offset / this.fieldSize);

        return{
            x: x,
            y: y
        }
    }

    drawBoard() {
        this.boardCanvasContext.strokeStyle = 'black';

        for (var i = 0; i < this.fieldsNumber; i++) {
            for (var y = 0; y < this.fieldsNumber; y++) {
                this.boardCanvasContext.rect(
                    i * this.fieldSize+this.boardCanvasContext.lineWidth,
                    y * this.fieldSize+this.boardCanvasContext.lineWidth,
                    this.fieldSize,
                    this.fieldSize);
            }
        }

        this.boardCanvasContext.stroke();
    }

    clearCurrentPlayer(){
        const p1 = this.game.player1.position;
        const p2 = this.game.player2.position;

        if(this.game.turn == 1){
            this.boardCanvasContext.clearRect(
                p1.x * this.fieldSize + this.boardCanvasContext.lineWidth * 1.5,
                p1.y * this.fieldSize + this.boardCanvasContext.lineWidth * 1.5,
                this.fieldSize - this.boardCanvasContext.lineWidth,
                this.fieldSize - this.boardCanvasContext.lineWidth
            );
        }
        else if(this.game.turn == 2){
            this.boardCanvasContext.clearRect(
                p2.x * this.fieldSize + this.boardCanvasContext.lineWidth * 1.5,
                p2.y * this.fieldSize + this.boardCanvasContext.lineWidth * 1.5,
                this.fieldSize - this.boardCanvasContext.lineWidth,
                this.fieldSize - this.boardCanvasContext.lineWidth
            );
        }
    }

    drawPlayer(player) {
        const pos_x = player.position.x;
        const pos_y = player.position.y;

        this.boardCanvasContext.fillStyle = player.color;
        this.boardCanvasContext.fillRect(
            pos_x * this.fieldSize + this.boardCanvasContext.lineWidth*1.5,
            pos_y * this.fieldSize + this.boardCanvasContext.lineWidth*1.5,
            this.fieldSize - this.boardCanvasContext.lineWidth,
            this.fieldSize - this.boardCanvasContext.lineWidth
        );
        this.boardCanvasContext.font = '12px Arial';
        this.boardCanvasContext.fillStyle = 'white';
        this.boardCanvasContext.fillText(
            player.hp,
            pos_x * this.fieldSize + this.boardCanvasContext.lineWidth * 1.5 + 5,
            pos_y * this.fieldSize + this.boardCanvasContext.lineWidth * 1.5 + this.fieldSize/2 + 2,
        );
    }

}
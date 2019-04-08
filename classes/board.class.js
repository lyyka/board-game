class Board{
    constructor(fieldSize, fieldsNumber, gameInstance){
        // game this board belongs to
        this.game = gameInstance;
        this.fields = [];

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

        // bind this to functions
        this.onClick = this.onClick.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);

        // on canvas click, get clicked square
        this.boardCanvasEl.addEventListener('click', this.onClick);
        document.body.addEventListener('keydown', this.onKeyDown);
    }

    onKeyDown(e){
        if(this.game.keyboard){
            var keyCode = e.keyCode;
            if (this.game.turn == 1) {
                switch (keyCode) {
                    case 68: //d
                        this.movePlayer(
                            this.getActivePlayer(),
                            {
                                x: this.getActivePlayer().position.x + 1,
                                y: this.getActivePlayer().position.y
                            }
                        );
                        break;
                    case 83: //s
                        this.movePlayer(
                            this.getActivePlayer(),
                            {
                                x: this.getActivePlayer().position.x,
                                y: this.getActivePlayer().position.y + 1
                            }
                        );
                        break;
                    case 65: //a
                        this.movePlayer(
                            this.getActivePlayer(),
                            {
                                x: this.getActivePlayer().position.x - 1,
                                y: this.getActivePlayer().position.y
                            }
                        );
                        break;
                    case 87: //w
                        this.movePlayer(
                            this.getActivePlayer(),
                            {
                                x: this.getActivePlayer().position.x,
                                y: this.getActivePlayer().position.y - 1
                            }
                        );
                        break;
                }
            }
            else if (this.game.turn == 2) {
                switch (keyCode) {
                    case 39: //d
                        this.movePlayer(
                            this.getActivePlayer(),
                            {
                                x: this.getActivePlayer().position.x + 1,
                                y: this.getActivePlayer().position.y
                            }
                        );
                        break;
                    case 40: //s
                        this.movePlayer(
                            this.getActivePlayer(),
                            {
                                x: this.getActivePlayer().position.x,
                                y: this.getActivePlayer().position.y + 1
                            }
                        );
                        break;
                    case 37: //a
                        this.movePlayer(
                            this.getActivePlayer(),
                            {
                                x: this.getActivePlayer().position.x - 1,
                                y: this.getActivePlayer().position.y
                            }
                        );
                        break;
                    case 38: //w
                        this.movePlayer(
                            this.getActivePlayer(),
                            {
                                x: this.getActivePlayer().position.x,
                                y: this.getActivePlayer().position.y - 1
                            }
                        );
                        break;
                }
            }
        }
    }

    onClick(e){
        const pos = this.getPositionSquare(e);
        this.movePlayer(this.getActivePlayer(), pos);
    }

    movePlayer(player, pos, forceMove = false){
        const x = pos.x;
        const y = pos.y;

        // set player based on turn
        let move_distance = 100;

        // calc players move distance
        move_distance = Math.abs(Math.pow(player.position.x - x, 2) + Math.pow(player.position.y - y, 2));
        if (player != undefined) {
            console.log("Move distance: " + move_distance);
            if ((move_distance > 2 || move_distance == 0 || x > this.fieldsNumber || y > this.fieldsNumber || x <= 0 || y <= 0) && !forceMove) {
                // move distance greater than 2, or on the same spot
                alert('You can only move to fields around you and in board');
            }
            else {
                const other_player = this.getSecondPlayer(); 
                if(other_player.position.x == x && other_player.position.y == y){
                    // players collided, don't draw one on top of another
                    this.game.displayFightingDialog();
                }
                else{
                    // clear current player from his position
                    this.clearCurrentPlayer();

                    // update players position
                    player.updatePlayerPosition(x, y);

                    // apply power ups if field has any
                    if (this.fields[x - 1][y - 1].power_up != undefined) {
                        const power_up = this.fields[x - 1][y - 1].power_up;
                        this.fields[x - 1][y - 1].power_up = undefined;

                        player[power_up] += 10;
                    }

                    // change turns in game
                    this.game.changeTurn();

                    // draw player again
                    this.drawPlayer(player);
                }
            }
        }
    }

    getActivePlayer(){
        let player = undefined;
        if (this.game.turn == 1) {
            player = this.game.player1;
        }
        else if (this.game.turn == 2) {
            player = this.game.player2;
        }
        return player;
    }

    getSecondPlayer(){
        let player = undefined;
        if (this.game.turn == 1) {
            player = this.game.player2;
        }
        else if (this.game.turn == 2) {
            player = this.game.player1;
        }
        return player;
    }

    countPowerUps(){
        let number = 0;
        for(var i = 0; i < this.fields.length; i++){
            let row = this.fields[i];
            for(var y = 0; y < row.length; y++){
                const field = row[y];
                if(field.power_up != undefined){
                    number++;
                }
            }
        }
        return number;
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
        // black borders
        this.boardCanvasContext.strokeStyle = 'black';

        for (var i = 0; i < this.fieldsNumber; i++) {
            this.fields[i] = [];
            for (var y = 0; y < this.fieldsNumber; y++) {
                // add new field
                this.fields[i][y] = new Field(i, y, this);

                // draw field
                this.boardCanvasContext.rect(
                    i * this.fieldSize+this.boardCanvasContext.lineWidth,
                    y * this.fieldSize+this.boardCanvasContext.lineWidth,
                    this.fieldSize,
                    this.fieldSize
                );
            }
        }

        this.boardCanvasContext.stroke();
    }

    destroy(){
        // clear canvas
        this.boardCanvasContext.clearRect(0, 0, this.boardCanvasEl.width, this.boardCanvasEl.height);

        this.boardCanvasEl.removeEventListener('click', this.onClick);
        document.body.removeEventListener('keydown', this.onKeyDown);
    }

    drawPowerUp(x, y, power_up){
        let image = this.game.ui.icons[power_up];

        if(image != undefined){
            this.boardCanvasContext.drawImage(
                image,
                x * this.fieldSize + this.boardCanvasContext.lineWidth * 1.5,
                y * this.fieldSize + this.boardCanvasContext.lineWidth * 1.5,
                this.fieldSize,
                this.fieldSize
            );
        }
    }

    clearCurrentPlayer(){
        // set current active player
        let player = undefined;
        if(this.game.turn == 1){
            player = this.game.player1.position;
        }
        else if(this.game.turn == 2){
            player = this.game.player2.position;
        }

        if(player != undefined){
            // clear current player
            this.boardCanvasContext.clearRect(
                (player.x - 1) * this.fieldSize + this.boardCanvasContext.lineWidth * 1.5,
                (player.y - 1) * this.fieldSize + this.boardCanvasContext.lineWidth * 1.5,
                this.fieldSize - this.boardCanvasContext.lineWidth,
                this.fieldSize - this.boardCanvasContext.lineWidth
            );
        }
    }

    drawPlayer(player) {
        // get player position
        const pos_x = player.position.x - 1;
        const pos_y = player.position.y - 1;

        // fill the rect with players prefered color
        // this.boardCanvasContext.fillStyle = player.color;

        this.boardCanvasContext.drawImage(
            player.image,
            pos_x * this.fieldSize + this.boardCanvasContext.lineWidth * 1.5,
            pos_y * this.fieldSize + this.boardCanvasContext.lineWidth * 1.5,
            this.fieldSize - this.boardCanvasContext.lineWidth,
            this.fieldSize - this.boardCanvasContext.lineWidth
        );

        this.game.drawStatuses();

        // draw rect
        // this.boardCanvasContext.fillRect(
        //     pos_x * this.fieldSize + this.boardCanvasContext.lineWidth*1.5,
        //     pos_y * this.fieldSize + this.boardCanvasContext.lineWidth*1.5,
        //     this.fieldSize - this.boardCanvasContext.lineWidth,
        //     this.fieldSize - this.boardCanvasContext.lineWidth
        // );

        // add text over player for his HP and AP
        // this.boardCanvasContext.font = '15px Arial';
        // this.boardCanvasContext.fillStyle = 'black';
        // this.boardCanvasContext.fillText(
        //     player.hp + 'HP',
        //     pos_x * this.fieldSize + this.boardCanvasContext.lineWidth * 1.5,
        //     pos_y * this.fieldSize + this.boardCanvasContext.lineWidth * 1.5 - 30,
        // );
        // this.boardCanvasContext.fillText(
        //     player.attack_power + 'AP',
        //     pos_x * this.fieldSize + this.boardCanvasContext.lineWidth * 1.5,
        //     pos_y * this.fieldSize + this.boardCanvasContext.lineWidth * 1.5 - 15,
        // );
    }

}
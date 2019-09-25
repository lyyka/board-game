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

    // keyboard controls
    onKeyDown(e){
        if(this.game.keyboard){
            var keyCode = e.keyCode;
            let move_to = undefined;
            if (this.game.turn == 1) {
                // decide where to move
                switch (keyCode) {
                    case 68: //d
                        move_to = { x: this.getActivePlayer().position.x + 1,
                                y: this.getActivePlayer().position.y };
                        break;
                    case 83: //s
                        move_to = { x: this.getActivePlayer().position.x,
                                y: this.getActivePlayer().position.y + 1 };
                        break;
                    case 65: //a
                        move_to = { x: this.getActivePlayer().position.x - 1,
                                y: this.getActivePlayer().position.y };
                        break;
                    case 87: //w
                        move_to = { x: this.getActivePlayer().position.x,
                                y: this.getActivePlayer().position.y - 1 };
                        break;
                }
            }
            else if (this.game.turn == 2) {
                // decide where to move
                switch (keyCode) {
                    case 39: //d
                        move_to = { x: this.getActivePlayer().position.x + 1,
                                    y: this.getActivePlayer().position.y };
                        break;
                    case 40: //s
                        move_to = { x: this.getActivePlayer().position.x,
                                y: this.getActivePlayer().position.y + 1 };
                        break;
                    case 37: //a
                        move_to = { x: this.getActivePlayer().position.x - 1,
                                y: this.getActivePlayer().position.y };
                        break;
                    case 38: //w
                        move_to = { x: this.getActivePlayer().position.x,
                                y: this.getActivePlayer().position.y - 1 };
                        break;
                }
            }
            // move if control clicked
            if(move_to != undefined){
                this.movePlayer(
                    this.getActivePlayer(),
                    move_to
                );
            }
        }
    }

    // on click
    onClick(e){
        const pos = this.getPositionSquare(e);
        this.movePlayer(this.getActivePlayer(), pos);
    }

    // determines if the player can move to specifi field
    canMove(player, x, y){
        let isCrossingTheWall = () => {
            let has_wall = false;
            let is_on_y = (player.position.y == y && player.position.x != x);
            let change = is_on_y ? x : y;
            let constant = is_on_y ? y : x;
            let compare_to = is_on_y ? player.position.x : player.position.y;
            let direction = compare_to > change ? 1 : -1;

            while(change != compare_to && !has_wall){
                if(compare_to == player.position.y && constant == x){
                    has_wall = this.fields[constant - 1][change - 1].dead;
                }
                else{
                    has_wall = this.fields[change - 1][constant - 1].dead;
                }

                change += direction;
            }

            return has_wall;
        };

        let move_distance = Math.sqrt(Math.pow(player.position.x - x, 2) + Math.pow(player.position.y - y, 2));
        const can_move = move_distance > 0 && move_distance <= player.maxMoveDistance // make sure player does not cross max move distance
            && (x == player.position.x || y == player.position.y) // make sure player can only move in line, not diagonaly
            && (x > 0 && x <= this.fieldsNumber) && (y > 0 && y <= this.fieldsNumber) // make sure the move is in the board
            && !this.fields[x-1][y-1].dead // make sure the field is not a wall (dead)
            && !isCrossingTheWall() // make sure player does not jump over walls

        return can_move; 
    }

    // moves player
    movePlayer(player, pos, forceMove = false){
        const x = pos.x;
        const y = pos.y;

        // calc players move distance
        if (this.canMove(player, x, y) || forceMove) { // if force move is true, everything else does not matter (this happens after the fight, when players are reset to default position)
            // clear available fields for current player
            this.clearAvailableFields();
            // see if there is a fight
            const other_player = this.getSecondPlayer();
            if(other_player.position.x == x && other_player.position.y == y){
                // players collided, don't draw one on top of another
                this.game.displayFightingDialog();
            }
            else{
                // clear current player from his position
                this.clearRect(player.position.x, player.position.y);

                // update players position
                player.updatePlayerPosition(x, y);

                if (this.fields[x - 1][y - 1].power_up != undefined) {
                    const power_up = this.fields[x - 1][y - 1].power_up;
                    this.fields[x - 1][y - 1].power_up = undefined;
                    this.clearRect(x, y);

                    player.applyPowerup(power_up);
                }

                // draw player again
                this.drawPlayer(player);

                // change turns in game
                this.game.changeTurn();
            }
        }
    }

    // gets the player currently on turn
    getActivePlayer(){
        return this.game.turn == 1 ? this.game.player1 : this.game.player2;
    }

    // gets player that is NOT active
    getSecondPlayer(){
        return this.game.turn == 1 ? this.game.player2 : this.game.player1;
    }

    // returns number of power ups currently on board
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

    // get coordinates of square based on x,y coordinates from MOUSE EVENT
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

    // draws the board and stores board fields in an array
    drawBoard() {
        // black borders
        this.boardCanvasContext.strokeStyle = 'black';

        for (var i = 0; i < this.fieldsNumber; i++) {
            this.fields[i] = [];
            for (var y = 0; y < this.fieldsNumber; y++) {
                // add new field
                this.fields[i][y] = new Field(i, y, this);
                // draw normal field
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

    // destroys the board, clears canvas, clears all event listeners
    destroy(){
        // clear canvas
        this.boardCanvasContext.clearRect(0, 0, this.boardCanvasEl.width, this.boardCanvasEl.height);

        this.boardCanvasEl.removeEventListener('click', this.onClick);
        document.body.removeEventListener('keydown', this.onKeyDown);
    }

    // draws a power up image on x,y field
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

    // draws available fields for current player
    drawAvailableFields(){

        const draw = (x, y, board) => {
            if(!board.fields[x][y].dead){
                const other_player = board.getSecondPlayer();
                // other player draw-over
                let draw_over = false;
                if(other_player.position.x-1 == x && other_player.position.y-1 == y){
                    board.boardCanvasContext.fillStyle = '#f44141';
                    draw_over = true;
                }
                else if(board.fields[x][y].power_up != undefined){
                    board.boardCanvasContext.fillStyle = '#f1f441';
                }
                else{
                    board.boardCanvasContext.fillStyle = '#65f442';
                }

                board.boardCanvasContext.fillRect(
                    x * board.fieldSize + 1.5*board.boardCanvasContext.lineWidth,
                    y * board.fieldSize + 1.5*board.boardCanvasContext.lineWidth,
                    board.fieldSize - 1.1*board.boardCanvasContext.lineWidth,
                    board.fieldSize - 1.1*board.boardCanvasContext.lineWidth
                );

                // if it was drawn over the player, draw that player again
                if(draw_over){
                    board.drawPlayer(other_player);
                }
                // if it was drawn over power up, draw the power up again
                if(board.fields[x][y].power_up != undefined){
                    board.drawPowerUp(x, y , board.fields[x][y].power_up);
                }

            }
        };

        const player = this.getActivePlayer();
        let x = player.position.x-1; // start from 0
        let y = player.position.y-1; // start from 0
        // mark up
        let drawn = 0;
        for(var i = y-1; i >= 0 && drawn < player.maxMoveDistance && !this.fields[x][i].dead; i--){
            draw(x, i, this);
            drawn++;
        }
        // mark down
        drawn = 0;
        for(var i = y+1; i < this.fieldsNumber && drawn < player.maxMoveDistance && !this.fields[x][i].dead; i++){
            draw(x, i, this);
            drawn++;
        }
        // mark left
        drawn = 0;
        for(var i = x-1; i >= 0 && drawn < player.maxMoveDistance && !this.fields[i][y].dead; i--){
            draw(i, y, this);
            drawn++;
        }
        // mark right
        drawn = 0;
        for(var i = x+1; i < this.fieldsNumber && drawn < player.maxMoveDistance && !this.fields[i][y].dead; i++){
            draw(i, y, this);
            drawn++;
        }
        // console.log('---------------');
    }

    // clears all available fields
    clearAvailableFields(){
        const clear = (x, y, board) => {
            if(!board.fields[x][y].dead){
                board.boardCanvasContext.clearRect(
                    x * board.fieldSize + 1.5*board.boardCanvasContext.lineWidth,
                    y * board.fieldSize + 1.5*board.boardCanvasContext.lineWidth,
                    board.fieldSize - 1.1*board.boardCanvasContext.lineWidth,
                    board.fieldSize - 1.1*board.boardCanvasContext.lineWidth
                );
                if(board.fields[x][y].power_up != undefined){
                    board.drawPowerUp(x, y , board.fields[x][y].power_up);
                }
            }
        };

        const player = this.getActivePlayer();
        let x = player.position.x-1; // start from 0
        let y = player.position.y-1; // start from 0
        // mark up
        let drawn = 0;
        for(var i = y-1; i >= 0 && drawn < player.maxMoveDistance; i--){
            // console.log(x + ', ' + i);
            clear(x, i, this);
            drawn++;
        }
        // mark down
        drawn = 0;
        for(var i = y+1; i < this.fieldsNumber && drawn < player.maxMoveDistance; i++){
            // console.log(x + ', ' + i);
            clear(x, i, this);
            drawn++;
        }
        // mark left
        drawn = 0;
        for(var i = x-1; i >= 0 && drawn < player.maxMoveDistance; i--){
            // console.log(i + ', ' + y);
            clear(i, y, this);
            drawn++;
        }
        // mark right
        drawn = 0;
        for(var i = x+1; i < this.fieldsNumber && drawn < player.maxMoveDistance; i++){
            // console.log(i + ', ' + y);
            clear(i, y, this);
            drawn++;
        }
        // console.log('---------------');
        this.drawPlayer(this.getSecondPlayer());
    }

    // places a wall image on a field
    blockField(x, y){
        let image = this.game.ui.icons.wall;
        this.boardCanvasContext.drawImage(
            image,
            x * this.fieldSize + this.boardCanvasContext.lineWidth,
            y * this.fieldSize + this.boardCanvasContext.lineWidth,
            this.fieldSize,
            this.fieldSize
        );
    }

    // clears player from his position
    clearRect(x, y){
        // clear current player
        this.boardCanvasContext.clearRect(
            (x - 1) * this.fieldSize + this.boardCanvasContext.lineWidth * 1.5,
            (y - 1) * this.fieldSize + this.boardCanvasContext.lineWidth * 1.5,
            this.fieldSize - this.boardCanvasContext.lineWidth,
            this.fieldSize - this.boardCanvasContext.lineWidth
        );
    }

    // draws a player
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
    }

}

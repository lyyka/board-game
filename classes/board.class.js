class Board{
    constructor(fieldSize, fieldsNumber){
        this.fieldsNumber = fieldsNumber;
        this.fieldSize = fieldSize;
        this.boardCanvasEl = document.getElementById('board');
        this.boardCanvasEl.width = (this.fieldsNumber * this.fieldSize);
        this.boardCanvasEl.height = (this.fieldsNumber * this.fieldSize);
        this.boardCanvasContext = this.boardCanvasEl.getContext('2d');

        this.boardCanvasEl.addEventListener('click', function(e){
            
        });
    }

    init(){
        this.drawBoard();
        this.drawPlayers(0,0,this.fieldsNumber-1,this.fieldsNumber-1);
    }

    drawBoard() {
        this.boardCanvasContext.strokeStyle = 'black';

        for (var i = 0; i < this.fieldsNumber; i++) {
            for (var y = 0; y < this.fieldsNumber; y++) {
                this.boardCanvasContext.rect(i * this.fieldSize, y * this.fieldSize, this.fieldSize, this.fieldSize);
            }
        }

        this.boardCanvasContext.stroke();
    }

    drawPlayers(pos_x1, pos_y1, pos_x2, pos_y2) {
        const player1_color = 'blue';
        const player2_color = 'red';

        this.boardCanvasContext.fillStyle = player1_color;
        this.boardCanvasContext.fillRect(pos_x1 * this.fieldSize, pos_y1 * this.fieldSize, this.fieldSize-1, this.fieldSize-1);

        this.boardCanvasContext.fillStyle = player2_color;
        this.boardCanvasContext.fillRect(pos_x2 * this.fieldSize, pos_y2 * this.fieldSize, this.fieldSize-1, this.fieldSize-1);
    }

}
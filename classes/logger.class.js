class Logger{
    constructor(){
        this.logWrapper = document.getElementById('game-log');
        this.turnIndicator = document.getElementById('turn-indicator');
    }

    logTurn(game){
        let message = 'Player';
        let color = 'black';
        if(game.turn == 1){
            message += ' 1 on turn';
            color = game.player1.color;
        }
        else if(game.turn == 2){
            message += ' 2 on turn';
            color = game.player2.color;
        }

        this.turnIndicator.style.color = color;
        this.turnIndicator.innerText = message;
    }

    logMessage(message, color='black'){
        const node = document.createElement('span');
        node.style.color = color;
        const text = document.createTextNode(message);
        node.appendChild(text);

        this.logWrapper.appendChild( node );
        this.logWrapper.appendChild( document.createElement('br') );
    }
}
class Logger{
    constructor(){
        this.logWrapper = document.getElementById('game-log');
        this.turnIndicator = document.getElementById('turn-indicator');
    }

    clear(){
        while(this.logWrapper.firstChild){
            this.logWrapper.removeChild(this.logWrapper.firstChild);
        }
    }

    logTurn(game){
        let message = 'Player';
        let color = 'black';
        if(game.turn == 1){
            message += ' 1 on turn';
        }
        else if(game.turn == 2){
            message += ' 2 on turn';
        }

        this.turnIndicator.innerText = message;
    }

    logMessage(message, color='black'){
        const node = document.createElement('span');
        node.style.color = this.logWrapper.parentElement.classList.contains("full-dark-bg") ? "white" : color;
        const text = document.createTextNode(message);
        node.appendChild(text);

        this.logWrapper.appendChild( node );
        this.logWrapper.appendChild( document.createElement('br') );
    }
}
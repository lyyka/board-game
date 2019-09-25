let current_game = undefined;
let player1_image = undefined;
let player2_image = undefined;

(function(){
    // just disable scroll on arrow keys due to game controls
    window.addEventListener("keydown", function (e) {
        // space and arrow keys
        if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
            e.preventDefault();
        }
    }, false);

    // binds on click listener to green start button
    document.getElementById('start-game').onclick = setup;
})();

function setup(){
    if(current_game != undefined){
        current_game.clearEverything();
        current_game = undefined;
    }
    const player_chars = document.getElementsByClassName('player-character');
    for(var i = 0; i < player_chars.length; i++){
        player_chars[i].onclick = onImageClick;
    }
    // show modal to choose colors and characters
    $("#gameSetup").modal({
        backdrop: 'static',
        keyboard: false
    });

    document.getElementById('start-game-final').addEventListener('click', preStart, {
        once: true
    });
}

function onImageClick(e){
    // get clicked image
    let target = e.target || e.srcElement;
    // get data-player attribute of the image so we know which image is for which player
    let for_player = target.getAttribute('data-player');
    let all_images = undefined;
    if (for_player == 1) {
        player1_image = target;
        all_images = document.getElementsByClassName('pc-1');
    }
    if (for_player == 2) {
        player2_image = target;
        all_images = document.getElementsByClassName('pc-2');
    }
    if(all_images != undefined){
        // remove active class from all images so only this one remains selected
        for (var i = 0; i < all_images.length; i++) {
            const image = all_images[i];
            image.classList.remove('active');
        }
    }
    // add active to this image
    target.classList.add('active');
}

function preStart(){
    if(player1_image != undefined && player2_image != undefined){
        $("#gameSetup").modal('hide');
        startGame(player1_image, player2_image);
    }
    else{
        alert('Both players should choose a character first!');
    }
}

function startGame(p1_image, p2_image){
    const canvas = $("<canvas></canvas>", {
        class: 'dm-bg-darken-full ' + ($("#dark-mode").prop('checked') ? 'full-dark-bg' : 'bg-white'),
        id: 'board'
    });
    $("#canvas-wrap").empty();
    $("#canvas-wrap").append(canvas);
    // create new game, this will also create a board object inside game and draw it
    const game = new Game(options());
    current_game = game;

    // remove active class from image elements
    p1_image.classList.remove('active', 'player-character');
    p2_image.classList.remove('active', 'player-character');
    // create players
    const player1 = new Player(30, 150, p1_image, game);
    const player2 = new Player(30, 150, p2_image, game);

    // assign players default positions
    player1.setPosition(1, 1);
    player2.setPosition(game.board.fieldsNumber, game.board.fieldsNumber);

    // assign players to game
    game.player1 = player1;
    game.player2 = player2;

    // set player statuses
    game.drawStatuses();

    // start game
    game.start();

    // draw players
    game.board.drawPlayer(player1)
    game.board.drawPlayer(player2);
}

function options(){
    return {
        fasterPowerups: $("#faster-powerups").prop('checked'),
        oneShotGame: $("#one-shot-game").prop('checked'),
        deadFields: $("#dead-fields").prop('checked'),
        maxPowerups: 10,
        maxDeadFields: 14
    };
}

class UI{
    constructor(){

        // icons
        this.icons = {
            hp: document.getElementById('hp_potion'),
            attack_power: document.getElementById('attack_power'),
        }

        // fighting modal (must be jquery selector because of .modal() function called later on to show the modal)
        this.fightingModal = $('#fightingDialog');
        this.fightingModalButton = document.getElementById('init-fight');
        this.fightingModalDecisions = {
            player1: undefined,
            player2: undefined
        }
        this.fightingModalLabels = {
            player1: document.getElementsByClassName("p1-label"),
            player2: document.getElementsByClassName("p2-label")
        }

        // win modal
        this.winModal = $("#winDialog");
        this.winModalLabels = {
            title: document.getElementById("winModal-title"),
            content: document.getElementById("winModal-content")
        }

    }

    getPlayersDecisions(){
        this.fightingModalDecisions = {
            player1: $('input[name=p1-action]:checked').val(),
            player2: $('input[name=p2-action]:checked').val()
        }
        return this.fightingModalDecisions;
    }

    showWinningModal(winnerInfo){
        // add text to labels
        this.winModalLabels.title.innerText = winnerInfo.label + ' won the match!';
        this.winModalLabels.content.innerText = 'Congratulations! You won the game by defeating your oponnent and getting his health down to zero. Feel free to start another round by pressing "Start" button, as usual.';

        // color the labels
        this.winModalLabels.title.style.color = winnerInfo.obj.color;
        this.winModalLabels.content.style.color = winnerInfo.obj.color;

        // show modal
        this.winModal.modal();
    }
}
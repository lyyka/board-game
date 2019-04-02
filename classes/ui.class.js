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

    }

    getPlayersDecisions(){
        this.fightingModalDecisions = {
            player1: $('input[name=p1-action]:checked').val(),
            player2: $('input[name=p2-action]:checked').val()
        }
        return this.fightingModalDecisions;
    }
}
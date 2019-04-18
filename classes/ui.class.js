class UI{
    constructor(){

        // icons
        this.icons = {
            hp: document.getElementById('hp_potion'),
            hp_adv: document.getElementById('hp_potion_adv'),
            attack_power: document.getElementById('attack_power'),
            attack_power_adv: document.getElementById('attack_power_adv'),
            crit_damage: document.getElementById('crit_damage'),
            wall: document.getElementById('wall')
            // players: {
            //     batman: document.getElementById('player_batman'),
            //     bear: document.getElementById('player_bear'),
            //     bunny: document.getElementById('player_bunny'),
            //     duck: document.getElementById('player_duck'),
            //     flash: document.getElementById('player_flash'),
            //     guy: document.getElementById('player_guy'),
            //     ninja_turtle: document.getElementById('player_ninja_turtle'),
            // }
        }

        // player status wrapper
        this.playerStatuses = {
            wrap: document.getElementById('player-status-wrapper'),
            player1: {
                image: document.getElementById('p1-status-image'),
                label: document.getElementById('p1-status-label'),
                hp: document.getElementById('p1-status-hp'),
                ap: document.getElementById('p1-status-ap'),
                crit_damage: document.getElementById('p1-status-crit-damage'),
            },
            player2: {
                image: document.getElementById('p2-status-image'),
                label: document.getElementById('p2-status-label'),
                hp: document.getElementById('p2-status-hp'),
                ap: document.getElementById('p2-status-ap'),
                crit_damage: document.getElementById('p2-status-crit-damage'),
            }
        }

        // fighting modal (must be jquery selector because of .modal() function called later on to show the modal)
        this.fightingModal = $('#fightingDialog');
        this.fightingModalButton = document.getElementById('init-fight');
        this.fightingModalDecisions = {
            player1: undefined,
            player2: undefined
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

        // show modal
        this.winModal.modal();
    }
}

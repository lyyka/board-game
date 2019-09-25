const classes = {
    full_darken: {
        text: 'dm-text-darken-full',
        bg: 'dm-bg-darken-full'
    },
    darken: {
        text: 'dm-text-darken',
        bg: 'dm-bg-darken'
    },
    lighten: {
        text: 'dm-text-lighten',
        bg: 'dm-bg-lighten'
    }
}

$(document).ready(function(){
    $("#dark-mode").on('change', onChange);
    if ($("#dark-mode").prop('checked')) {
        turnOn();
    }
})


function onChange(){
    const on = $(this).prop('checked');
    if(on){
        turnOn();
    }
    else{
        turnOff();
    }
}

function addBorder(selector) {
    $(selector).addClass('border');
}

function removeBorder(selector){
    $(selector).removeClass('border');
}

function turnOn(){
    $("#game-log").find('span').css("color", "white");
    // remove the border and add shadow
    removeBorder("." + classes.full_darken.bg);
    removeBorder("#start-game");
    // toggle between white bg to full dark bg
    $("." + classes.full_darken.bg).toggleClass('bg-white full-dark-bg');
    // darken the text
    $("." + classes.full_darken.text).addClass('text-dark');
    // darken bgs and text
    $("." + classes.darken.bg).addClass('cs-blue-bg');
    $("." + classes.darken.text).addClass('cs-blue-text');
    // lighten bgs and text
    $("." + classes.lighten.bg).addClass('bg-white');
    $("." + classes.lighten.text).addClass('text-white');
}

function turnOff(){
    $("#game-log").find('span').css("color", "black");
    addBorder("." + classes.full_darken.bg);
    addBorder("#start-game");
    $("." + classes.full_darken.bg).toggleClass('full-dark-bg bg-white');
    $("." + classes.full_darken.text).removeClass('text-dark');
    $("." + classes.darken.bg).removeClass('cs-blue-bg');
    $("." + classes.darken.text).removeClass('cs-blue-text');
    $("." + classes.lighten.bg).removeClass('text-white');
    $("." + classes.lighten.text).removeClass('text-white');
}

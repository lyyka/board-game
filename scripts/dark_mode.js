(function(){
    $("#dark-mode").on('change', onChange);
})();

const classes = {
    darken: {
        text: 'dm-text-darken',
        bg: 'dm-bg-darken'
    },
    lighten: {
        text: 'dm-text-lighten',
        bg: 'dm-bg-lighten'
    }
}

function onChange(){
    const on = $(this).prop('checked');
    console.log(on);
    if(on){
        turnOn();
    }
    else{
        turnOff();
    }
}

function turnOn(){
    $("." + classes.darken.bg).addClass('cs-blue-bg');
    $("." + classes.darken.text).addClass('cs-blue-text');
    $("." + classes.lighten.bg).addClass('bg-white');
    $("." + classes.lighten.text).addClass('text-white');
}

function turnOff(){
    $("." + classes.darken.bg).removeClass('cs-blue-bg');
    $("." + classes.darken.text).removeClass('cs-blue-text');
    $("." + classes.lighten.bg).removeClass('text-white');
    $("." + classes.lighten.text).removeClass('text-white');
}

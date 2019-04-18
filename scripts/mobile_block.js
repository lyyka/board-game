(function(){
    const isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function() {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };

    if(isMobile.any()){
        const body = $("body");
        body.empty();
        body.css('background-color', '#121420');
        body.append(
            "<div class = 'text-center'><img src = 'images/computer.png' class = 'img-fluid mb-5' width = '256' /></div>" +
            "<h3 class = 'text-center' style = 'color: #B76D68'>Please use this app on your computer.</h3>"
        );
    }
})();

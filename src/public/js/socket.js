// Dirección IP a la que se suscribe para recibir alertas
var ipaddress = '148.217.94.130';
var port = 80;

/* var ipaddress = '127.0.0.1';
var port = 3000; */

$(document).ready(function(){
    // Inicialización del socket
    var socket = io('http://'+ipaddress+':'+port);
    // Evento de una alerta lanzada
    socket.on('alert fired', function(msg){
        // Se dibujan y muestran las animaciones de alerta en la página
        $('.notification-box').html('<span class="notification-count">1</span>'
                                    +'<div class="notification-bell dropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id="alertsDropdown">'
                                        + '<span class="bell-top"></span>'
                                        + '<span class="bell-middle"></span>'
                                        + '<span class="bell-bottom"></span>'
                                        + '<span class="bell-rad"></span>'
                                    + '</div>'
                                    + '<div id="dropNotif" class="dropdown-list dropdown-menu shadow animated--grow-in" aria-labelled-by="alertsDropdown">'
                                    + '</div>');
        
        $('.notification').html('<div class="content"><div class="identifier"></div><div class="text text-white">Alerta!</div></div>');

        $('.notification').addClass('notify');
        $('.identifier').addClass('exit');
        $('.text').addClass('exit');
        
        $('.notification-count').addClass('new-notification');
        $('.notification-bell').addClass('new-notification');
        $('.bell-rad').addClass('new-notification');
        var header = '<h6 class="dropdown-header">Centro de Alertas</h6>';
        var aStart = '<a class="dropdown-item d-flex align-items-center" href="#">';
        var divIcon = '<div class="icon-circle bg-warning">';
        var divI = '<i class="fas fa-exclamation-triangle text-white"></i></div>';
        var mssg = '</div><span class="small">Alerta! Una colmena ha sido abierta</span></a>'
        $('#dropNotif').html(header+aStart+divIcon+divI+mssg);

        // Si se da click la campana se detiene la animación
        $('.notification-box').click(function(e){
            e.preventDefault();
            $('.notification-count').removeClass('new-notification');
            $('.notification-bell').removeClass('new-notification');
            $('.bell-rad').removeClass('new-notification');
        });

        // Si se da click la campana se elimina el elemento de alerta
        $('.notification > .notify').on('click', function(e){
            e.preventDefault();
            $(this).remove();
        });

        // Se centra el mapa en el dispositivo que envió la alerta
        updateMap(true, msg);
    });
});
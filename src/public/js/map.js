var map;
var lat;
var lng;
var markers = [];
var latlngFocused;


/**
 *  Inicializa el mapa
 */
function initMap() {
    // Se obtienen los parámetros de posicionamiento de la zona predeterminada
    lat = parseFloat(document.getElementById('lat').value);
    lng = parseFloat(document.getElementById('lng').value);
    
    // Se crea el objeto LatLng para maps con las coordenadas
    var myLatLng = new google.maps.LatLng(lat, lng);

    // Se dibuja el mapa en el elemento html indicado
    map = new google.maps.Map(document.getElementById('map'), {
        center: myLatLng,
        zoom: 18
    });
}


/**
 * 
 * @param {boolean} isAlert indica si se trata de una alerta o no.
 * @param {Object} colmenas objeto de una o varias colmenas.
 */
function updateMap(isAlert, colmenas) {
    // Si se trata de una alerta se borran los marcadores existentes (de haberlos)
    // y se centra la vista en el marcador del dispositivo que envió la alerta
    if (isAlert) {
        deleteMarkers();        
        drawMarker(colmenas.msg.position[0].lat, colmenas.msg.position[0].lng, colmenas.msg._id);
        latlngFocused = new google.maps.LatLng(colmenas.msg.position[0].lat, colmenas.msg.position[0].lng);
        map.panTo(latlngFocused);
        map.setZoom(16);
    } else {
        // De no tratarse de una alerta, se trata de la selección del usuario
        // por lo que se dibujan los marcadores de la zona seleccionada
        deleteMarkers();
        colmenas.forEach((colmena, idx, colmenas) => {
            drawMarker(colmena.position.lat, colmena.position.lng, colmena.alias);
            if (idx === (colmenas.length -1)) {
                latlngFocused = new google.maps.LatLng(colmena.position.lat, colmena.position.lng);
            }
        });
    showMarkers();
    }
}

/**
 * Crea el marcador personalizado
 * @param {String} lat Latitud
 * @param {String} lng Longitud
 * @param {String} tag Etiqueta del marcador
 */
function drawMarker(lat, lng, tag) {
    var myLatLng = new google.maps.LatLng(lat,lng);
    var customMarker = '/img/Marcador_GDE.png';

    var iconMap = new google.maps.MarkerImage(
        customMarker,
        null,
        null,
        null,
        new google.maps.Size(30,30),
    );

    var marker = new google.maps.Marker({
        icon: iconMap,
        position: myLatLng,
        map: map,
        opacity: 1,
        label: {
            color: '#806600',
            fontsize: '12px',
            fontWeight: 'bold',
            text: tag,
            labelOrigin: new google.maps.Point(0,0)
        }
    });

    markers.push(marker);
}

/**
 * Dibuja los marcadores en el mapa indicado
 * @param {GoogleMaps} map Google maps object
 */
function setMapOnAll(map) {
    for(let index = 0; index < markers.length; index++){
        markers[index].setMap(map);
    }
}

/**
 * Elimina todos los marcadores del mapa
 */
function clearMarkers() {
    setMapOnAll(null);
}


/**
 * Relaciona los marcadores y aplica las configuraciones del mapa indicadas
 */
function showMarkers() {
    setMapOnAll(map);
    map.panTo(latlngFocused);
    map.setZoom(16);
}

/**
 * Elimina los marcadores del mapa y limpia el arreglo markers
 */
function deleteMarkers() {
    clearMarkers();
    markers = [];
}
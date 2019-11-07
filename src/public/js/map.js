var map;
var lat;
var lng;
var markers = [];
var latlngFocused;


/**
 *  Inicializa el mapa
 */

function initMap() {
    lat = parseFloat(document.getElementById('lat').value);
    lng = parseFloat(document.getElementById('lng').value);
    var myLatLng = new google.maps.LatLng(lat, lng);
    map = new google.maps.Map(document.getElementById('map'), {
        center: myLatLng,
        zoom: 18
    });
}

function updateMap(colmenas) {
    deleteMarkers();

    colmenas.forEach((colmena, idx, colmenas) => {
        drawMarker(colmena.position.lat, colmena.position.lng, colmena.alias);

        if (idx === (colmenas.length -1)) {
            latlngFocused = new google.maps.LatLng(colmena.position.lat, colmena.position.lng);
        }
    });

    showMarkers();
}

function drawMarker(lat, lng, tag) {
    var myLatLng = new google.maps.LatLng(lat,lng);
    var customMarker = '/img/Marcador_GDE.png';

    var iconMap = new google.maps.MarkerImage(
        customMarker,
        null,
        null,
        null,
        new google.maps.Size(30,30)
    );

    var marker = new google.maps.Marker({
        icon: iconMap,
        position: myLatLng,
        title: tag,
        map: map,
        opacity: 1,
        label: {
            color: '#806600',
            fontsize: '12px',
            fontWeight: 'bold',
            text: tag
        }
    });

    markers.push(marker);
}

function setMapOnAll(map) {
    for(let index = 0; index < markers.length; index++){
        markers[index].setMap(map);
    }
}

function clearMarkers() {
    setMapOnAll(null);
}

function showMarkers() {
    setMapOnAll(map);
    map.panTo(latlngFocused);
    map.setZoom(16);
}

function deleteMarkers() {
    clearMarkers();
    markers = [];
}
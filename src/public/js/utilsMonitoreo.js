function getColmenas(zone_id) {
    $.ajax({
        url: "/tracking",
        type: "POST",
        data: {zone_id: zone_id},
        dataType: 'json',
        success: function (colmenas) {
            var out = "";
            colmenas.forEach(colmena => {
                out+='<tr><td id=\"tag\" value=\"'+ colmena._id +'\">' + colmena._id + '</td><td>'+colmena.alias+'</td><td><img class=\"battery\" value=\"'+colmena.battery+'\" src=\"'+drawBattery(colmena.battery)+'\"></td>';
            });

            $('#tableHives').html(out);

            updateMap(colmenas);
        },
        statusCode: {
            500: function (statusCode) {
                alert('Algo salió mal.');
            }
        }
    });
}


function drawBattery(batteryLvl) {
    var level = "";
    switch (batteryLvl) {
        case '0':
            level = "/img/battery/battery_0.png";
            break;
    
        case '1':
            level = "/img/battery/battery_1.png";
            break;
        
        case '2':
            level = "/img/battery/battery_2.png";
            break;
        
        case '3':
            level = "/img/battery/battery_3.png";
            break;
        
        default:
            level = "/img/battery/battery_0.png";
            break;
    }

    return level;
}
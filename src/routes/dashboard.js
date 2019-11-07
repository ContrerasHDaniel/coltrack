const express = require('express');
const router = express.Router();
const Zona = require('../models/Zona');
const Colmena = require('../models/Colmena');

router.get('/', async (req, res) => {
    const zonas = await Zona.find().exec(function(err, zonas){
        if(err){
            res.sendStatus(500);
        } else {
            res.render('contents/dashboard', {
                zonas,
                lat: zonas[0].zone_lat,
                lng: zonas[0].zone_lng
            });
        }
    });
});

router.post('/tracking', async (req, res) => {
    const colmenas = await Colmena.aggregate([
        {
            $match: {
                zone_id: req.body.zone_id,
            }
        },
        {
            $lookup: {
                from: "devicegps",
                localField: "device_id",
                foreignField: "_id",
                as: "device"
            }
        },
        {
            $replaceRoot: {
                newRoot: {
                    $mergeObjects:[{
                        $arrayElemAt: ["$device", 0]
                    }, "$$ROOT"]
                }
            }
        },
        {
            $project: {
                device: 0
            }
        }
    ]).exec(function (err, colmenas) {
        if (err) {
            res.sendStatus(500);
        } else {
            colmenas = getLastLng(colmenas);
            res.json(colmenas);
        }
    });
});

module.exports = router;

function getLastLng(colmenas) {
    // Se mapea el documento devices, obtenido por la consulta para poder realizar operaciones como si fuera un arreglo.
	colmenas.map(function(colmena){
		// Se obtienen las últimas coordenadas en el arreglo position y se almacenan en variables temporales.
		var lat = colmena.position[colmena.position.length -1 ].lat;	
		var lng = colmena.position[colmena.position.length -1 ].lng;
		// Se borran las demás coordenadas contenidas en el arreglo position.
		colmena.position = [];
		// Se escriben en el arreglo position las últimas coordenadas.
		colmena.position = {lat: lat, lng: lng};
		return colmena; 
	});
	// Se regresa el objeto modificado.
	return colmenas;
}
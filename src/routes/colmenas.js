const express = require('express');
const router = express.Router();
const Colmena = require('../models/Colmena');

/**
 * Routes HTTP GET requests to the specified path with the specified callback functions.
 * See {@link https://expressjs.com/es/api.html#app.get.method} and {@link https://nodejs.org/api/modules.html#modules_module_exports}
 */
router.get('/colmenas', async (req, res) => {
    /**
     * Obtiene la información de todas las colmenas registradas en la base de datos.
     */
    const colmenas = await Colmena.aggregate([
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
        },
        {
            $lookup: {
                from: "zonas",
                localField: "zone_id",
                foreignField: "_id",
                as: "zone"
            }
        },
        {
            $replaceRoot: {
                newRoot: {
                    $mergeObjects: [{
                        $arrayElemAt: ["$zone", 0]
                    }, "$$ROOT"]
                }
            }
        }
    ]).exec(function(err, colmenas) {
        // Si existe un error se envía una respuesta 500 al cliente
        if(err){
            res.sendStatus(500);
        } else {
            // Si todo sale bien, se renderiza la página colmenas.hbs y se envía el objeto colmenas para su uso dentro de la página
            res.render('contents/colmenas', {colmenas});
        }
    });
});

module.exports = router;
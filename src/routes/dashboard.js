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
            res.json(colmenas);
        }
    });
});

module.exports = router;
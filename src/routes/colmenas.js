const express = require('express');
const router = express.Router();
const Colmena = require('../models/Colmena');

router.get('/colmenas', async (req, res) => {
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
        if(err){
            res.sendStatus(500);
        } else {
            res.render('contents/colmenas', {colmenas});
        }
    });
});

module.exports = router;
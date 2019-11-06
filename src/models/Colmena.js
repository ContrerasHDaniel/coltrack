const mongoose = require('mongoose').set('debug', true);

const { Schema } = mongoose;

const ColmenaSchema = new Schema({
    _id: String,
    alias: String,
    type: String,
    frames: String,
    reserveFrame: String,
    lastCleanUp: Date,
    production: String,
    device_id: String,
    zone_id: String
});

module.exports = mongoose.model('Colmena', ColmenaSchema, 'colmenas');
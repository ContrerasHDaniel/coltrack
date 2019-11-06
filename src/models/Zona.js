const mongoose = require('mongoose');

const {Schema} = mongoose;

const ZonaSchema = new Schema({
    _id: String,
    client_id: String,
    zone_name: String,
    zone_lat: String,
    zone_lng: String
});

module.exports = mongoose.model('Zona', ZonaSchema, 'zonas');
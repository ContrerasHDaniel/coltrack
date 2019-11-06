const mongoose = require('mongoose');

const {Schema} = mongoose;

const positionSchema = new Schema({
    _id: Date, 
    lat: String, 
    lng: String
});
const DeviceGPSSchema = new Schema({
    _id: String,
    position: [positionSchema],
    battery: String,
    alert: Boolean,
    relative_id: String
});

module.exports = mongoose.model('DeviceGPS', DeviceGPSSchema, 'devicegps');
const mongoose = require('mongoose');

const GeoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    originalId: { type: String },
    coordId: { type: String },
    type: { type: String, enum: ['country', 'state', 'city'] },
    state: { type: String },
    state_name: { type: String },
    region_name: { type: String },
    population: { type: String },
    country: { type: String },
    date_created: { type: Date },
   
});

const Geo = mongoose.model('Geo', GeoSchema);

module.exports = { Geo };

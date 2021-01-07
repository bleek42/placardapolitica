
const mongoose = require('mongoose');

const PoliticSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: { type: String },
    status: { type: String, enum: ['draft', 'active', 'inactive'], default: 'active' },
    type: { type: String, enum: ['house', 'senate'], default: 'house' },
    date_created: { type: Date },
    date_ended: { type: Date },
    party: { type: mongoose.Schema.Types.ObjectId, ref: 'Party' },
    full_name: { type: String },
    color: { type: String }, // party Color
    description: { type: String },
    date_created: { type: Date , default: Date.now},
    short_name: { type: String },
    originalId: { type: String },
    idLegislature: { type: String },
    gender: { type: String },
    image: { type: String },
    website: { type: String },
    email: { type: String },
    phones: { type: String },
    state: { type: String },
    partyName: { type: String },
    country: { type: String },
    roles: { type: String },
});

const Politic = mongoose.model('Politic', PoliticSchema);

const PartySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    short_name: { type: String },
    name_old: { type: String },
    short_name_old: { type: String },
    color: { type: String },
    description: { type: String },
    date_created: { type: Date },
    originalId: { type: String },
    country: { type: String },
    status: { type: String, enum: ['draft', 'active', 'inactive'], default: 'active' }
});

const Party = mongoose.model('Party', PartySchema);

module.exports = { Party, Politic };

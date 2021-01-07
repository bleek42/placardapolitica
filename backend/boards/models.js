const mongoose = require('mongoose');
const slugify = require('slugify');
const BoardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    slug: { type: String },
    hashtag: { type: String },
    description: { type: String },
    house: { type: Boolean, default: false },
    senate: { type: Boolean, default: false },
    state: { type: Boolean, default: false }, // By the states of the country
    city: { type: Boolean, default: false }, // All cities of the country
    city_states: [{ type: String, default: false }], // 'am', 'mg'...
    valueType: { type: String, enum: ['boolean', 'currency', 'number', 'date'], default: 'boolean' },
    country: { type: String, default: 'br' },
    date_created: { type: Date, default: Date.now },
    date_ended: { type: Date },
    date_deleted: { type: Date },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    propositions: [{
        proposition: { type: mongoose.Schema.Types.ObjectId, ref: 'Proposition' },
        date_created: { type: Date, default: Date.now },
        type: { type: String, enum: ['house', 'senate'] }
    }],
    votes: [{
        politic: { type: mongoose.Schema.Types.ObjectId, ref: 'Politic' },
        date_created: { type: Date, default: Date.now },
        link: { type: String },
        description: { type: String },
    }]
});

BoardSchema.pre('validate', async function (next) {
    if (!this.state) this.state = false;
    if (!this.city) this.city = false;
    if (!this.house) this.house = false;
    if (!this.senate) this.senate = false;
    // if (!this.house && !this.senate) {
    //     next('Error house or senate must be checked')
    // } else {
    //     next();
    // }

    if (!this.slug) {
        this.slug = slugify(this.title.toLowerCase());
    }

    next();
});

const Board = mongoose.model('Board', BoardSchema);

const findBoardSlug = id => (mongoose.Types.ObjectId.isValid(id) ?
    { _id: id, date_deleted: { $exists: false } } :
    { slug: id, date_deleted: { $exists: false } });

module.exports = { Board, findBoardSlug };

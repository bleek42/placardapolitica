
const mongoose = require('mongoose');
// import * as populate from 'mongoose-deep-populate';
// const deepPopulate = populate(mongoose);

const VoteSchema = new mongoose.Schema({
    politic: { type: mongoose.Schema.Types.ObjectId, ref: 'Politic' },
    geo: { type: mongoose.Schema.Types.ObjectId, ref: 'Geo' },
    board: { type: mongoose.Schema.Types.ObjectId, ref: 'Board' },
    proposition: { type: mongoose.Schema.Types.ObjectId, ref: 'Proposition' },
    date_created: { type: Date, default: Date.now },
    link: { type: String },
    originalId: { type: String },
    type: { type: String, enum:['city','state','house','senate'] },
    status: { type: String, enum:['open','accepted','rejected','deleted', 'spam'], default: 'open' },
    description: { type: String },
    value: { type: mongoose.Schema.Types.Mixed },
    answer: { type: String },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    comments: [{
        owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        date_created: { type: Date, default: Date.now },
        message: { type: String }
    }]
});
VoteSchema.index({
    board: 1,
    originalId: 1
})
const Vote = mongoose.model('Vote', VoteSchema);


const PropositionSchema = new mongoose.Schema({
    name: { type: String },
    popularName: { type: String },
    link: { type: String },
    number: { type: String },
    year: { type: String },
    description: { type: String },
    typeLaw: { type: String },
    originalId: { type: String },
    type: { type: String, enum: ['house', 'senate'], default: 'senate' },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    votations: [{
        originalId: { type: String },
        description: { type: String },
        date_created: { type: Date, default: Date.now },
    }]
});

const Proposition = mongoose.model('Proposition', PropositionSchema);

module.exports = { 
    Vote,
    Proposition
};

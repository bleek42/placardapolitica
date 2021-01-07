
const mongoose = require('mongoose');
// import * as populate from 'mongoose-deep-populate';
// const deepPopulate = populate(mongoose);

const UserSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: true
    },
    user_name: { type: String },
    nickname: { type: String },
    password: { type: String },
    date_created: { type: Date },
    address: {
        street: { type: String },
        number: { type: String },
        zipcode: { type: String },
        city: { type: String },
        state: { type: String }
    }
    //   ownerSeller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' },
    //   users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: [true, 'No User id found'] }],
});

const User = mongoose.model('User', UserSchema);

module.exports = { User };

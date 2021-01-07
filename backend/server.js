const mongoose = require('mongoose');
const app = require('./app');
const {DATABASE_URL, PORT} = require('./config');

mongoose.connect(DATABASE_URL, err => {
    if (err) {
        return console.error(err);
    }

    console.log(`Connected to db at ${DATABASE_URL}`);

    const server = app.listen(PORT, () => {
        console.log(`Listen to port ${PORT}`, new Date().toString());
    });

    // const io = socket(server);
    // startSockets(io);

});


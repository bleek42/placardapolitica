const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const express = require('express');
const { NODE_ENV } = require('./config')
const app = express();

app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common', {
    skip: () => NODE_ENV === 'test',
}))
app.use(cors())
app.use(helmet())

const usersRouter = require('./users/router');
const authRouter = require('./auth/router');
const boardsRouter = require('./boards/router');
const politicsRouter = require('./politics/router');
const votesRouter = require('./votes/router');
const geoRouter = require('./geo/router');

app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/boards', boardsRouter);
app.use('/api/politics', politicsRouter);
app.use('/api/votes', votesRouter);
app.use('/api/geo', geoRouter);

app.use((error, req, res, next) => {
    console.log(error)
    if(NODE_ENV === 'production'){
        res.sendStatus(500)
    }else{
        res.status(500).send(error)
    }
});

app.set('country', 'br');

module.exports = app;
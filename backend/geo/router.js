const express = require('express')
const path = require('path')
const { Geo } = require('./models')
const geoRouter = express.Router()
const jsonBodyParser = express.json()

geoRouter
  .get('/states', jsonBodyParser, async (req, res, next) => {
    const data = await Geo.find({
      type: 'state'
    })
    res.json(data)
  })
  .get('/state/:id', jsonBodyParser, (req, res, next) => {
    const id = req.params.id.replace(/[0-9]/g, '');
    const data = require(`../scripts/data/br/coords/${id}.json`)
    res.json(data)
  })
  .get('/cities', jsonBodyParser, (req, res, next) => {
    const data = require(`../scripts/data/br/municipality.json`)
    res.json(data)
  })
  .get('/cities/:state_id', jsonBodyParser, (req, res, next) => {
    Geo.find({
      state: req.params.state_id.toUpperCase()
    })
      .then(data => {
        res.json(data)
      });
  })


module.exports = geoRouter
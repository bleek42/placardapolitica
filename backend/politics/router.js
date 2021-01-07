const express = require('express');
const { Party, Politic } = require('./models');
const router = express.Router();
const { getLawHouse } = require('./services');

/**
 * Parties
 */
router.route('/parties')
    .get((req, res) => {
        Party.find({
            status: `active`,
            country: req.query.country || req.app.get('country')
        }).sort('short_name')
            .then(p => res.json(p))
    });

router.route('/parties/:id')
    .get((req, res) => {
        Party.find({
            _id: req.params.id
        })
            .then(p => res.json(p))
    });


/**
 * Politics
 */
router.route('/')
    .get((req, res) => {
        Politic.find({
            status: `active`,
            country: req.query.country || req.app.get('country')
        }).sort('name')
            .then(p => res.json(p))
    });

router.route('/:id')
    .get((req, res) => {
        Politic.find({
            _id: req.params.id
        })
            .then(p => res.json(p))
    });


router.route([
    '/law/:country/:lawLocation/:type/:number',
    '/law/:country/:lawLocation/:type/:number/:year'
])
    .get(async (req, res) => {
        const law = await getLawHouse(null, query = {
            'siglaTipo': req.params.type,
            'numero': req.params.number,
            'ano': req.params.year,
            'lawLocation': req.params.lawLocation,
            'country': req.params.country,
        });
        res.json(law)
    });

module.exports = router;
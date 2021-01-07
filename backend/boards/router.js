const express = require('express');
const { Board, findBoardSlug } = require('./models');
const { findOrCreateProposition } = require('./services');
const { requireAuth } = require('../auth/jwt-auth');
const router = express.Router();
const jsonParser = express.json();
const { startTwitterBot } = require('./twitter');



router.route('/bot/start')
    .get((req, res, next) => {
        startTwitterBot('#bot');
    });

router.route('/')
    .get((req, res, next) => {
        return Board.find({
            date_deleted: { $exists: false }
        })
            .then(boards => res.json(boards))
            .catch(next)
    })
    .post(requireAuth, jsonParser, async (req, res, next) => {
        const board = {
            ...req.body,
            owner: req.user._id
        };

        if (!board.propositions) {
            board.propositions = [];
        }
        if (board.lawHouse) {
            const proposition = await findOrCreateProposition(board.lawHouse)
            console.log(proposition)
            board.propositions.push({
                proposition: proposition._id,
                type: proposition.type
            });
        }

        if (board.lawSenate) {
            const proposition = await findOrCreateProposition(board.lawSenate)
            board.propositions.push({
                proposition: proposition._id,
                type: proposition.type
            });
        }

        return Board.create(board)
            .then(board => res.json(board))
            .catch(next)
    })


router.route('/:id')
    .get((req, res, next) => {
        return Board.findOne(findBoardSlug(req.params.id))
            .populate('propositions.proposition')
            .then(boards => res.json(boards))
            .catch(next)
    })
    .patch(requireAuth, jsonParser, (req, res, next) => {
        return Board.findOneAndUpdate({
            _id: req.params.id,
            owner: req.user._id
        }, { $set: req.body })
            .then(boards => res.json(boards))
            .catch(next)
    })

module.exports = router;
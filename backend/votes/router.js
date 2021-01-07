const express = require('express');
const { Vote, Proposition } = require('./models');
const { getVotesByPropositionHouse, getVotesByVoteIdHouse } = require('../votes/services');
const { Geo } = require('../geo/models');
const { requireAuth } = require('../auth/jwt-auth');
const router = express.Router();
const jsonParser = express.json();
const mongoose = require('mongoose');

router.route('/:boardId')
    .get((req, res) => {
        const query = { board: req.params.boardId };
        if (req.query.type) {
            query.type = req.query.type;
        }
        Vote
            .find(query)
            .populate('geo')
            .then(votes => res.json(votes))
    })
    .post(requireAuth, jsonParser, async (req, res) => {
        const obj = {
            ...req.body,
            owner: req.user._id,
            board: req.params.boardId
        };

        if (obj.geo && !mongoose.Types.ObjectId.isValid(obj.geo)) {
            const geo = await Geo.findOne({ originalId: obj.geo });
            if (!geo) {
                return res.sendStatus(400)
            }
            obj.geo = geo._id;
        }
        const votes = await Vote.create(obj);
        res.json(votes);
    })

    .delete(requireAuth, (req, res) => {
        Vote.findOneAndDelete({
            board: req.params.boardId,
            owner: req.user._id
        })
            .then(votes => res.json(votes))
    })

router.route('/votation/:originalId')
    .get((req, res) => {
        const query = { originalId: req.params.originalId };
        Vote
            .find(query)
            .then(votes => res.json(votes))
    })

router.route('/update/house/proposition/:boardId/:propositionId')
    .get(async (req, res) => {
        let result = await getVotesByPropositionHouse(req.params.propositionId);
        result = result.dados.map(r => ({
            id: r.id,
            value: r.aprovacao,
            date_created: r.dataHoraRegistro,
            description: r.descricao,
            location: r.siglaOrgao
        }))
        res.json(result)
    })

router.route('/update/house/vote/:boardId/:voteId')
    .get(async (req, res) => {

        const result = await getVotesByVoteIdHouse(req.params.voteId);
        res.json(result)
    })
    .post(requireAuth, jsonParser, async (req, res) => {
        const originalId = req.params.voteId;
        const votes = req.body.votes;
        const proposition = req.body.law._id;
        const votation = req.body.votation;

        const propositionObj = await Proposition.findOne({ _id: proposition });
        const votationFound = propositionObj.votations.find(v => v.originalId == originalId);
        if (!votationFound) {
            await Proposition.findOneAndUpdate({ _id: proposition }, {
                $addToSet: {
                    votations: {
                        originalId,
                        description: votation.description,
                        date_created: votation.date_created,
                    }
                }
            });
        } else {
            res.json({
                message: 'Votation alrady imported'
            });
        }

        const newVotes = [];
        for (let i = 0; i < votes.length; i++) {
            const voteBody = votes[i];
            let vote = await Vote.findOne({
                originalId,
                politic: voteBody.politic
            })

            const newVote = {
                ...voteBody,
                status: 'accepted',
                proposition,
                originalId,
                politic: voteBody.politic
            }
            if (!vote) {
                vote = await Vote.create(newVote)
                console.log('Created')
            } else {
                vote = await Vote.findOneAndUpdate({ _id: vote._id }, {
                    $set: newVote
                })
                console.log('Updated')
            }
            newVotes.push(vote)
        }
        res.json(newVotes);
    })


router.route('/:boardId/:voteId')
    .patch(requireAuth, jsonParser, async (req, res) => {
        const { status } = req.body;

        Vote.findOneAndUpdate(
            { _id: req.params.voteId },
            {
                $set: {
                    status
                }
            }
        )
            .then(votes => res.json(votes))
    })
module.exports = router;
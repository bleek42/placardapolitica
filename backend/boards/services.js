const { Board } = require('../boards/models');
const { Proposition } = require('../votes/models');

const addPropositionToBoard = async (boardId, newProposition) => {

    const board = await Board.findOne({ _id: boardId })
    if (!board) {
        return;
    }

    let proposition = await findOrCreateProposition(newProposition, boardId);

    if (board.propositions) {
        const found = board.propositions.find(l => l.proposition == proposition._id);
        if (found) {
            return;
        }
    }
    const result = await Board.findOneAndUpdate({ _id: boardId }, {
        $addToSet: {
            propositions: {
                proposition: proposition._id,
                type: newProposition.type  // ['house', 'senate']
            }
        }
    })
    return {
        board: result,
        proposition: proposition
    }
}

const findOrCreateProposition = async (newProposition, boardId = null) =>{

    let proposition = await Proposition.findOne({
        type: newProposition.type,
        originalId: newProposition.originalId
    });
    if (!proposition) {
        newProposition.board = boardId;
        proposition = await Proposition.create(newProposition);
    }
    return proposition;

}
module.exports = {
    addPropositionToBoard,
    findOrCreateProposition
}
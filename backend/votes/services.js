const request = require('request-promise');
const { Politic } = require('../politics/models');
const { Vote } = require('../votes/models')

// DOC OFICIAL
// https://www2.camara.leg.br/transparencia/dados-abertos/dados-abertos-legislativo/webservices/proposicoes-1/proposicoes

async function getVotesByPropositionHouse(idLaw) {
    // const url = `https://dadosabertos.camara.leg.br/api/v2/proposicoes/${idProposition}/votacoes?ordem=DESC&ordenarPor=dataHoraRegistro`;
    const urlLaw = `https://dadosabertos.camara.leg.br/api/v2/votacoes?ordem=DESC&ordenarPor=dataHoraRegistro&idProposicao=${idLaw}`;
    console.log(`Getting Law: `, urlLaw);
    let votes = await request(urlLaw, {
        headers: {
            Accept: `application/json`
        }
    })
    votes = JSON.parse(votes);
    return votes;
}

async function getVotesByVoteIdHouse(votingId) {

    let url = `https://dadosabertos.camara.leg.br/api/v2/votacoes/${votingId}/votos`;
    console.log(`Getting votes: `, url);
    let data = await request(url, {
        headers: {
            Accept: `application/json`
        }
    })

    data = JSON.parse(data);
    console.log(data.dados.length)

    if (data.dados.length > 0) {
        const votes = [];
        for(let i=0;i<data.dados.length;i++){
            //data.dados.map(async vote => {
                const vote = data.dados[i];

            //             <tipoVoto>Sim</tipoVoto>
            // <dataRegistroVoto>2020-09-01T20:39:57</dataRegistroVoto>
            // <deputado_>
            // <id>62881</id>
            // <uri>https://dadosabertos.camara.leg.br/api/v2/deputados/62881</uri>
            // <nome>Danilo Forte</nome>
            // <siglaPartido>PSDB</siglaPartido>
            // <uriPartido>https://dadosabertos.camara.leg.br/api/v2/partidos/36835</uriPartido>
            // <siglaUf>CE</siglaUf>
            // <idLegislatura>56</idLegislatura>
            // <urlFoto>https://www.camara.leg.br/internet/deputado/bandep/62881.jpg</urlFoto>
            // <email>dep.daniloforte@camara.leg.br</email>
            // </deputado_>

            const newVote = {
                date_created: vote.dataRegistroVoto
            };

            if (vote.tipoVoto == 'Sim') {
                newVote.value = true;
            } else if (vote.tipoVoto == 'Não') {
                newVote.value = false;
            }

            const dep = vote.deputado_
            const politic = await Politic.findOne({ originalId: dep.id });
            if (politic) {
                newVote.politic = politic._id;
            } else {
                console.log('ERRROR', dep.nome)
            }
            votes.push(newVote) ;
        }

        return votes;
    }

}


module.exports = {
    getVotesByPropositionHouse,
    getVotesByVoteIdHouse
}

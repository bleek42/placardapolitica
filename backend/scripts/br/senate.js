const request = require('request-promise')
const fs = require('fs');
var social = require('../data/br/social.json');
var senadores = require('../data/br/senate.json');

function getSenate() {
    request(`http://legis.senado.leg.br/dadosabertos/senador/lista/atual`, {
        headers: {
            Accept: `application/json`
        }
    })
        // .then(r=>r.json())
        .then(data => {
            data = JSON.parse(data);
            // console.log(data)
            console.log(data.ListaParlamentarEmExercicio.Parlamentares.Parlamentar.length
            )

            const politics = data.ListaParlamentarEmExercicio.Parlamentares.Parlamentar.map(p => {
                p.vote = null;
                p.voteLink = null;
                p.voteDate = null;
                return p;
            })
            fs.writeFileSync('../data/br/senate.json', JSON.stringify(politics))
        })
}

/**
 * take social network
 */
function politicSocial() {
    // const partidos = JSON.parse(fs.readFileSync(path.join(__dirname,'data/partidos.json')));
    return senadores.map(s => {

        let tels = '';
        if (s.IdentificacaoParlamentar.Telefones.Telefone.forEach) {
            s.IdentificacaoParlamentar.Telefones.Telefone.forEach(t => {
                const v = t.NumeroTelefone;
                tels += tels ? ', ' + v : v;
            });
        } else if (s.IdentificacaoParlamentar.Telefones.Telefone) {
            tel = s.IdentificacaoParlamentar.Telefones.Telefone.NumeroTelefone;
        }

        const politico = {
            name: s.IdentificacaoParlamentar.NomeParlamentar,
            full_name: s.IdentificacaoParlamentar.NomeCompletoParlamentar,
            originalId: s.IdentificacaoParlamentar.CodigoParlamentar + '/' + s.IdentificacaoParlamentar.CodigoPublicoNaLegAtual + '-' + s.Mandato.CodigoMandato,
            gender: s.IdentificacaoParlamentar.SexoParlamentar,
            image: s.IdentificacaoParlamentar.UrlFotoParlamentar,
            website: s.IdentificacaoParlamentar.UrlPaginaParlamentar,
            email: s.IdentificacaoParlamentar.EmailParlamentar,
            phones: tels,
            state: s.IdentificacaoParlamentar.UfParlamentar,
            country: 'br',
            type: 'senate',
            partyName: s.IdentificacaoParlamentar.SiglaPartidoParlamentar,
            roles: (s.IdentificacaoParlamentar.MembroMesa == 'Sim' ? 'board ' : '') + (s.IdentificacaoParlamentar.MembroLideranca == 'Sim' ? 'leader ' : '')
        };


        const socialSenador = social.find(soS => soS.Nome === s.IdentificacaoParlamentar.NomeParlamentar ||
            soS.Nome === s.IdentificacaoParlamentar.NomeCompletoParlamentar)

        if (socialSenador) {
            politico.facebook = socialSenador.FB;
            politico.twitter = socialSenador.TW;
            politico.email = socialSenador.email;
            politico.phones += ', ' + socialSenador.Tel;
        }

        return politico;
    });
}

module.exports = {
    getSenate,
    politicSocial
}
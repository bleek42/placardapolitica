const request = require('request-promise')
const fs = require('fs');
// var senadores = require('../data/us/senate.json');

/**
 * https://www.senate.gov/general/contact_information/senators_cfm.xml
 */
function getSenate() {
    request(`https://api.propublica.org/congress/v1/116/senate/members.json`, {
        headers: {
            Accept: `application/json`,
            'X-API-Key': 'LoGQs7vPiZVAe4oStZA4wUSvpyTN033LoDE188Py'
        }
    })
        // .then(r=>r.json())
        .then(data => {
            console.log(data);
            data = JSON.parse(data);

            const politics = data.results[0].members.map(p => {

                return {
                    name: p.first_name,
                    full_name: p.last_name,
                    originalId: p.id,
                    gender: p.gender,
                    image: s.IdentificacaoParlamentar.UrlFotoParlamentar,
                    website: p.url,
                    email: s.IdentificacaoParlamentar.EmailParlamentar,
                    phones: p.phone + p.fax,
                    twitter: p.twitter_account,
                    facebook: p.facebook_account,
                    youtube: p.youtube_account,
                    state: p.state,
                    country: 'US',
                    type: 'senate',
                    partyName: p.party,
                    // roles: (p.leadership_role || == 'Sim' ? 'board ' : '') + (s.IdentificacaoParlamentar.MembroLideranca == 'Sim' ? 'leader ' : '')
                };
            })
            fs.writeFileSync('../data/br/senate.json', JSON.stringify(politics))
        })
}

getSenate();

module.exports = {
    getSenate,
}
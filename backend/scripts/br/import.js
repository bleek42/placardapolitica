const mongoose = require('mongoose');
const { DATABASE_URL } = require('../../config');
const { Politic, Party } = require('../../politics/models');
const { politicSocial } = require('./senate');
const { importGeo } = require('./geo');

async function main() {
    mongoose.connect(DATABASE_URL, async err => {
        if (err) {
            return callback(err);
        }
        console.log(`Connected to db at ${DATABASE_URL}`);
        await importParty()
        await importHouse()
        await importSenate()
        await importGeo()
        console.log(`Completed`);
    });
}

main();

async function importParty() {
    const partidos = require('../data/br/party.json');
    const parties = await Party.find();
    console.log('INFO', parties.length, partidos.length)
    partidos.forEach(async s => {
        const party = parties.find(p => p.originalId == s.id)
        const newParty = {
            originalId: s.id,
            name: s.nome,
            short_name: s.sigla,
            name_old: s.nome_old,
            short_name_old: s.sigla_old,
            country: 'br'
        }
        if (!party) {
            
            console.log('INSERT', newParty.name)
            return await Party.create(newParty);
        } else {
            return await Party.findOneAndUpdate({ _id: party._id },
                { $set: newParty });
        }
    });
}

async function importHouse() {
    const house = require('../data/br/house.json');
    const politics = await Politic.find();
    console.log('INFO HOUSE', house.length, politics.length)
    house.forEach(s => {
        const politic = politics.find(p => p.originalId == s.id && p.type == 'house')
        if (!politic) {
            const newPol = {
                name: s.nome,
                full_name: s.nome,
                originalId: s.id,
                idLegislature: s.idLegislatura,
                image: s.urlFoto,
                website: s.uri,
                email: s.email,
                state: s.siglaUf,
                country: 'br',
                type: 'house',
                partyName: s.siglaPartido
            }
            console.log('INSERT', newPol.name)
            createPolitic(newPol)
        }
    });
}

async function importSenate() {
    const senadores = politicSocial();
    const politics = await Politic.find();
    console.log('INFO SENATE', senadores.length, politics.length)
    senadores.forEach(s => {
        const politic = politics.find(p => p.originalId == s.originalId)
        if (!politic) {
            console.log('INSERT', s.name, s.type)
            return createPolitic(s);
        }
    });
}

async function createPolitic(newPol) {
    const party = await Party.findOne({
        $or: [
            { name: newPol.partyName.toUpperCase() },
            { short_name: newPol.partyName.toUpperCase() }
        ]
    });

    if (party) {
        newPol.party = party._id;
    } else {
        console.error(newPol.partyName.toUpperCase(), party)
    }
    return await Politic.create(newPol);
}

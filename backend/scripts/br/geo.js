const fs = require('fs');
const axios = require('axios');
var municipality = require('../data/br/municipality.json');
const { Geo } = require('../../geo/models');

function getEstados() {
    const estados = {};
    for (key in municipality) {
        const est = municipality[key].state.abbr_pt.toLowerCase();
        estados[est] = true;
    }
}

function linkToFile(url,file){
    axios.get(url)
    .then(res => {
        fs.writeFileSync(file, JSON.stringify(res.data));
    })
}

async function importGeo() {
    /**
    * GEO
    */
    const states = {}
    const geosObj = {};
    const geos = await Geo.find();
    geos.forEach(g => {
        geosObj[g.originalId] = g;
    })
    console.log('INFO GEO', geos.length, Object.keys(municipality).length)
    for (key in municipality) {
        const item = municipality[key];
        const geo = geosObj[item.id];
        states[item.state.id] = item.state;
        if (!geo) {
            const s = {
                name: item.name_pt,
                coordId: item.old_id,
                originalId: item.id,
                state: item.state.abbr_pt,
                state_name: item.state.name_pt,
                population: item.extra_info_content,
                type: 'city'
            };
            console.log('INSERT', s)
            await Geo.create(s);
        }
    }

    console.log('INFO GEO', Object.keys(states).length)
    for (key in states) {
        const item = states[key];
        const geo = geos.find(p => p.originalId == item.id);
        if (!geo) {
            const s = {
                name: item.name_pt,
                coordId: item.old_id,
                originalId: item.id,
                type: 'state'
            };
            console.log('INSERT', s)
            await Geo.create(s);
        }
    }
}

module.exports = {
    getEstados,
    linkToFile,
    importGeo
}
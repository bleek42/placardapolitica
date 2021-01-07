const request = require('request-promise')
const fs = require('fs');
var path = require('path');

var dir = path.join(__dirname, '../data/br/house.json');

function getHouse() {
    request(`https://dadosabertos.camara.leg.br/api/v2/deputados?ordem=ASC&ordenarPor=nome`, {
        headers: {
            Accept: `application/json`
        }
    })
        .then(data => {
            data = JSON.parse(data);
            fs.writeFileSync(dir, JSON.stringify(data.dados))
        })
}

module.exports = {
    getHouse
}

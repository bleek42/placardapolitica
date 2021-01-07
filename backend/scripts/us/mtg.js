// const request = require('request-promise')
// const fs = require('fs');
console.log('Initial data');
var senadores = require('/Users/mariohmol/Downloads/AllPrintings.json');

console.log('pos data');
function getSenate() {
    console.log('Initial function');
    console.log(Object.keys(senadores.data));
}

getSenate();

module.exports = {
    getSenate,
}
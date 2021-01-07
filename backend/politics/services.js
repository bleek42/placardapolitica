const request = require('request-promise');
const { Politic } = require('./models');
const { Vote } = require('../votes/models')
const { addPropositionToBoard } = require('../boards/services');


/**
 * 
 * 
    siglaTipo - array[string] Uma ou mais sigla(s) separadas por vírgulas do(s) tipo(s) das proposições que se deseja obter. A lista de tipos e siglas existentes pode ser obtida em /referencias/proposicoes/siglaTipo
    numero - array[integer] Um ou mais número(s), separados por vírgula, oficialmente atribuídos às proposições segundo o art. 137 do Regimento Interno, como “PL 1234/2016”
    ano - array[integer] Um ou mais ano(s) de apresentação das proposições que serão listadas, separados por vírgulas, no formato AAAA
    autor - string Nome ou parte do nome do(s) autor(es) das proposições que se deseja obter. Deve estar entre aspas
    siglaPartidoAutor - array[string] Uma ou mais sigla(s) separadas por vírgulas do(s) partido(s) a que pertençam os autores das proposições a serem listadas
    idPartidoAutor - integer($int64) Identificador numérico no Dados Abertos do partido a que pertençam os autores das proposições que serão listadas. Esses identificadores podem ser obtidos em /partidos e são mais precisos do que as siglas, que podem ser usadas por partidos diferentes em épocas diferentes
    siglaUfAutor - array[string] Uma ou mais sigla(s) de unidade(s) da federação (estados e Distrito Federal) pela(s) qual(quais) o(s) autor(es) das proposições selecionadas tenha(m) sido eleito(s)
    keywords - array[string] Uma ou mais palavras chaves sobre o tema a que a proposição se relaciona
    tramitacaoSenado - boolean Indicador booleano, com valor TRUE ou FALSE para trazer apenas proposições que já tenha tramitado no Senado 
    dataInicio - strin($date-time) Data do início do intervalo de tempo em que tenha havido tramitação das proposições a serem listadas, no formato AAAA-MM-DD. Se omitido, é assumido como a data de 30 dias anteriores à proposição
    dataFim - string($date-time) Data do fim do intervalo de tempo em que tenha havido tramitação das proposições a serem listadas. Se omitido, é considerado ser o dia em que é feita a requisição
    codTema - array[integer] Código(s) numérico(s), separados por vírgulas, das áreas temáticas das proposições que serão listadas. Os temas possíveis podem ser obtidos em /referencias/proposicoes/codTema
    itens - Número máximo de itens na página que se deseja obter com esta requisição.
    ordem - string O sentido da ordenação: asc para A a Z ou 0 a 9, e desc para Z a A ou 9 a 0. ASC
    ordenarPor - string Nome do campo pelo qual a lista deve ser ordenada: id, codTipo, siglaTipo, numero ou ano 
    */
async function getLawHouse(boardId, query = {}) {

    const keys = {
        'siglaTipo': true,
        'numero': true,
        'ano': true,
        'autor': true,
        'siglaPartidoAutor': true,
        'idPartidoAutor': true,
        'siglaUfAutor': true,
        'keywords': true,
        'tramitacaoSenado': true,
        'dataInicio': true,
        'dataFim': true,
        'codTema': true,
        'itens': true,
        'ordem': true,
        'ordenarPor': true
    }


    let url = `https://dadosabertos.camara.leg.br/api/v2/proposicoes?`;
    for (const key in query) {
        if (!query[key] || !keys[key]) {
            continue;
        }
        url += `&${key}=${query[key]}`;
    }

    console.log(`Readin url: `, url);
    let data = await request(url, {
        headers: {
            Accept: `application/json`
        }
    })

    data = JSON.parse(data);

    data.dados = data.dados
        .sort((a, b) => a.year > b.year ? 1 : -1)
        .map(d => ({
            link: 'https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=' + d.id,
            number: d.numero,
            year: d.ano,
            description: d.ementa,
            typeLaw: d.siglaTipo,
            originalId: d.id,
            type: query.lawLocation || 'house',
            country: query.country
        }))
    if (data.dados.length === 1) {
        const law = data.dados[0];
        if (boardId) {
            const result = addPropositionToBoard(boardId, law);
            console.log('Result getLawHouse', result);
            return result;
        } else {
            return [law]
        }
    } else {
        return data.dados;
    }
}




/**
 * 
 ano - Ano da norma	int
complemento - letra de complemento (somente para versão 3 ou posterior)	 
data formato (YYYYMMDD) - Data da assinatura da norma (somente para versão 3 ou posterior)	 
ident - letra de identificação (somente para versão 3 ou posterior)	 
numero - Número da norma	int
reedicao - número sequencial e reedição (somente para versão 3 ou posterior)	int
seq - número sequencial da assinatura da norma na data (somente para versão 3 ou posterior)	int
tipo - Sigla do tipo da norma	 
v - Versão do serviço	int

Examples
getLawSenate(`5f2b1750cc2a266276292db0`, {
    tipo: 'PL',
    ano: '2020',
    numero: '2630'
})


getLawSenate(`5f2b1750cc2a266276292db0`,{
    idMateria: '141944'
})
 */
async function getLawSenate(boardId, query = {}) {

    const { tipo, numero, ano, idMateria } = query;

    let url = `https://legis.senado.leg.br/dadosabertos/materia/legislaturaatual`;
    if (tipo && numero && ano) {
        url = `https://legis.senado.leg.br/dadosabertos/materia/${tipo}/${numero}/${ano}`;
    } else if (idMateria) {
        url = `https://legis.senado.leg.br/dadosabertos/materia/${idMateria}`;
    }

    console.log(url);
    let data = await request(url, {
        headers: {
            Accept: `application/json`
        }
    })
    data = JSON.parse(data);

    let list;
    if (data.ListaMateriasLegislaturaAtual) {
        list = data.ListaMateriasLegislaturaAtual.Materias.Materia;
        if (list && list.length > 0) {
            return list;
        }
    } else if (data.DetalheMateria) {
        const d = data.DetalheMateria.Materia;

        const law = {
            name: d.IdentificacaoMateria.DescricaoIdentificacaoMateria,
            popularName: d.Apelidos && d.Apelidos.Apelido ? d.Apelidos.Apelido.Nome : null,
            // link: d.uri,
            number: parseInt(d.IdentificacaoMateria.NumeroMateria),
            year: d.IdentificacaoMateria.AnoMateria,
            description: d.DadosBasicosMateria.EmentaMateria + d.DadosBasicosMateria.IndexacaoMateria,
            typeLaw: d.IdentificacaoMateria.SiglaSubtipoMateria,
            originalId: d.IdentificacaoMateria.CodigoMateria,
            type: 'senate'
        }
        const result = await addPropositionToBoard(boardId, law);
        const propId = result.proposition._id;
        // console.log(d)
        if (d.OutrasInformacoes && d.OutrasInformacoes.Servico && d.OutrasInformacoes.Servico.length > 0) {

            const votacao = d.OutrasInformacoes.Servico.find(o => o.NomeServico == 'VotacaoMateria')
            if (!votacao) {
                return
            }


            let data = await request(votacao.UrlServico, {
                headers: {
                    Accept: `application/json`
                }
            })
            data = JSON.parse(data);
            if (!data.VotacaoMateria || !data.VotacaoMateria.Materia) {
                return;
            }

            const dataVotes = data.VotacaoMateria.Materia.Votacoes.Votacao;
            const lastVotes = dataVotes[dataVotes.length - 1];


            const votacoes = []
            for (let i = 0; i < lastVotes.Votos.VotoParlamentar.length; i++) {
                const voto = lastVotes.Votos.VotoParlamentar[i]

                const politic = await Politic.findOne({
                    originalId: { $regex: voto.IdentificacaoParlamentar.CodigoParlamentar, $options: 'i' }
                })

                if (!politic) {
                    console.log('CANT FIND POLITIC')
                    continue;
                }

                const newVote = {
                    politic: politic._id,
                    description: voto.DescricaoVoto,
                    board: boardId,
                    type: 'senate',
                    proposition: propId
                }

                if (voto.SiglaVoto == 'Sim') {
                    newVote.value = 1;
                    newVote.answer = true;
                } else if (voto.SiglaVoto == 'Não') {
                    newVote.value = -1;
                    newVote.answer = false;
                } else {
                    newVote.value = 0;
                    newVote.answer = voto.DescricaoVoto;
                }

                const voteDb = await Vote.findOne({
                    politic: newVote.politic,
                    proposition: newVote.proposition
                });

                if (!voteDb) {
                    await Vote.create(newVote);
                    console.log('Added Vote')
                }
                votacoes.push(newVote);
            }
            return votacoes;

        }
    }
}

module.exports = {
    getLawHouse,
    getLawSenate
}

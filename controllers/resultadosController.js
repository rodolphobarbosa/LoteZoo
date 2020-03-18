const loteria = require('./data/loteria');
// const fs = require ('fs');

function orderPoste(extracoes) {
    let poste = [];
    extracoes.forEach((extracao, i) => { 
        if(extracao.poste) {
            poste.push(extracoes.splice(i, 1)[0]);
        }
    })
    return poste.concat(extracoes);
}

exports.ultimas_extracoes = async function(req, res, next) {
    let limit = 20;
    let skip = 0;
    let extracoes = await loteria.req_ultimas();
    //- order deu no poste
    // extracoes = orderPoste(extracoes);
    // pagina
    extracoes = extracoes.slice(skip, limit);
    
    res.render('extracoes', {title: ':: Últimos Resultados ::', extracoes})
}

exports.banca_sorteios = async function(req, res, next) {
    let sorteios = await loteria.req_banca(req.params.banca);
    res.render('resultados', {title: 'Resultados', banca: sorteios.banca, data: sorteios.data, sorteios: sorteios.sorteios})
}

// reqSorteio('bahia', "15/03/2020", "12:00")
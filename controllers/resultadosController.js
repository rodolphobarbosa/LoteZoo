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
    extracoes = orderPoste(extracoes);
    extracoes = extracoes.slice(skip, limit);
    //- order deu no poste
    if(!extracoes) {
        return next();
    }
    res.render('extracoes', {title: ':: Últimos Resultados ::', extracoes})
}

// reqUltimos();
// reqBanca('bahia');
// reqSorteio('bahia', "15/03/2020", "12:00")
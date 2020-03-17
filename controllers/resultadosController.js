const loteria = require('./data/loteria');
// const fs = require ('fs');

exports.ultimas_extracoes = async function(req, res, next) {
    let limit = 20;
    let skip = 0;
    let extracoes = await loteria.req_ultimas();
    extracoes = extracoes.slice(skip, limit);
    if(!extracoes) {
        return next();
    }
    res.render('extracoes', {title: ':: Últimos Resultados ::', extracoes})
}

// reqUltimos();
// reqBanca('bahia');
// reqSorteio('bahia', "15/03/2020", "12:00")
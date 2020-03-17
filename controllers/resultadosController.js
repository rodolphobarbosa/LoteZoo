const axios = require('axios').default;
// const fs = require ('fs');
const loterias = require('./data/loterias')
const RGX = loterias.rgx;
const URN = loterias.urns;
const GRUPO = loterias.grupos;

const HOST = loterias.host
const APIURN = loterias.apiUrn;

function formatUrn(uri) {
    uri = uri.split(APIURN)[1];
    uri = uri.indexOf("/") > -1 ? uri.slice(0, uri.indexOf("/")) : uri;
    return URN[uri];
}
function formatExtracao(string) {
    // clean spaces 
    string = string.trim().replace("  ", " ");
    if(RGX.extracao.test(string)) {
        return RGX.extracao.exec(string)[1];
    } else if (RGX.hora.test(string)) {
        // trim after hour
        let extracao = string.split(RGX.hora);
        return extracao.length > 1 ? extracao[0] + extracao[1] : extracao[0];
    } else {
        return string;
    }
}
function formatPremios(resultados) {
    function formatPremio(premio) {
        if (!RGX.premio.test(premio)) {return premio}
        premio = RGX.premio.exec(premio);
        return { milhar: premio[1], grupo: GRUPO[Number(premio[2])] }
    }
    if(!(Array.isArray(resultados))) {
        return formatPremio(resultados);
    }
    return resultados.map(resultado => {
        return formatPremio(resultado);
    })
}
function formatImg(string) {
    return GRUPO[Number(string.split("g")[1])].img
}

function formatLasts(sorteios) {
    return sorteios.map(sorteio => {
        return {
            banca: sorteio.banca,
            urn: formatUrn(sorteio.banca_url),
            extracao: formatExtracao(sorteio.extracao),
            data: sorteio.data,
            resultado: formatPremios(sorteio.resultado),
            img: formatImg(sorteio.img)
        }
    });
}
async function reqUltimas() {
    let res = await axios.get(HOST+APIURN);
    let extracoes = formatLasts(res.data.feed);
    return extracoes;
}

function formatBanca(sorteios){
    return sorteios.extracoes.map(extracao => {
        return {
            banca: extracao.banca,
            data: sorteios.data,
            extracao: formatExtracao(extracao.sorteio),
            resultado: formatPremios(extracao.resultados)
        }
    })
}
async function reqBanca(banca_urn, data) {
    banca_urn = data ? banca_urn+(data.split("/").join("_")) : banca_urn;
    let res = await axios.get(HOST+APIURN+URN[banca_urn]);
    let sorteios = formatBanca(res.data);
    return sorteios;
}

function formatSorteio(sorteios, extracao){
    sorteios.extracoes = sorteios.extracoes.filter((sorteio) => {
        return formatExtracao(sorteio.sorteio) === extracao;
    });
    return sorteios.extracoes.length > 0 ? {
        banca: sorteios.extracoes[0].banca,
        data: sorteios.data,
        extracao: formatExtracao(sorteios.extracoes[0].sorteio),
        resultado: formatPremios(sorteios.extracoes[0].resultados)
    } : false;
    
}
async function reqSorteio(banca_urn, data, extracao) {
    data = data.split("/").join("_");
    let res = await axios.get(HOST+APIURN+URN[banca_urn]+data);
    let sorteio = formatSorteio(res.data, extracao);
    return sorteio;
}

exports.ultimas_extracoes = async function(req, res, next) {
    let limit = 12;
    let skip = 0;
    let extracoes = await reqUltimas();
    extracoes = extracoes.slice(skip, limit);
    if(!extracoes) {
        return next();
    }
    res.render('extracoes', {title: ':: Últimos Resultados ::', extracoes})
}

// reqUltimos();
// reqBanca('bahia');
// reqSorteio('bahia', "15/03/2020", "12:00")
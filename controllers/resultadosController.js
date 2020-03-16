const axios = require('axios').default;
const fs = require ('fs');
const loterias = require('./data/loterias')
const RGX = loterias.rgx;
const URN = loterias.urns;
const GRUPO = loterias.grupos;

const HOST = loterias.host
const APIURN = loterias.apiUrn;

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
        resultados = [resultados];
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
            extracao: formatExtracao(sorteio.extracao),
            data: sorteio.data,
            resultado: formatPremios(sorteio.resultado),
            img: formatImg(sorteio.img)
        }
    });
}
async function reqUltimos() {
    let res = await axios.get(HOST+APIURN);
    let resultados = res.data.feed;
    let sorteios = formatLasts(resultados);
    console.log(sorteios);
}

function formatBanca(banca, sorteios){
    return sorteios.extracoes.map(extracao => {
        return {
            banca: banca,
            data: sorteios.data,
            extracao: formatExtracao(extracao.sorteio),
            resultado: formatPremios(extracao.resultados)
        }
    })
}
async function reqBanca(banca_urn) {
    console.log(HOST+APIURN+URN[banca_urn])
    let res = await axios.get(HOST+APIURN+URN[banca_urn]);
    let sorteios = formatBanca(banca_urn ,res.data);
    console.log(sorteios);
}

// reqUltimos();
reqBanca('bahia');
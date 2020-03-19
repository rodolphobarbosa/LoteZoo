const loteria = require('./data/loteria')
const qs = require('query-string')
// const fs = require ('fs');

async function asyncAPI(fx, fxArgs = [], cb) {
	try {
		let response = await fx.apply(null, fxArgs)
		return cb(null, response)
	} catch (e) {
		return cb(e, null)
	}
}

function orderPoste(extracoes) {
	let poste = []
	extracoes.forEach((extracao, i) => {
		if (extracao.poste) {
			poste.push(extracoes.splice(i, 1)[0])
		}
	})
	return poste.concat(extracoes)
}
function mapQueries(sorteios) {
    return sorteios.map(sorteio => {
        sorteio.uri = qs.stringify({data: sorteio.data, extracao: sorteio.extracao});
        return sorteio;
    })
}

exports.ultimas_extracoes = function(req, res, next) {
	let limit = 20
	let skip = 0
	asyncAPI(loteria.req_ultimas, null, (erro, extracoes) => {
		if (erro) {
			return next(erro)
		}
		//- order deu no poste
		// extracoes = orderPoste(extracoes);
        // paginacao
        extracoes = mapQueries(extracoes)
        console.log(extracoes);
		extracoes = extracoes.slice(skip, limit)
		res.render('extracoes', { title: ':: Últimos Resultados ::', extracoes })
	})
}

exports.banca_sorteios = function(req, res, next) {
	asyncAPI(loteria.req_banca, [req.params.banca], (erro, resultado) => {
		if (erro) {
			return next(erro)
        }
		res.render('resultados', {
			title: 'Resultados',
			banca: resultado.banca,
			data: resultado.data,
			sorteios: resultado.sorteios
		})
	})
}

exports.banca_sorteio = function(req, res, next) {
    console.log('Queries: ', req.query)
    let data = req.query.data
	let extracao = req.query.extracao
    console.log(data, extracao)
	asyncAPI(
		loteria.req_sorteio,
		[req.params.banca, data, extracao],
		(erro, sorteio) => {
			if (erro) {
				return next(erro)
            }
            console.log(JSON.parse(sorteio));
			res.json(JSON.parse(sorteio))
		}
	)
}

// reqSorteio('bahia', "15/03/2020", "12:00")

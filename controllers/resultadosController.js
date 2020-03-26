const loteria = require('./data/loteria')
const qs = require('query-string')
const moment = require('moment')
const { check, validationResult } = require('express-validator')

const dataHoje = moment().format('YYYY-MM-DD')
const dias = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom']

async function asyncAPI(fx, fxArgs = [], cb) {
	try {
		let response = await fx.apply(null, fxArgs)
		return cb(null, response)
	} catch (e) {
		console.error(e)
		return cb(e, null)
	}
}
// Filters
function orderPoste(extracoes) {
	let poste = []
	extracoes.forEach((extracao, i) => {
		if (extracao.poste) {
			poste.push(extracoes.splice(i, 1)[0])
		}
	})
	return poste.concat(extracoes)
}
// Built-in fxs
// uri para requisitar modal
function mapResultado(extracoes) {
	return extracoes.map((extracao) => {
		extracao.uri = qs.stringifyUrl({
			url: `/resultados/${extracao.urn}/sorteio`,
			query: { data: extracao.data, extracao: extracao.extracao }
		})
		return extracao
	})
}
// uri para requisitar pagina impressao
function formatImprimir(sorteio) {
	sorteio.print = qs.stringifyUrl({
		url: '/resultados/imprimir',
		query: {
			banca: sorteio.urn,
			data: sorteio.data,
			extracao: sorteio.extracao
		}
	})
	return sorteio;
}
function paginar(pagina, resultados, maxResultados = 12) {
	let maxPaginas = Math.ceil(resultados / maxResultados)
	pagina = pagina > maxPaginas ? maxPaginas : pagina
	let paginas = {}
	paginas.queries = []
	paginas.ignorar = (pagina - 1) * maxResultados
	paginas.buscar = pagina * maxResultados
	for (let p = 1; p <= maxPaginas; p++) {
		if (p == pagina) {
			paginas.queries.push(null)
			continue
		} else if (p == 1) {
			paginas.queries.push('/resultados')
			continue
		} else {
			paginas.queries.push(
				qs.stringifyUrl({ url: '/resultados', query: { pagina: p } })
			)
		}
	}
	return paginas
}

exports.ultimas_extracoes = function(req, res, next) {
	let searchMap = req.query.searchMap ? true : null
	let pagina = req.query.pagina ? req.query.pagina : 1
	asyncAPI(loteria.req_ultimas, [searchMap], (erro, extracoes) => {
		if (erro) {
			return next(erro)
		}
		// search ultimas extracoes json
		if (searchMap) {
			res.setHeader('Content-Type', 'application/json')
			res.json(extracoes)
			return
		}
		// paginacao
		paginas = paginar(pagina, extracoes.length)
		extracoes = extracoes.slice(paginas.ignorar, paginas.buscar)
		extracoes = mapResultado(extracoes)
		//- order deu no poste
		// extracoes = orderPoste(extracoes);
		res.render('extracoes', {
			title: 'LoteZoo - Resultados Hoje',
			extracoes,
			paginas: paginas.queries
		})
	})
}

exports.banca_sorteios = function(req, res, next) {
	asyncAPI(loteria.req_banca, [req.params.banca], (erro, resultado) => {
		if (erro) {
			return next(erro)
		}
		const data = moment(resultado.data, 'DD/MM/YYYY')
		// order primeiros do data
		resultado.sorteios.reverse()
		res.render('resultados', {
			title: 'Resultados',
			banca: resultado.banca,
			data: [dias[data.day()], data.format('YYYY-MM-DD'), dataHoje],
			sorteios: resultado.sorteios
		})
	})
}

exports.banca_sorteios_data = [
	// checar formato se eh mesmo data
	function(req, res, next) {
		// validar dados da requisicao
		let dataBanca = req.body.data.indexOf('/') > -1 ? moment(req.body.data, 'DD/MM/YYYY').format('DD_MM_YYYY') : moment(req.body.data, 'YYYY-MM-DD').format('DD_MM_YYYY');
		asyncAPI(
			loteria.req_banca,
			[req.params.banca, dataBanca],
			(erro, resultado) => {
				if (erro) {
					return next(erro)
				}
				const data = moment(resultado.data, 'DD/MM/YYYY')
				// order primeiros do data
				resultado.sorteios.reverse()
				res.render('resultados', {
					title: 'Resultados',
					banca: resultado.banca,
					data: [dias[data.day()], data.format('YYYY-MM-DD'), dataHoje],
					sorteios: resultado.sorteios
				})
			}
		)
	}
]

exports.banca_sorteio = function(req, res, next) {
	asyncAPI(
		loteria.req_sorteio,
		[req.params.banca, req.query.data, req.query.extracao],
		(erro, sorteio) => {
			if (erro) {
				return next(erro)
			}
			sorteio = formatImprimir(sorteio);
			res.setHeader('Content-Type', 'application/json')
			res.json(sorteio)
		}
	)
}

exports.imprimir_sorteio = function(req, res, next) {
	asyncAPI(
		loteria.req_sorteio,
		[req.query.banca, req.query.data, req.query.extracao],
		(erro, sorteio) => {
			if (erro) {
				return next(erro)
			}
			console.log(sorteio)
			res.render('imprimir', {title: `Impressão - ${sorteio.extracao}`, sorteio})
		}
	)
}

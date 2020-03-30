const loteria = require('./data/loteria')
const qs = require('query-string')
const moment = require('moment')

const dataHoje = moment().format('YYYY-MM-DD')
const dias = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab']

// lidar com erros
function localsErro408(e) {
	return {
		title: e.message,
		message: e.message,
		error: {
			status: 408,
			stack: e.stack
		}
	}
}
async function asyncAPI(fx, fxArgs = [], cb) {
	try {
		let response = await fx.apply(null, fxArgs)
		return cb(null, response)
	} catch (e) {
		return cb(e, null)
	}
}
// Filters
// order tempo real
function orderTR(extracoes) {
	return
}
// order principais bancas
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
	return sorteio
}
// paginacao
function paginar(pagina, extracoes, maxResultados = 12) {
	let maxPaginas = Math.ceil(extracoes.length / maxResultados)
	pagina = pagina > maxPaginas ? maxPaginas : pagina
	let queries = []
	let ignorar = (pagina - 1) * maxResultados
	let buscar = pagina * maxResultados
	for (let p = 1; p <= maxPaginas; p++) {
		if (p == pagina) {
			queries.push(null)
			continue
		} else if (p == 1) {
			queries.push('/resultados')
			continue
		} else {
			queries.push(
				qs.stringifyUrl({ url: '/resultados', query: { pagina: p } })
			)
		}
	}
	return { queries, extracoes: extracoes.slice(ignorar, buscar) }
}
// trata req data
function getData(data) {
	return data.indexOf('/') > -1
		? moment(data, 'DD/MM/YYYY')
		: moment(data, 'YYYY-MM-DD')
}

exports.ultimas_extracoes = function(req, res, next) {
	let pagina = req.query.pagina ? req.query.pagina : 1
	asyncAPI(loteria.req_ultimas, null, (e, extracoes) => {
		if (e) {
			if(e.code === "ECONNABORTED") {
				// renderiza pagina timedout
				e = localsErro408(e);
				res.render('error', e)
			}
			return next(e)
		}
		pagina = paginar(pagina, extracoes)
		extracoes = mapResultado(pagina.extracoes)

		// extracoes = orderPoste(extracoes);
		res.render('extracoes', {
			title: 'LoteZoo - Resultados Hoje',
			extracoes,
			paginas: pagina.queries
		})
	})
}

exports.banca_sorteios = function(req, res, next) {
	asyncAPI(loteria.req_banca, [req.params.banca], (erro, resultado) => {
		if (erro) {
			return next(erro)
		}
		// data do ultimo resultado da banca
		const dataSorteio = moment(resultado.data, 'DD/MM/YYYY')
		// order primeiros da data
		resultado.sorteios.reverse()
		res.render('resultados', {
			title: 'Resultados',
			banca: resultado.banca,
			data: [dias[dataSorteio.day()], dataSorteio.format('YYYY-MM-DD'), dataSorteio.format('DD/MM/YYYY'), dataHoje],
			sorteios: resultado.sorteios
		})
	})
}

exports.banca_sorteios_data = [
	// checar formato se eh mesmo data
	function(req, res, next) {
		// validar dados da requisicao
		const data = getData(req.body.data)
		asyncAPI(
			loteria.req_banca,
			[req.params.banca, data.format('DD_MM_YYYY')],
			(erro, resultado) => {
				if (erro) {
					return next(erro)
				}
				// order
				resultado.sorteios.reverse()
				res.render('resultados', {
					title: 'Resultados',
					banca: resultado.banca,
					data: [dias[data.day()], data.format('YYYY-MM-DD'), data.format('DD/MM/YYYY'), dataHoje],
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
			sorteio = formatImprimir(sorteio)
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
			res.render('imprimir', {
				title: `Impressão - ${sorteio.extracao}`,
				sorteio
			})
		}
	)
}

exports.procurar_dados = function(req, res, next) {
	asyncAPI(loteria.req_dados_search, null, (erro, dados) => {
		if (erro) {
			return next(erro)
		}
		res.setHeader('Content-Type', 'application/json')
		res.json(dados)
		return
	})
}

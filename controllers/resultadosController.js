const createError = require('http-errors')
const debug = require('debug')('lotezoo:axios')
const loteria = require('./data/loteria')
const qs = require('query-string')
const moment = require('moment-timezone')
const path = require('path')
const fs = require('fs')
const bahiaTz = 'America/Bahia'
const { check, validationResult } = require('express-validator')

const dataHoje = moment().tz(bahiaTz).format('YYYY-MM-DD')
const dias = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab']

var EXTRACOES_PAGINADAS

async function asyncAPI(fx, fxArgs = [], cb) {
	try {
		let response = await fx.apply(null, fxArgs)
		return cb(null, response)
	} catch (e) {
		debug('Axios erro requisicao get a api:' + e)
		return cb(e, null)
	}
}
// Filters

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
function getPathes(url) {
	// evita primeira barra e demais
	return url.split('/').slice(1)
}
function mapBreadcrumbs(url, type = false, token = '') {
	let breads = getPathes(url)
	const bancas = {
		// bancas
		federal: 'Federal',
		l_br: 'L-BR',
		lotep_pb: 'Lotep (PB)',
		rio_grande_do_sul: 'Rio Grande do Sul',
		sao_paulo: 'São Paulo',
		lotece: 'Lotece',
		look_go: 'Look (GO)',
		bahia: 'Bahia',
		bahia_maluca: 'Bahia - Maluca',
		popular_recife: 'Popular Recife',
		loteria_nacional: 'Loteria Nacional',
		minas_gerais: 'Minas Gerais',
		rio_de_janeiro: 'Rio de Janeiro',
	}
	var bcRefs = {
		resultados: 'Últimos Resultados',
	}
	breads = breads.map((bc) => {
		let titulo = bc in bancas ? bancas[bc] : bcRefs[bc]
		// banca em data post
		return { path: '/' + bc, titulo: titulo }
	})
	if (type) {
		switch (type) {
			case 'date':
				// adiciona ultimo path da banca data
				breads.push({
					path: breads[breads.length - 1].path,
					titulo: 'Data ' + token,
				})
				break
			default:
				// page
				breads.push({
					path: breads[breads.length - 1].path,
					titulo: 'Página ' + token,
				})
				break
		}
	}
	return { breads, type }
}
function mapCloud(extracoes) {
	return extracoes.map(e => {return{banca: e.banca, poste: e.poste}}).reduce((es, e) => {
		let flag = false
		for(let i = 0; i < es.length; i++) {
			if (es[i][0] === e.banca) {
				es[i][1] += 1
				if(e.poste) es[i][2] = true;
				flag = true
				break
			}
		}
		if(!flag) es.push(e.poste?[e.banca, 1, true]: [e.banca, 1])
		return es
	}, [])
}
// uri para requisitar modal
function mapResultado(extracoes) {
	return extracoes.map((extracao) => {
		extracao.uri = qs.stringifyUrl({
			url: `/resultados/${extracao.urn}/sorteio`,
			query: { data: extracao.data, extracao: extracao.extracao },
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
			extracao: sorteio.extracao,
		},
	})
	return sorteio
}
// paginacao
function mapPaginas(extracoes, maxResultados = 12) {
	let limitePaginas = Math.ceil(extracoes.length / maxResultados)
	let queries = ['/resultados']
	if (limitePaginas > 1) {
		for (let p = 2; p <= limitePaginas; p++) {
			queries.push(
				qs.stringifyUrl({ url: '/resultados', query: { pagina: p } })
			)
		}
	}
	return { queries, extracoes, max: maxResultados, limite: limitePaginas }
}
function paginar(map, pagina) {
	let queries = [...map.queries]
	pagina = pagina > map.limite ? map.limite : pagina
	queries[pagina - 1] = null
	return {
		queries,
		extracoes: map.extracoes.slice((pagina - 1) * map.max, pagina * map.max),
	}
}

exports.ultimas_extracoes = function (req, res, next) {
	// cache extracoes
	let extracoes = loteria.req_ultimas()
	if (extracoes === null) {
		res.setHeader('Retry-After', '60')
		return next(createError(503, 'Indisponível, tente novamente em instantes'))
	} else if (extracoes.length) {
		// cache var
		EXTRACOES_PAGINADAS = mapPaginas(extracoes)
		// cache local
		fs.writeFileSync(path.join(__dirname, 'extracoes_paginadas.json'), JSON.stringify(EXTRACOES_PAGINADAS, null, 2), 'utf8')
	}
	// formatacao breadcrumbs
	let pagina = req.query.pagina ? req.query.pagina : 1
	let bcs = qs.parseUrl(req.originalUrl)
	if (!(pagina > 1)) {
		bcs = mapBreadcrumbs(bcs.url)
	} else {
		bcs = mapBreadcrumbs(bcs.url, 'page', bcs.query.pagina)
	}
	// extracoes por pagina
	pagina = paginar(EXTRACOES_PAGINADAS || JSON.parse(fs.readFileSync(path.join(__dirname, 'extracoes_paginadas.json'), 'utf8')), pagina)
	pagina.cloud = mapCloud(pagina.extracoes)
	pagina.extracoes = mapResultado(pagina.extracoes)
	res.render('extracoes', {
		title: 'LoteZoo - Resultados Hoje',
		extracoes: pagina.extracoes,
		cloud: pagina.cloud,
		bcs,
		paginas: pagina.queries,
	})
}

exports.banca_sorteios = function (req, res, next) {
	asyncAPI(loteria.req_banca, [req.params.banca], (erro, resultado) => {
		if (erro) {
			if (erro.code === 'ECONNABORTED') {
				next(createError(408, 'Conexão lenta, verifique sua internet'))
			}
			return next(erro)
		}

		// data do ultimo resultado da banca
		let dataSorteio = moment(resultado.data, 'DD/MM/YYYY')
		let sorteioIso = dataSorteio.format('YYYY-MM-DD')
		let shortData = dataHoje != sorteioIso ? dataSorteio.format('DD/MM') : null
		// breadcrumbs path
		let bcs
		if (shortData) {
			bcs = mapBreadcrumbs(req.originalUrl, 'date', shortData)
		} else {
			bcs = mapBreadcrumbs(req.originalUrl)
		}
		// order primeiros da data
		resultado.sorteios.reverse()
		res.render('resultados', {
			title: `${resultado.banca} - ${shortData ? shortData : 'Hoje'}`,
			banca: resultado.banca,
			data: [dias[dataSorteio.day()], sorteioIso, resultado.data, dataHoje],
			sorteios: resultado.sorteios,
			bcs,
			formUri: req.originalUrl,
		})
	})
}

exports.banca_sorteios_data = [
	// checar formato se e mesmo padrao data e valida
	check('data').isISO8601({ strict: true }),

	function (req, res, next) {
		// validar data do body
		const erros = validationResult(req)
		if (!erros.isEmpty()) {
			return res.status(422).json(erros)
		}

		const dataSorteio = moment(req.body.data)
		asyncAPI(
			loteria.req_banca,
			[req.params.banca, dataSorteio.format('DD_MM_YYYY')],
			(erro, resultado) => {
				if (erro) {
					if (e.code === 'ECONNABORTED') {
						next(createError(408, 'Conexão lenta, por favor verifique sua conexão'))
					}
					return next(erro)
				}
				let shortData =
					dataHoje != req.body.data ? dataSorteio.format('DD/MM') : null
				let bcs
				if (shortData) {
					bcs = mapBreadcrumbs(req.originalUrl, 'date', shortData)
				} else {
					bcs = mapBreadcrumbs(req.originalUrl)
				}
				// order
				resultado.sorteios.reverse()
				res.render('resultados', {
					title: `${resultado.banca} - ${shortData ? shortData : 'Hoje'}`,
					banca: resultado.banca,
					data: [
						dias[dataSorteio.day()],
						req.body.data,
						dataSorteio.format('DD/MM/YYYY'),
						dataHoje,
					],
					sorteios: resultado.sorteios,
					bcs,
					formUri: req.originalUrl,
				})
			}
		)
	},
]

exports.banca_sorteio = function (req, res, next) {
	asyncAPI(
		loteria.req_sorteio,
		[req.params.banca, req.query.data, req.query.extracao],
		(erro, sorteio) => {
			if (erro) {
				return next(erro)
			}
			// sorteio = formatImprimir(sorteio)
			res.setHeader('Content-Type', 'application/json')
			res.json(sorteio)
		}
	)
}

exports.imprimir_sorteio = function (req, res, next) {
	asyncAPI(
		loteria.req_sorteio,
		[req.query.banca, req.query.data, req.query.extracao],
		(erro, sorteio) => {
			if (erro) {
				return next(erro)
			}
			res.render('imprimir', {
				title: `Impressão - ${sorteio.extracao}`,
				sorteio,
			})
		}
	)
}

exports.procurar_dados = function (req, res, next) {
	asyncAPI(loteria.req_dados_search, null, (erro, dados) => {
		if (erro) {
			return next(erro)
		}
		res.setHeader('Content-Type', 'application/json')
		res.json(dados)
		return
	})
}

require('dotenv').config()
const axios = require('axios').default
const cron = require('node-cron')
const extenso = require('extenso')
const loterias = require('./loterias')
const moment = require('moment')
const fs = require('fs')
const path = require('path')
const RGX = loterias.rgx
const URN = loterias.urns
const API = loterias.urns.api
const GRUPO = loterias.grupos
const LOT = loterias.loterias

const HOST = process.env.API_HOST
const APIURN = process.env.API_URN

// cache feed
var FEED = []
var EXTRACOES = null
// spoof
const USER_AGENTS = [
	// Samsung Galaxy S9
	'Mozilla/5.0 (Linux; Android 8.0.0; SM-G960F Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.84 Mobile Safari/537.36',
	// Samsung Galaxy S8
	'Mozilla/5.0 (Linux; Android 7.0; SM-G892A Build/NRD90M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/60.0.3112.107 Mobile Safari/537.36',
	// Samsung Galaxy S7
	'Mozilla/5.0 (Linux; Android 7.0; SM-G930VC Build/NRD90M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/58.0.3029.83 Mobile Safari/537.36',
	// Samsung Galaxy S7 Edge
	'Mozilla/5.0 (Linux; Android 6.0.1; SM-G935S Build/MMB29K; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/55.0.2883.91 Mobile Safari/537.36',
	// Samsung Galaxy S6
	'Mozilla/5.0 (Linux; Android 6.0.1; SM-G920V Build/MMB29K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.98 Mobile Safari/537.36',
	// Samsung Galaxy S6 Edge Plus
	'Mozilla/5.0 (Linux; Android 5.1.1; SM-G928X Build/LMY47X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.83 Mobile Safari/537.36',
	// Nexus 6P
	'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 6P Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.83 Mobile Safari/537.36',
	// Sony Xperia XZ
	'Mozilla/5.0 (Linux; Android 7.1.1; G8231 Build/41.2.A.0.219; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/59.0.3071.125 Mobile Safari/537.36',
	// Sony Xperia Z5
	'Mozilla/5.0 (Linux; Android 6.0.1; E6653 Build/32.2.A.0.253) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.98 Mobile Safari/537.36',
	// HTC One X10
	'Mozilla/5.0 (Linux; Android 6.0; HTC One X10 Build/MRA58K; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/61.0.3163.98 Mobile Safari/537.36',
	// HTC One M9
	'Mozilla/5.0 (Linux; Android 6.0; HTC One M9 Build/MRA58K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.98 Mobile Safari/537.3',
]
function getRandomUA() {
	return USER_AGENTS[Math.floor(Math.random() * (USER_AGENTS.length - 0))]
}
axios.defaults.headers.common['User-Agent'] = getRandomUA()
axios.defaults.timeout = 10000
axios.defaults.timeoutErrorMessage = 'Tempo de espera esgotado'

function cacheExtracoes(Extracoes) {
	// cache env
	FEED = Extracoes
	EXTRACOES = formatUltimas(Extracoes)
	// cache local
	fs.writeFileSync(path.join(__dirname, 'feed.json'), JSON.stringify(FEED, null, 2), 'utf8')
	fs.writeFileSync(path.join(__dirname, 'extracoes.json'), JSON.stringify(EXTRACOES, null, 2), 'utf8')
}
function atualizaExtracoes(Extracoes) {
	if (Extracoes.length) {
		if (Extracoes.length != FEED.length) {
			cacheExtracoes(Extracoes)
			return true
		} else {
			// compara ultimo sorteio de ambos
			for (let p in Extracoes[0]) {
				if (Extracoes[p] != FEED[0][p]) {
					cacheExtracoes(Extracoes)
					return true
				}
			}
		}
	}
	return false
}
const task = cron.schedule('* * * * *', async () => {
	let res
	try {
		res = await axios.get(HOST + APIURN)
	} catch (e) {
		console.log(`Axios ${e.config.method} error, ${e.config.url} ${e.code}`)
		task.destroy()
		return console.log('TASKER STOPPED')
	}
	if (!EXTRACOES) {
		cacheExtracoes(res.data.feed)
		console.log('Cached: ', res.data.data)
	} else {
		if (atualizaExtracoes(res.data.feed)) console.log('Updated: ', res.data.data)
	}
})
console.log('TASKER STARTED', axios.defaults.headers.common['User-Agent'])

function formatUrn(uri) {
	// banca_url: 'api/v3/feed/malucabahia/12_02_2020'
	uri = uri.split(APIURN)[1]
	// malucabahia/12_02_2020
	uri = uri.split('/')[0]
	// malucabahia
	return URN[uri]
	// bahia_maluca
}
function formatExtracao(string) {
	// Extração das 19:00
	// PT  14:20
	// PTN 18:20 hrs
	// Bandeirante
	let upper = /[A-Z]{2,}/.exec(string)
	let hora = /\d{2}:\d{2}/.exec(string)
	if ((upper && !upper[0].startsWith('L')) && hora) {
		return [upper[0], hora[0]].join(' ')
	} else if (hora) {
		return hora[0]
	} else {
		return string
	}
	// 19:00
	// PT 14:20
	// PTN 18:20
	// Bandeirante
}
function deuNoPoste(extracao) {
	// Corujao
	extracao = extracao.toUpperCase()
	if (
		extracao.startsWith('PT') ||
		extracao.startsWith('COR') ||
		extracao.startsWith('FED')
	) {
		// true
		return true
	}
	return false
}
function getGrupoNome(resultado) {
	// 2032 (08)
	let num = Number(RGX.grupo.exec(resultado)[1])
	// 8
	return GRUPO[num].nome
	// Camelo
}
function formatPremios(resultados) {
	function formatPremio(premio) {
		premio = RGX.premio.exec(premio)
		return { milhar: premio[1], grupo: GRUPO[Number(premio[2])] }
	}
	if (!Array.isArray(resultados)) {
		return formatPremio(resultados)
	}
	return resultados.map((premio) => {
		return formatPremio(premio)
	})
}
function formatID(string) {
	// 19:00
	// PT 22:00
	// PTN 18:20
	// Bandeirante
	// Minas Dia
	let hora = /\d{2}:\d{2}/.exec(string)
	hora = hora ? extenso(hora[0].split(':')[0], { number: { gender: 'f' } }) : ''
	// vinte duas
	let txt = string.replace(/\s/g, '')
	txt = /[A-Z]*/gi.exec(txt)
	txt = txt ? txt[0] : ''
	// pt
	string = (txt + hora).replace(/\s/g, '')
	// ptvinteduas
	return string
}
function formatUltimas(sorteios) {
	return sorteios.map((sorteio) => {
		sorteio = {
			banca: LOT.api[sorteio.banca] || sorteio.banca,
			urn: formatUrn(sorteio.banca_url),
			extracao: formatExtracao(sorteio.extracao),
			data: sorteio.data,
			resultado: formatPremios(sorteio.resultado),
		}
		sorteio.poste = deuNoPoste(sorteio.extracao)
		return sorteio
	})
}
exports.req_ultimas = () => {
	let local = null
	try {
		local = JSON.parse(fs.readFileSync(path.join(__dirname, 'extracoes.json'), 'utf8'))
	} catch (error) {
		console.log('no local file, server waiting for response')
	}
	return EXTRACOES || local
}
function formatBanca(obj, sorteios) {
	obj.sorteios = sorteios.extracoes.map((extracao) => {
		let sorteio = {
			extracao: formatExtracao(extracao.sorteio),
			resultado: formatPremios(extracao.resultados),
		}
		sorteio.poste = deuNoPoste(sorteio.extracao)
		sorteio.ID = formatID(sorteio.extracao)
		return sorteio
	})
	return obj
}
exports.req_banca = async function (banca_urn, data) {
	let res, uri = API[banca_urn] + (data ? '/' + data : '')
	try {
		res = await axios.get(HOST + APIURN + uri)
	} catch (e) {
		console.log(`Axios ${e.config.method} error, ${e.config.url} ${e.code}`)
		throw new Error('Banca não registrada.')
	}
	let banca = { banca: LOT[banca_urn], data: res.data.data }
	banca = formatBanca(banca, res.data)
	return banca
}

function formatSorteio(sorteios, extracao) {
	sorteios.extracoes = sorteios.extracoes.filter((e) => {
		return formatExtracao(e.sorteio) === extracao
	})
	if (!sorteios.extracoes.length) {
		throw new Error('Extração não encontrada.')
	}
	let sorteio = {
		banca: LOT.api[sorteios.extracoes[0].banca] || sorteios.extracoes[0].banca,
		urn: sorteios.urn,
		data: sorteios.data,
		extracao: formatExtracao(sorteios.extracoes[0].sorteio),
		resultado: formatPremios(sorteios.extracoes[0].resultados),
	}
	sorteio.poste = deuNoPoste(sorteio.extracao)
	return sorteio
}
exports.req_sorteio = async function (banca_urn, data, extracao) {
	let res, uri = `${API[banca_urn]}/${data.split('/').join('_')}`
	try {
		res = await axios.get(HOST + APIURN + uri)
	} catch (e) {
		console.log(`Axios ${e.config.method} error, ${e.config.url} ${e.code}`)
		throw new Error('Resultado indiponível.')
	}
	res.data.urn = banca_urn
	let sorteio = formatSorteio(res.data, extracao)
	return sorteio
}

function formatSearch(sorteios) {
	return sorteios.map((sorteio) => {
		sorteio = {
			banca: LOT.api[sorteio.banca] || sorteio.banca,
			uri: formatUrn(sorteio.banca_url),
			extracao: formatExtracao(sorteio.extracao),
			grupo: getGrupoNome(sorteio.resultado),
			data: [
				sorteio.data,
				moment(sorteio.data, 'DD/MM/YYYY').format('YYYY-MM-DD'),
			],
		}
		sorteio.uri = `/resultados/${sorteio.uri}#${formatID(sorteio.extracao)}`
		return sorteio
	})
}
exports.dados_grupos = function () {
	let grupos = []
	for (let i in GRUPO) {
		grupos.push({
			num: GRUPO[i].num,
			nome: GRUPO[i].nome,
			dez: GRUPO[i].dezenas,
			svg: GRUPO[i].svg,
		})
	}
	return grupos
}
function getGrupos() {
	let grupos = []
	for (let i in GRUPO) {
		grupos.push({
			num: GRUPO[i].num,
			nome: GRUPO[i].nome,
			dez: GRUPO[i].dezenas,
		})
	}
	return grupos
}
function getLoterias() {
	let bancas = []
	for (let urn in LOT) {
		bancas.push({
			loteria: LOT[urn],
			urn,
			uri: '/resultados/' + urn,
		})
	}
	return bancas
}
exports.req_dados_search = async function () {
	let extracoes = formatSearch(FEED.length ? FEED : JSON.parse(fs.readFileSync(path.join(__dirname, 'feed.json'), 'utf8')))
	let bancas = getLoterias()
	let grupos = getGrupos()
	return extracoes.concat(bancas, grupos)
}

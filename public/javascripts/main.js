var ultima_procura = []
var ultimos_dados
const search = $('#procurar')
const searchData = $('#procurar-data')
const searchInput = $('#procurar-campo')
const searchMenu = $('#procurar-menu')
const topNav = $('#topNav')
const max_resultados = 5
const searchUri = '/resultados/procurar'
const backTop = $('.BACKTOP')
const TOP = $('#TOP').offset().top

const searchTypes = {
	// match keys
	banca: ['loteria'],
	extracao: ['banca', 'extracao', 'grupo', 'data'],
	grupo: ['num', 'nome']
}
const searchMethods = {
	banca: 'get',
	extracao: 'post'
}
function formatSearchType(item, match) {
	let type
	for (let search in searchTypes) {
		for (let t of searchTypes[search]) {
			if (t in item) {
				type = search
				break
			}
		}
		if (type) {
			break
		}
	}
	// constroi search item on fly
	let menuItem = $(`<div class='dropdown-item PROCURAR__ITEM'></div>`)
	// formata titulo e addons
	switch (type) {
		case 'banca':
			if (match) {
				menuItem.attr('data-content', '/' + item['urn'])
				delete item['urn']
				menuItem
					.addClass('PROCURAR__ITEM--BANCA')
					.addClass('PROCURAR__ITEM--MATCH')
				menuItem.text(match.value)
				delete item[match.key]
			} else {
				menuItem.text(item['loteria'])
				delete item['loteria']
				delete item['urn']
			}
			break
		case 'grupo':
			if (match) {
				menuItem.attr('data-content', '(' + item['num'] + ')')
				delete item['num']
				menuItem
					.addClass('PROCURAR__ITEM--GRUPO')
					.addClass('PROCURAR__ITEM--MATCH')
				menuItem.text(match.value)
				delete item[match.key]
			} else {
				menuItem.text(item['nome'])
				delete item['nome']
				delete item['num']
			}
			break
		default:
			// extracao
			menuItem.attr('data-content', item['data'][0])
			menuItem.attr('data-iso', item['data'][1])
			delete item['data']
			if (match) {
				menuItem
					.addClass('PROCURAR__ITEM--EXTRACAO')
					.addClass('PROCURAR__ITEM--MATCH')
				menuItem.text(match.value)
				delete item[match.key]
			} else {
				menuItem.text(item['extracao'])
				delete item['extracao']
				delete item['data']
			}
			break
	}
	if (item.hasOwnProperty('uri')) {
		menuItem.attr('data-uri', item['uri'])
		menuItem.attr('data-method', searchMethods[type])
		delete item['uri']
	}
	// adiciona search infos
	if (Object.keys(item).length) {
		let itemInfo = $(`<div class='ITEM__INFO text-wrap text-break'></div>`)
		for (let key in item) {
			// formata info
			switch (key) {
				case 'dez':
					item[key] = item[key].join(' - ')
					break
				case 'extracao':
					item[key] = `[${item[key]}]`
					break
				default:
					item[key] = `(${item[key]})`
					break
			}
			itemInfo.append(`<span class='INFO__EL'>${item[key]}</span>`)
		}
		menuItem.append(itemInfo)
	}

	// binda click item com uri
	if (menuItem.data('uri')) {
		menuItem.on('click', function (ev) {
			let metodo = $(this).data('method')
			if (metodo === 'get') {
				window.location.href = $(this).data('uri')
			} else {
				searchData.attr('name', 'data').attr('value', $(this).data('iso'))
				search.attr('action', $(this).data('uri')).attr('method', metodo)
				search.submit()
			}
		})
	}
	return menuItem
}
function atualizaMenu(resultados) {
	searchMenu.empty()
	resultados.forEach((res) => {
		// boolean match
		let match = res.matches[0]
		let item = {}
		// instance obj item
		Object.assign(item, res.item)
		item = formatSearchType(item, match)

		searchMenu.append(item)
	})
	searchMenu.show()
}
function checkMatches(nova = [], ultima = []) {
	// se tem o msm num de matches
	if (nova.length !== ultima.length) {
		return false
	}
	// checa matches de ambos
	for (let i = 0; i < nova.length; i++) {
		if (nova[i].refIndex !== ultima[i].refIndex) {
			return false
		}
	}
	return true
}
function bindFuse(dados) {
	let options = {
		shouldSort: true,
		includeMatches: true,
		threshold: 0.4,
		location: 0,
		distance: 30,
		minMatchCharLength: 1,
		keys: [
			// banca
			{ name: 'loteria', weight: 0.9 },
			// grupo
			{ name: 'num', weight: 0.7 },
			{ name: 'nome', weight: 0.5 },
			// extracao
			{ name: 'banca', weight: 0.7 },
			{ name: 'extracao', weight: 0.8 },
			{ name: 'grupo', weight: 0.6 },
			{ name: 'data', weight: 0.4 }
		]
	}
	// inicializa fuse
	fuse = new Fuse(dados, options)
	// binda fuse ao change do search
	searchInput.bind('keydown', fuse, function (event) {
		let encontrado = fuse.search($(this).val())
		// checa se tem novos resultados
		encontrado = encontrado.slice(0, max_resultados)
		if (!checkMatches(encontrado, ultima_procura)) {
			// atualiza matches
			ultima_procura = encontrado
			if (encontrado.length == 0) {
				// se o novo resultado for 0 ent fecha opcoes
				fecharMenu()
				return
			}

			atualizaMenu(encontrado)
			return
		}
	})
}
function fecharMenu() {
	searchMenu.hide()
}
function retry() {
	searchInput.removeClass('unsearchable')
}
$(function () {
	// ativa tooltips para grupos
	$('[data-toggle="tooltip"]').tooltip()

	searchInput.focus(function (ev) {
		// checa se ja foi buscado os dados se não busca e binda search engine
		if (!ultimos_dados) {
			$.get({
				url: searchUri,
				dataType: 'json',
				success: function (dados) {
					bindFuse(dados)
					searchInput.addClass('searchable')
					// ja pode procurar
					ultimos_dados = dados
				}
			}).fail(function () {
				searchInput.addClass('unsearchable')
				searchInput.blur(() => {
					retry()
				})
			})
		} else if ($('.procurar-item').length) {
			searchMenu.show()
		}
		searchMenu.focusin()
	})
	// fechar search dropdown
	$(document).on('click', function (e) {
		if (searchMenu.is(':visible')) fecharMenu()
	})

	$(document).on('keydown', search, function (ev) {
		return ev.key !== 'Enter'
	})
	backTop.on('click', function(ev) {
		ev.stopImmediatePropagation()
		ev.preventDefault()
		$('body, html').animate({ scrollTop: TOP }, 600);
	})
})

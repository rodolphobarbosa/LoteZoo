var ultima_procura = []
var ultimos_dados
const search = $('#procurar')
const searchData = $('#procurar-data')
const searchInput = $('#procurar-campo')
const searchMenu = $('#procurar-menu')
const topNav = $('#topNav')
const max_resultados = 5
const searchUri = '/resultados/procurar'

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
		threshold: 0.5,
		location: 0,
		distance: 30,
		minMatchCharLength: 2,
		keys: [
			{ name: 'banca', weight: 0.7 },
			{ name: 'extracao', weight: 0.5 },
			{ name: 'data', weight: 0.3 },
			{ name: 'grupo', weight: 0.6 }
		]
	}
	// inicializa fuse
	fuse = new Fuse(dados, options)
	// binda fuse ao change do search
	searchInput.bind('keydown', fuse, function(event) {
		let encontrado = fuse.search($(this).val())
		// checa se tem novos resultados
		if (!checkMatches(encontrado, ultima_procura)) {
			// atualiza matches
			ultima_procura = encontrado
			if (encontrado.length == 0) {
				// se o novo resultado for 0 ent fecha opcoes
				fecharMenu()
				return
			}
			encontrado = encontrado.slice(0, max_resultados)
			atualizaMenu(encontrado)
			return
		}
	})
}
function atualizaMenu(resultados) {
	searchMenu.empty()
	resultados.forEach((res) => {
		let match = res.matches[0]
		let resItem = res.item
		let ref = {}
		let item = $(
			`<div class='dropdown-item procurar-item item-extracao text-info overflow-hidden'></div>`
		)
		if (match) {
			for (let prop in resItem) {
				if (prop == match.key) {
					item.text(match.value)
					continue
				}
				ref[prop] = resItem[prop]
			}
		} else {
			Object.assign(ref, resItem)
		}
		let itemInfo = $(
			`<div class='text-wrap text-break text-dark busca-info'></div>`
		)
		item.attr('data-content', ref['data'])
		item.attr('data-uri', ref['uri'])
		delete ref['data']
		delete ref['uri']
		for (let key in ref) {
			itemInfo.append(`<span class='busca-el'>${ref[key]}</span>`)
		}
		item.append(itemInfo)
		item.on('click touchend', function(ev) {
			searchData.attr('value', $(this).data('content'))
			search.attr('action', $(this).data('uri'))
			search.submit()
		})
		searchMenu.append(item)
	})
	searchMenu.show()
}
function fecharMenu(blur = false) {
	searchMenu.hide()
	if (blur) {
		searchInput.removeClass('unsearchable')
	}
}
$(function() {
	searchInput.focus(function(ev) {
		// checa se ja foi buscado os dados se não busca e binda search engine
		if (!ultimos_dados) {
			$.get({
				url: searchUri,
				dataType: 'json',
				success: function(dados) {
					bindFuse(dados)
					searchInput.addClass('searchable')
					// ja pode procurar
					ultimos_dados = dados
				}
			}).fail(function() {
				searchInput.addClass('unsearchable')
			})
		} else if($('.procurar-item').length) {
			searchMenu.show();
		}
		searchMenu.focusin()
	})
	// fechar search dropdown
	$(document).on('click touchend', function(e) {
		if (searchMenu.is(':visible')) fecharMenu(true)
	})

	$(document).on('keydown', search, function(ev) {
		return ev.key !== "Enter";
	})
})

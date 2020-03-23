var ultima_procura = []
var ultimos_dados
const search = $('#procurar')
const searchMenu = $('#procurar-menu')
const topNav = $('#topNav')
const max_resultados = 6
const queryUri = search.data('query')

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
		threshold: 0.3,
		location: 1,
		distance: 100,
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
	search.bind('keydown', fuse, function(event) {
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
			encontrado = encontrado.slice(0, max_resultados);
			console.log(encontrado);
            atualizaMenu(encontrado);
			return
		}
	})
}
function formatResultados(resultados) {

}
function atualizaMenu(resultados) {
    searchMenu.empty();
	resultados.forEach((res) => {
		let match = res.matches[0];
		let resItem = res.item;
		let ref = {};
		let item = $(`<div class='dropdown-item procurar-item item-extracao text-info'></div>`)
		let itemAnchor = $(`<a class='stretched-link text-decoration-none text-wrap text-break text-dark busca-info' href=${resItem['uri']}></a>`)
		delete resItem['uri'];
		if(match) {
			for(let prop in resItem) {
				if(prop == match.key) {
					item.text(match.value);
					continue
				}
				ref[prop] = resItem[prop];
			}
		} else {
			Object.assign(ref, resItem);
		}
		for(let key in ref) {
			itemAnchor.append(ref[key]+' ');
		}
		item.append(itemAnchor);
		searchMenu.append(item);
    })
	searchMenu.show();
}
function fecharMenu(blur = false) {
	searchMenu.hide();
    if (blur) {
        search.removeClass('unsearchable');
    }
}
$(function() {
	search.focus(function(ev) {
		// checa se ja foi buscado os dados se não busca e binda search engine
		if (!ultimos_dados) {
			$.ajax({
				url: queryUri,
				dataType: 'json',
				success: function(dados) {
					bindFuse(dados)
					search.addClass('searchable')
					// ja pode procurar
					ultimos_dados = dados
				},
				error: function() {
					search.addClass('unsearchable')
				}
			})
		} else {
			searchMenu.show();
		}
	})
	topNav.focusout(function(ev) {
		fecharMenu(true)
	})
})

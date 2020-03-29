const print = $('#PRINT')
const pagina = $('.PAGINA')
const tabs = $('.TABELA')
const url = $('#URL')

const formatTabs = {
	borda: function(opcao) {
		switch (opcao) {
			case 'sem':
				tabs.removeClass('table-bordered').addClass('table-borderless')
				break
			case 'total':
				tabs.removeClass('table-borderless').addClass('table-bordered')
				break
			default:
				tabs.removeClass('table-bordered').removeClass('table-borderless')
				break
		}
	},
	fonte: function(opcao) {
		switch (opcao) {
			case 'peq':
				tabs.css('font-size', '0.8em')
				break
			case 'grande':
				tabs.css('font-size', '1.2em')
				break
			case 'gigante':
				tabs.css('font-size', '1.5em')
				break
			default:
				tabs.css('font-size', '1em')
				break
		}
	},
	coluna: function(opcao) {
		switch (opcao) {
			case 'peq':
				tabs.addClass('table-sm')
				break
			default:
				tabs.removeClass('table-sm')
				break
		}
	},
	posicao: function(opcao) {
		switch (opcao) {
			case 'topo':
				pagina.find('.PAGINA__CONTEUDO').removeClass('PAGINA__CONTEUDO--MID')
                let topOff = pagina.find('.PAGINA__CABECALHO').outerHeight()
                // % impressao
                topOff = (topOff*1.4)
                pagina
					.find('.PAGINA__CONTEUDO')
					.css('bottom', 'auto')
					.css('top', topOff)
				break
			case 'fim':
				pagina.find('.PAGINA__CONTEUDO').removeClass('PAGINA__CONTEUDO--MID')
                let botOff = pagina.find('.PAGINA__RODAPE').outerHeight()
                // % impressao
                botOff = (botOff*1.4)
                pagina
					.find('.PAGINA__CONTEUDO')
					.css('top', 'auto')
					.css('bottom', botOff)
				break
			default:
				pagina.find('.PAGINA__CONTEUDO').css('bottom', 'auto').addClass('PAGINA__CONTEUDO--MID')
				break
		}
	}
}

$(function() {
	url.prepend(window.location.origin)

	$('.IMPRESSAO__BTN--ZOO').click(() => {
		tabs.find('.TABELA__ITEM--ZOO').toggle()
	})

	$('.IMPRESSAO__OPCAO').bind('click touchend', function(ev) {
		let opcao = $(this).data('opcao')
		let menu = $(this)
			.parent()
			.siblings()
			.data('btn')

		formatTabs[menu](opcao)
	})
	print.click(function() {
		window.print()
	})
})

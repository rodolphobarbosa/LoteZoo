const sorteiosBtns = $('.SORTEIO__BTN--RES')
const sorteioModal = $('#Modal')

function renderizaModal(modal, sorteio) {
	modal.find('.sorteio-banca').text(sorteio.banca)
	modal
		.find('.sorteio-extracao')
		.show()
		.text(sorteio.extracao)
	modal
		.find('.sorteio-data')
		.text(sorteio.data)
		.removeClass('text-muted')
	modal.find('.btn-primary').attr('href', sorteio.print)
	let resultado = $(
		'<div class="SORTEIO__RESULTADO"></div>'
	)
	sorteio.resultado.forEach((premio, i) => {
		resultado.append(`
      <div class='PREMIO ${i % 2 == 0 ? 'PREMIO--STRIPED' : ''}'>
        <div class='PREMIO__MILHAR'>
          <span class='MILHAR__POS'>${i + 1}º</span>
          <div class='MILHAR__NUM'>${premio.milhar}</div>
        </div>

        <div class='PREMIO__GRUPO'>
          <div class='GRUPO__NUM'>${premio.grupo.num}</div>
          <img class='GRUPO__IMG' src=/images/grupos/${premio.grupo.img}>
        </div>
      </div>
    `)
	})
	modal.find('.modal-body').html(resultado)
}
function alertaModal(modal, status, erro) {
	let titulo = modal.find('#ModalTitulo')
	// caso ja tenha sido aberto reformata
	modal.find('.sorteio-extracao').hide()
	modal.find('.sorteio-data').addClass('text-muted')

	let txt = modal.find('.modal-body')
	modal.find('.btn-primary').attr('disabled', 'true')
	modal.find('.btn-primary').attr('aria-disabled', 'true')
	switch (status) {
		case 'timeout':
			titulo.text('Tempo esgotado')
			break
		case 'error':
			titulo.text('Erro ao buscar')
			break
		case 'abort':
			titulo.text('Cancelado')
			break
		default:
			titulo.text('Falha na conexão')
	}
	switch (erro) {
		case 'Not Found':
			txt.text('Resultado não encontrado.')
			break
		case 'Internal Server Error.':
			txt.html(
				'Erro no Servidor, porfavor <a href="mailto:ruansenadev@gmail.com?Subject=LoteZoo%20Suporte">Contate</a> o suporte.'
			)
			break
		default:
			txt.text(erro || 'Verifique os cabos de rede.')
	}
}

$(function() {
	sorteiosBtns.click(function(ev) {
		const btn = $(this)
		let uri = btn.data('uri')
		$.getJSON(uri, function(sorteio) {
			renderizaModal(sorteioModal, sorteio)
			sorteioModal.modal('show')
		}).fail(function(jqXHR, status, erro) {
			alertaModal(sorteioModal, status, erro)
			sorteioModal.modal('show')
		})
	})
})

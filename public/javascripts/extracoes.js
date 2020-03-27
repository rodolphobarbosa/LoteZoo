const sorteiosBtns = $('.SORTEIO__BTN--RES')
const sorteioModal = $('#MODAL')
const sorteioTitulo = $('#MODAL__TITULO')

function renderizaModal(modal, sorteio) {
	sorteioTitulo.text(sorteio.banca)
	modal
		.find('.SORTEIO__EXTRACAO')
		.show()
		.text(sorteio.extracao)
	modal.find('.SORTEIO__DATA').text(sorteio.data)
	modal.find('.SORTEIO__BTN--PRINT').attr('href', sorteio.print)
	let resultado = $("<div class='SORTEIO__RESULTADO'></div>")
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
	modal.find('.modal-body').html(resultado);
}
function alertaModal(modal, status, erro) {
  // caso ja tenha sido aberto reformata
  modal.find('.SORTEIO__EXTRACAO').hide()
  modal.find('.SORTEIO__DATA').text('03/07/1982') // easter egg
	modal.find('.SORTEIO__BTN--PRINT').attr('disabled', 'true').attr('aria-disabled', 'true')
  sorteioTitulo.addClass('text-secondary')
	let alerta = $("<div class='alert alert-warning' role='alert'></div>")
	switch (status) {
		case 'timeout':
			sorteioTitulo.text('Tempo esgotado')
			break
		case 'error':
			sorteioTitulo.text('Erro ao buscar')
			break
		case 'abort':
			sorteioTitulo.text('Cancelado')
			break
		default:
			sorteioTitulo.text('Falha na conexão')
	}
	switch (erro) {
		case 'Not Found':
			alerta.text('Resultado não encontrado.')
			break
		case 'Internal Server Error':
			alerta.html(
				'Erro no servidor, por favor <a href="mailto:ruansenadev@gmail.com?Subject=LoteZoo%20Suporte" class="alert-link">contate</a> o suporte.'
			)
			break
		default:
			alerta.text(erro || 'Verifique os cabos de rede.')
	}
  modal.find('.modal-body').html(alerta);
  modal.on('hide.bs.modal', function(e){
    sorteioTitulo.removeClass('text-secondary');
    modal.find('.SORTEIO__BTN--PRINT').attr('disabled', false).attr('aria-disabled', false);
  })
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

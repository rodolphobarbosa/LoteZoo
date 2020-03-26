function renderizaModal(modal, sorteio) {
  modal.find('.sorteio-banca').text(sorteio.banca)
	modal.find('.sorteio-extracao').show().text(sorteio.extracao)
  modal.find('.sorteio-data').text(sorteio.data).removeClass('text-muted');
  console.log(sorteio);
  modal.find('.btn-primary').attr('href', sorteio.print)
  let resultado = $('<ul class="list-group list-group-flush sorteio-resultado"></ul>');
  sorteio.resultado.forEach((premio, i) => {
    resultado.append(`
      <li class='list-group-item sorteio-premio ${i%2==0?"bg-striped":""}'>
        <div class='row no-gutters row-cols-md-3 row-cols-lg-4'>
          <div class='col pl-3 d-flex align-items-center justify-content-between flex-grow-1'>
            <span class='border text-muted premio-num'>
              ${i+1}º
            </span>
            <p class='premio-milhar ml-auto'>${premio.milhar}</p>
          </div>
          <div class='col d-flex align-items-center justify-content-end flex-shrink-1'>
            <span class='grupo-num'>${premio.grupo.num}</span>
          </div>
          <div class='col d-flex align-items-center justify-content-center'>
            <img class='grupo-img' src='/images/grupos/${premio.grupo.img}' alt='${premio.grupo.nome}'>
          </div>
          <div class='col pr-3 d-none d-lg-flex align-items-center justify-content-center'>
            <span class='grupo-nome'>${premio.grupo.nome}</span>
          </div>
        </div>
      </li>
    `);
  });
  modal.find('.modal-body').html(resultado);
}
function alertaModal(modal, status, erro) {
  let titulo = modal.find('#ModalTitulo');
  modal.find('.sorteio-extracao').hide();
  modal.find('.sorteio-data').addClass('text-muted');
  let txt = modal.find('.modal-body');
  modal.find('.btn-primary').attr('disabled', 'true');
  modal.find('.btn-primary').attr('aria-disabled', 'true');
  switch(status) {
    case('timeout'):
      titulo.text('Tempo esgotado')
      break;
    case('error'):
      titulo.text('Erro ao buscar')
      break;
    case('abort'):
      titulo.text('Cancelado')
      break;
    default:
      titulo.text('Falha na conexão')
  }
  switch(erro) {
    case('Not Found'):
      txt.text('Resultado não encontrado.')
      break;
    case('Internal Server Error.'):
      txt.html('Erro no Servidor, porfavor <a href="mailto:ruansenadev@gmail.com?Subject=LoteZoo%20Suporte">Contate</a> o suporte.')
      break;
    default:
      txt.text(erro || "Verifique os cabos de rede.")
  }
}

$(function() {
	const sorteiosBtns = $('.sorteio-res')
	const sorteioModal = $('#Modal')
	sorteiosBtns.click(function(ev) {
		const btn = $(this)
		let uri = btn.data('uri')
		$.ajax({
			url: uri,
			dataType: 'json',
			error: function(jqXHR, status, erro) {
        alertaModal(sorteioModal, status, erro);
        sorteioModal.modal('show');
			},
			success: function(sorteio) {
				// retornou sorteio atualiza o modal
        renderizaModal(sorteioModal, sorteio);
				sorteioModal.modal('show')
			}
		})
	})
})

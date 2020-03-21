function atualizaModal(modal, sorteio) {
	modal.find('.sorteio-banca').text(sorteio.banca)
	modal.find('.sorteio-extracao').text(sorteio.extracao)
  modal.find('.sorteio-data').text(sorteio.data)
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

$(function() {
	const sorteiosBtns = $('.sorteio-res')
	const sorteioModal = $('#Modal')
	sorteiosBtns.click(function(ev) {
		const btn = $(this)
		const extracao = btn.parentsUntil('.col', '.sorteio')
		let sorteio_banca = extracao.find('.sorteio-banca').text()
		let sorteio_extracao = extracao.find('.sorteio-extracao').text()
		let sorteio_data = extracao.find('.sorteio-data').text()
		console.log(sorteio_banca, sorteio_extracao, sorteio_data)
		let uri = btn.data('uri')
		$.ajax({
			url: uri,
			dataType: 'json',
			error: function(jqXHR, status, erro) {
				alert('status: ' + erro)
			},
			success: function(sorteio) {
				// retornou sorteio atualiza o modal
        atualizaModal(sorteioModal, sorteio);
				sorteioModal.modal('show')
				// sorteioModal.on('show.bs.modal', function(e) {
				// })
			}
		})
	})
})

$('#ResultadoModal').on('show.bs.modal', function(event) {
	// botao da extracao target
	let button = $(event.relatedTarget)
	// Extrair informações do atributo data-*
	let uri = button.data('uri')
  let modal = $(this)
	$.ajax({
    url: uri,
  }).done(sorteio => {
    console.log(modal,sorteio);
    modal.find('.modal-title').text(sorteio.banca + '-' + sorteio.extracao)
    modal.find('.modal-body').text(sorteio.resultado)
    modal.find('.sorteio-data').text(sorteio.data)
  })
	// If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
	// Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
})

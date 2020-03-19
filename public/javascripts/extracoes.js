$('#ResultadoModal').on('show.bs.modal', function (event) {
    let button = $(event.relatedTarget) // Button that triggered the modal
    let banca = button.data('banca') // Extract info from data-* attributes
    let extracao = button.data('extracao') // Extract info from data-* attributes
    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    let modal = $(this)
    modal.find('.modal-title').text(banca + (extracao == banca? "" : ` (${extracao})`))
  })
const dataBanca = $('#data-readonly').val()
const dataInput = $('#bancaData')
const dataBtn = $('#btnData')
const dataAbbr = $('#data-abbr')
const dias = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab']

function getDds(data) {
	let dds = Number(data.slice(-2)) % 7
	return dds ? dds - 1 : 6
}

$(function() {
	dataBtn.attr('disabled', dataInput.val() == dataBanca)
	// SMOOTH SCROLL
	$(document).on('click', 'a[href^="#"]', function(e) {
		// anchor id
		let id = $(this).attr('href')
		// anchor
		let $id = $(id)
		if (!$id.length) {
			return
		}
		// prevent standard hash navigation
		e.preventDefault()
		// top position relative to the document
		let pos = $id.offset().top - 56
		// animated top scrolling
		$('body, html').animate({ scrollTop: pos })
	})

	dataInput.change(function(ev) {
		let data = $(this).val()
		let dds = data ? dias[getDds(data)] : "&times;"
		dataBtn.attr('disabled', data == dataBanca || !data)
		dataAbbr.html(dds)
	})
})

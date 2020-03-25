const dataInput = $('#bancaData');
const dataBtn = $('#btnData');
const dataAddon = $('#data-addon');
const dias = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];

$(function() {
    dataBtn.attr('disabled', data == dataMax)
    // SMOOTH SCROLL
    $(document).on('click', 'a[href^="#"]', function(e) {
        // anchor id
        let id = $(this).attr('href');
        // anchor
        let $id = $(id);
        if (!$id.length) {
            return;
        }
        // prevent standard hash navigation
        e.preventDefault();
        // top position relative to the document
        let pos = $id.offset().top - 56;
        // animated top scrolling
        $('body, html').animate({scrollTop: pos});
    });

    const dataMax = dataInput.attr('max');
    dataInput.change(function(ev) {
        let data = $(this).val();
        let dds = Number(data.slice(-2))%7;
        // index dia
        dds = dds ? dds-1 : 6;
        dataBtn.attr('disabled', data == dataMax);
        dataAddon.text(dias[dds]);
    })
});
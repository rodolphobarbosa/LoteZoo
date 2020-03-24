$(function() {
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
    })
});
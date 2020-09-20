const what = $('#ICONE')
const how = $('#OPCOES')
const howTarget = $(how).parents('.CEL')

$(function() {
    what.on('click',function(ev) {
        let pos = howTarget.offset().top
        $('body, html').animate({ scrollTop: pos });
        how.slideUp(400).delay(900).slideDown(700)
    })
})
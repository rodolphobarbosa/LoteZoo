const print = $('#PRINT')
const pagina = $('#PAGINA')
const tabs = $('.TABELA')
const url = $('#URL')

const formatTabs = {
    borda: function(opcao) {
        switch(opcao) {
            case('sem'):
                tabs.removeClass('table-bordered').addClass('table-borderless')
                break
            case('total'):
                tabs.removeClass('table-borderless').addClass('table-bordered')
                break
            default:
                tabs.removeClass('table-bordered').removeClass('table-borderless');
                break
        }
    },
    fonte: function(opcao) {
        switch(opcao) {
            case('peq'):
                tabs.css('font-size', '0.8rem')
                break
            case('grande'):
                tabs.css('font-size', '1.2rem')
                break
            case('gigante'):
                tabs.css('font-size', '1.5rem')
                break
            default:
                tabs.css('font-size', '1rem')
                break
        }
    },
    coluna: function(opcao) {
        switch(opcao) {
            case('peq'):
                tabs.addClass('table-sm');
                break
            default:
                tabs.removeClass('table-sm')
                break
        }
    },
}

$(function() {
    url.prepend(window.location.origin)

    $('.IMPRESSAO__BTN--ZOO').click(()=>{tabs.find('.TABELA__ITEM--ZOO').toggle()})

    $('.IMPRESSAO__OPCAO').bind('click touchend', function(ev) {
        let opcao = $(this).data('opcao')
        let menu = $(this).parent().siblings().data('btn')

        formatTabs[menu](opcao)
    })
    print.click(function() {
        window.print()
    })
})
const loteriaMid = require('../controllers/data/loteria')

exports.dados_jogo = function(req, res, next) {
    let grupos = loteriaMid.dados_grupos()
    res.render('jogo', {title: 'Como jogar', grupos})
}
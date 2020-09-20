const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController')

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {title: 'LoteZoo - A loteria do bicho', url: req.headers.host})
});

router.get('/sitemap.xml', function(req, res){
  res.sendFile('/sitemap.xml')
})

router.get('/sobre', function(req, res) {
  res.render('sobre', {title: 'O Jogo do Bicho'})
})

router.get('/jogo', indexController.dados_jogo)

module.exports = router;

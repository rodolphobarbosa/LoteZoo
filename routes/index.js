var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {title: ':: LoteZoo :: A loteria do bicho'})
  // res.redirect('/resultados');
});

module.exports = router;

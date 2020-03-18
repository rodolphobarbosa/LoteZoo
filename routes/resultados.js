const express = require('express');
const router = express.Router();
const resultadosController = require('../controllers/resultadosController');

router.get('/', resultadosController.ultimas_extracoes);

router.get('/:banca', resultadosController.banca_sorteios);

module.exports = router;
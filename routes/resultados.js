const express = require('express');
const router = express.Router();
const resultadosController = require('../controllers/resultadosController');

// ultimas resultados cabeça
router.get('/', resultadosController.ultimas_extracoes);
// pagina banca no dia
router.get('/:banca', resultadosController.banca_sorteios);
// json sorteio
router.get('/:banca/sorteio', resultadosController.banca_sorteio);
// pagina banca outro dia
router.get('/:banca/:data', resultadosController.banca_sorteios);

module.exports = router;
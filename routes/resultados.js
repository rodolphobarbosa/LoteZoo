const express = require('express');
const router = express.Router();
const resultadosController = require('../controllers/resultadosController');

// ultimas resultados cabeça
router.get('/', resultadosController.ultimas_extracoes);
// pagina banca no dia
router.get('/:banca', resultadosController.banca_sorteios);
// json sorteio
router.get('/:banca/sorteio', resultadosController.banca_sorteio);
// pagina banca data
router.post('/:banca', resultadosController.banca_sorteios_data);

module.exports = router;
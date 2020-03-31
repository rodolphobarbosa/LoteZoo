const express = require('express');
const router = express.Router();
const resultadosController = require('../controllers/resultadosController');

// ultimas resultados cabeça
router.get('/', resultadosController.ultimas_extracoes);
// impressao sorteio desativado
// router.get('/imprimir', resultadosController.imprimir_sorteio);
// pagina banca no dia
router.get('/procurar', resultadosController.procurar_dados);
// json extracoes para search
router.get('/:banca', resultadosController.banca_sorteios);
// json sorteio
router.get('/:banca/sorteio', resultadosController.banca_sorteio);
// pagina banca data
router.post('/:banca', resultadosController.banca_sorteios_data);

module.exports = router;
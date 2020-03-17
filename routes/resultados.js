const express = require('express');
const router = express.Router();
const resultadosController = require('../controllers/resultadosController');

router.get('/', resultadosController.ultimas_extracoes);

module.exports = router;
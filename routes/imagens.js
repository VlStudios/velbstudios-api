const express = require('express');
const router = express.Router();


const ImagensController = require('../controllers/imagens-controller');

router.delete('/:id_imagem', ImagensController.deleteImagem);

module.exports = router;
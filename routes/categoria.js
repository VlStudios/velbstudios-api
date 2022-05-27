const express = require('express');
const router = express.Router();

const CategoriasController = require('../controllers/categorias-controller');

router.get('/' , CategoriasController.getCategorias);
router.post('/' , CategoriasController.postCategoria);
router.patch('/', CategoriasController.updateCategoria);

module.exports = router;
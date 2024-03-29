const express = require('express');
const router = express.Router();
const multer = require('multer');

const ProdutosController = require('../controllers/produtos-controller');

const storage = multer.diskStorage({
    destination: function (req, file, cb ) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        let data = new Date().toISOString().replace(/:/g, '-') + '-';
        cb(null, data + file.originalname );
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
 });

router.get('/' , ProdutosController.getProdutos);
router.post(
    '/',
    upload.single('imagem_produto'),
    ProdutosController.postProduto
);

router.get('/:id_produto', ProdutosController.getUmProduto);
router.patch('/', ProdutosController.updateProduto);
router.delete('/', ProdutosController.deleteProduto);

router.post(
    '/:id_produto/imagem', 
    upload.single('imagem_produto'),
    ProdutosController.postImagem
)

router.get(
    '/:id_produto/imagens',
    ProdutosController.getImagens
)

module.exports = router;



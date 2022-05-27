const express = require('express');
const router = express.Router();
const multer = require('multer');

const UsuariosController = require('../controllers/usuarios-controller');

const storage = multer.diskStorage({
    destination: function (req, file, cb ) {
        cb(null, './uploads_usuarios/');
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

router.post('/cadastro', upload.single('imagem_usuarios'), UsuariosController.cadastrarUsuario);
router.get('/' , UsuariosController.getUsuarios );
router.post('/login', UsuariosController.Login);
router.delete('/' , UsuariosController.deleteUsuario);

module.exports = router;
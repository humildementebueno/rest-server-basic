const {Router} = require('express');
const {usuariosGet,usuariosPatch, usuariosPost, usuariosDelete, usuariosPut} = require('../controllers/usuarios');
const router = Router();


router.get('/', usuariosGet)
router.put('/:id', usuariosPut)
router.patch('/', usuariosPatch)
router.post('/', usuariosPost)
router.delete('/', usuariosDelete)

module.exports = router;
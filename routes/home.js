const express = require('express');
const {
	leerUrls,
	agregarURL,
	eliminarURL,
	editarURLForm,
	editarURL,
	redireccionamiento,
} = require('../controllers/homeController');
const { validarURL } = require('../middlewares/urlValidate');
const router = express.Router();

router.get('/', leerUrls);
router.post('/', validarURL, agregarURL);
router.get('/eliminar/:id', eliminarURL);
router.get('/editar/:id', editarURLForm);
router.post('/editar/:id', validarURL, editarURL);
router.get('/:url', redireccionamiento);

module.exports = router;

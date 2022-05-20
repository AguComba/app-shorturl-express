const express = require('express');
const {
	leerUrls,
	agregarURL,
	eliminarURL,
	editarURLForm,
	editarURL,
	redireccionamiento,
} = require('../controllers/homeController');
const urlValidate = require('../middlewares/urlValidate');
const verificarUser = require('../middlewares/verificarUser');

const router = express.Router();

router.get('/', verificarUser, leerUrls);
router.post('/', verificarUser, urlValidate, agregarURL);
router.get('/eliminar/:id', verificarUser, eliminarURL);
router.get('/editar/:id', verificarUser, editarURLForm);
router.post('/editar/:id', verificarUser, urlValidate, editarURL);
router.get('/:url', redireccionamiento);

module.exports = router;

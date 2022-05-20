const Url = require('../models/Url');
const { nanoid } = require('nanoid');

const leerUrls = async (req, res) => {
	try {
		const urls = await Url.find({ user: req.user.id }).lean();
		res.render('home', { urls: urls });
	} catch (error) {
		req.flash('mensajes', [{ msg: error.message }]);
		return res.redirect('/');
	}
};

const agregarURL = async (req, res) => {
	const { origin } = req.body;
	try {
		const url = new Url({
			origin: origin,
			shortURL: nanoid(8),
			user: req.user.id,
		});
		await url.save();
		req.flash('mensajes', [{ msg: 'Url agregada' }]);
		res.redirect('/');
	} catch (error) {
		req.flash('mensajes', [{ msg: error.message }]);
		return res.redirect('/');
	}
};

const eliminarURL = async (req, res) => {
	const { id } = req.params;
	try {
		const url = await Url.findById(id);
		if (!url.user.equals(req.user.id)) {
			throw new Error('No es tu url payaso');
		} else {
			await url.remove();
			req.flash('mensajes', [{ msg: 'Url eliminada' }]);
		}
		res.redirect('/');
	} catch (error) {
		req.flash('mensajes', [{ msg: error.message }]);
		return res.redirect('/auth/login');
	}
};

const editarURLForm = async (req, res) => {
	const { id } = req.params;
	try {
		const url = await Url.findById(id).lean();
		if (!url.user.equals(req.user.id)) {
			throw new Error('No es tu url payaso');
		}
		return res.render('home', { url });
	} catch (error) {
		req.flash('mensajes', [{ msg: error.message }]);
		return res.redirect('/');
	}
};

const editarURL = async (req, res) => {
	const { id } = req.params;
	const { origin } = req.body;
	try {
		const url = await Url.findById(id);
		if (!url.user.equals(req.user.id)) {
			throw new Error('No es tu url payaso');
		}
		await url.updateOne({ origin });
		req.flash('mensajes', [{ msg: 'Url editada' }]);

		res.redirect('/');
	} catch (error) {
		req.flash('mensajes', [{ msg: error.message }]);
		return res.redirect('/');
	}
};

const redireccionamiento = async (req, res) => {
	const { url } = req.params;
	try {
		const urlDB = await Url.findOne({ shortURL: url }).lean();
		res.redirect(urlDB.origin);
	} catch (error) {
		req.flash('mensajes', [{ msg: error.message }]);
		return res.redirect('/');
	}
};

module.exports = {
	leerUrls,
	agregarURL,
	eliminarURL,
	editarURLForm,
	editarURL,
	redireccionamiento,
};

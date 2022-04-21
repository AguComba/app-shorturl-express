const Url = require('../models/Url');
const { nanoid } = require('nanoid');

const leerUrls = async (req, res) => {
	try {
		const urls = await Url.find().lean();
		res.render('home', { urls: urls });
	} catch (error) {
		console.log(error);
		res.send('Ah petado tio');
	}
};

const agregarURL = async (req, res) => {
	const { origin } = req.body;
	try {
		const url = new Url({ origin: origin, shortURL: nanoid(8) });
		await url.save();
		res.redirect('/');
	} catch (error) {
		console.log(error);
		res.send('error algo fallo');
	}
};

const eliminarURL = async (req, res) => {
	const { id } = req.params;
	try {
		await Url.findByIdAndDelete(id);
		res.redirect('/');
	} catch (error) {
		console.log(error);
		res.send('error de eliminar');
	}
};

const editarURLForm = async (req, res) => {
	const { id } = req.params;
	try {
		const url = await Url.findById(id).lean();
		res.render('home', { url });
	} catch (error) {
		console.log(error);
		res.send('error editar');
	}
};

const editarURL = async (req, res) => {
	const { id } = req.params;
	const { origin } = req.body;
	try {
		await Url.findByIdAndUpdate(id, { origin: origin });
		res.redirect('/');
		if (!Url) res.render('home', { url });
	} catch (error) {
		console.log(error);
		res.send('error editar');
	}
};

const redireccionamiento = async (req, res) => {
	const { url } = req.params;
	try {
		const urlDB = await Url.findOne({ shortURL: url }).lean();
		res.redirect(urlDB.origin);
	} catch (error) {
		res.redirect(error);
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

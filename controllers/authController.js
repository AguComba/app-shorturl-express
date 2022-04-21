const User = require('../models/User');
const { validationResult } = require('express-validator');
const flash = require('connect-flash');
const { nanoid } = require('nanoid');

const registerForm = (req, res) => {
	res.render('register', { mensajes: req.flash('mensajes') });
};

const registerUser = async (req, res) => {
	const erorrs = validationResult(req);
	if (!erorrs.isEmpty()) {
		req.flash('mensajes', erorrs.array());
		return res.redirect('/auth/register');
	}

	const { userName, email, password } = req.body;
	try {
		let user = await User.findOne({ email });
		if (user) throw new Error('El usuario ya existe');

		user = new User({ userName, email, password, tokenConfirm: nanoid() });
		await user.save();

		req.flash('mensajes', [
			{ msg: 'Revisa tu correo electronico y valida la cuenta' },
		]);
		res.redirect('/auth/login');
	} catch (e) {
		req.flash('mensajes', [{ msg: e.message }]);
		return res.redirect('/auth/register');
	}
};

const confirmarCuenta = async (req, res) => {
	const { token } = req.params;
	try {
		const user = await User.findOne({ tokenConfirm: token });
		if (!user) throw new Error('no existe este usuario');
		user.cuentaConfirmada = true;
		user.tokenConfirm = null;

		await user.save();
		req.flash('mensajes', [{ msg: 'Cuenta verificada, podes iniciar sesion' }]);
		res.redirect('/auth/login');
	} catch (error) {
		req.flash('mensajes', [{ msg: error.message }]);
		return res.redirect('/auth/login');
	}
};

const loginForm = (req, res) => {
	res.render('login', { mensajes: req.flash('mensajes') });
};

const loginUser = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		req.flash('mensajes', errors.array());
		return res.redirect('/auth/login');
	}

	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!user) throw new Error('No existe email');

		if (!user.cuentaConfirmada) throw new Error('Falta confirmar cuenta');

		if (!(await user.comparePassword(password)))
			throw new Error('Contraseña invalida');
		res.redirect('/');
	} catch (error) {
		console.log(error);
		req.flash('mensajes', [{ msg: error.message }]);
		return res.redirect('/auth/login');
	}
};

module.exports = {
	confirmarCuenta,
	registerForm,
	registerUser,
	loginForm,
	loginUser,
};

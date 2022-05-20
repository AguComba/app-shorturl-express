const User = require('../models/User');
const { validationResult } = require('express-validator');
const { nanoid } = require('nanoid');
const nodemailer = require('nodemailer');
require('dotenv').config();

const registerForm = (req, res) => {
	res.render('register');
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

		//envia correo para validar cuenta
		const transport = nodemailer.createTransport({
			host: 'smtp.mailtrap.io',
			port: 2525,
			auth: {
				user: process.env.userEmail,
				pass: process.env.passEmail,
			},
		});

		await transport.sendMail({
			from: '"Fred Foo 👻" <foo@example.com>', // sender address
			to: user.email, // list of receivers
			subject: 'Verifica tu cuenta de correo ✔', // Subject line
			text: 'Hello world?', // plain text body
			html: `<a href='http://localhost:5000/auth/confirmarCuenta/${user.tokenConfirm}'>Verifica tu cuenta aqui</a>`, // html body
		});

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
	res.render('login');
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

		// Creacion de sesion de usr por passport
		req.login(user, function (err) {
			if (err) throw new Error('Error al crear la session');
			return res.redirect('/');
		});
	} catch (error) {
		console.log(error);
		req.flash('mensajes', [{ msg: error.message }]);
		return res.redirect('/auth/login');
	}
};

const cerrarSesion = (req, res) => {
	req.logout();
	return res.redirect('/auth/login');
};

module.exports = {
	confirmarCuenta,
	registerForm,
	registerUser,
	loginForm,
	loginUser,
	cerrarSesion,
};

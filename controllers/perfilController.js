const formidable = require('formidable');

const formPerfil = (req, res) => {
	res.render('perfil');
};

const editarFotoPerfil = async (req, res) => {
	const form = new formidable.IncomingForm();
	form.maxFileSize = 50 * 1024 * 1024; //50mb

	form.parse(req, async (err, fields, files) => {
		try {
			if (err) {
				throw new Error('fallo formidable');
			}

			req.flash('mensajes', [{ msg: 'ya se subio la img' }]);
			return res.redirect('/perfil');
		} catch (error) {
			req.flash('mensajes', [{ msg: error.message }]);
			return res.redirect('/auth/login');
		}
	});
};

module.exports = {
	formPerfil,
	editarFotoPerfil,
};

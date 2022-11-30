const formidable = require('formidable');
const path = require('path');
const fs = require('fs');

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

			const file = files.myFile;
			if (file.originalFilename === '') {
				throw new Error('Agrega una imagen');
			}
			if (
				!(
					file.mimetype === 'image/png' ||
					file.mimetype === 'image/jpg' ||
					file.mimetype === 'image/jpeg'
				)
			) {
				throw new Error('Agregue una imagen png, jpg o jpeg ');
			}

			const extension = file.mimetype.split('/')[1];
			const dirFile = path.join(
				__dirname,
				`../public/img/Perfiles/${req.user.id}.${extension}`
			);
			fs.renameSync(file.filepath, dirFile);

			req.flash('mensajes', [{ msg: 'ya se subio la img' }]);
			return res.redirect('/auth/login');
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

const formidable = require('formidable');
const Jimp = require('jimp')
const path = require('path');
const fs = require('fs');
const User = require('../models/User')

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
			fs.copyFileSync(file.filepath, dirFile)

			const image = await Jimp.read(dirFile)
			image.resize(200,200).quality(90).writeAsync(dirFile)

			const user = await User.findById(req.user.id)
			user.image = `${req.user.id}.${extension}`
			await user.save()

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

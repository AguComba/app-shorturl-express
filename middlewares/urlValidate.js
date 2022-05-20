const { URL } = require('url');

const urlValidate = (req, res, next) => {
	try {
		const { origin } = req.body;
		const urlFront = new URL(origin);
		if (urlFront.origin !== 'null') {
			if (urlFront.protocol === 'http:' || urlFront.protocol === 'https:') {
				return next();
			}
		}
		throw new Error('tiene que tener https://');
	} catch (error) {
		if (error.message === 'Invalid URL') {
			req.flash('mensajes', [{ msg: 'url no valida' }]);
		} else {
			req.flash('mensajes', [{ msg: error.message }]);
		}
		res.redirect('/');
	}
};

module.exports = urlValidate;

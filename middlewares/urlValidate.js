const { URL } = require('url');

const validarURL = (req, res, next) => {
	try {
		const { origin } = req.body;
		const urlFront = new URL(origin);
		if (urlFront.origin !== 'null') {
			return next();
		} else {
			throw new Error('no valida');
		}
	} catch (error) {
		return res.send('Url invalida');
	}
};

module.exports = { validarURL };

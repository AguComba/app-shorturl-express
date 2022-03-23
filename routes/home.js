const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	const urls = [
		{ origin: 'www.google.com/comba1', shortURL: 'asdfas1' },
		{ origin: 'www.google.com/comba2', shortURL: 'asdfas2' },
		{ origin: 'www.google.com/comba3', shortURL: 'asdfas3' },
	];
	res.render('home', { urls: urls });
});

module.exports = router;

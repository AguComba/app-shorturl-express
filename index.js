const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const { create } = require('express-handlebars');
require('dotenv').config();
require('./database/db');
const app = express();

//creacion de la session
app.use(
	session({
		secret: 'palabra secreta',
		resave: false,
		saveUninitialized: false,
		name: 'secret-name',
	})
);

//Ejemplo de como usar flash
app.use(flash());
app.get('/msg-flash', (req, res) => {
	res.json(req.flash('mensaje'));
});
app.get('/enviar-msg', (req, res) => {
	req.flash('mensaje', 'este es un msg de error');
	res.redirect('msg-flash');
});

//Ejemplo de session sin flash
app.get('/ruta-protegida', (req, res) => {
	res.json(req.session.usuario || 'Sin sesion de usuario');
});

app.get('/crear-session', (req, res) => {
	req.session.usuario = 'agustin';
	res.redirect('/ruta-protegida');
});

app.get('/cerrar-session', (req, res) => {
	req.session.destroy();
	res.redirect('/ruta-protegida');
});
//Fin del ejemplo

const hbs = create({
	extname: '.hbs',
	partialsDir: ['views/components'],
});

app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('views', './views');

app.use(express.urlencoded({ extended: true }));
app.use('/', require('./routes/home'));
app.use(express.static(__dirname + '/public'));
app.use('/auth', require('./routes/auth'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log('server on en ' + PORT);
});

const express = require('express');
const http = require('http'); 
const { Server } = require('socket.io'); 
const { engine } = require('express-handlebars');
const path = require('path');  
const { router: productRouter, readProducts } = require('./api/router'); 
const cartRouter = require('./api/carts');


const app = express();
const server = http.createServer(app); 
const io = new Server(server); 
const PORT = 8080; 

// Middleware
app.use(express.json());

// Handlebars
app.engine('handlebars', engine()); 
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views')); 

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public'))); 

// Rutas API 
app.use(
	'/api/products',
	(req, res, next) => {
		req.io = io; 
		next(); 
	},
	productRouter
); 
app.use('/api/carts', cartRouter);

// Ruta Handlebars
app.get('/', (req, res) => {
	res.render('home', {title: 'Inicio', message: 'Esto es handlebars'});
});

app.get('/home', async (req, res) => {
	const products = await readProducts();
	res.render('home', { products }); 
});

app.get('/realtimeproducts', async (req, res) => {
	const products = await readProducts(); 
	res.render('realTimeProducts', { products });
}); 

io.on('connection', async (socket) => {
	console.log('Nueva conexión:', socket.id);

	const products = await readProducts(); 
	socket.emit('productList', products); 

	socket.on('disconnect', () => {
		console.log('Cliente desconectado');
	})
})


server.listen(PORT, () => {
	console.log(`Servidor escuchando en http://localhost:${PORT}`);
}); 


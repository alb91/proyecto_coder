const express = require('express');
const http = require('http'); 
const { Server } = require('socket.io'); 
const { engine } = require('express-handlebars');
const path = require('path');  
const productRouter = require('./api/router'); 
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
app.use('/api/products', productRouter); 
app.use('/api/carts', cartRouter);

// Ruta Handlebars
app.get('/', (req, res) => {
	res.render('home', {title: 'Inicio', message: 'Esto es handlebars'});
});

io.on('connection', (socket) => {
	console.log('Nueva conexión');

	socket.emit('message', 'Bienvenido al servidor'); 

	socket.on('disconnect', () => {
		console.log('Cliente desconectado');
	})
})


server.listen(PORT, () => {
	console.log(`Servidor escuchando en http://localhost:${PORT}`);
}); 


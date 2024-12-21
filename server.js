const express = require('express'); 
const app = express(); 
const productRouter = require('./api/router'); 
const cartRouter = require('./api/carts');

const PORT = 8080; 

app.use(express.json()); 
app.use('/api/products', productRouter); 
app.use('/api/carts', cartRouter); 

app.listen(PORT, () => {
	console.log(`Servidor escuchando en http://localhost:${PORT}`);
}); 


const express = require('express'); 
const router = express.Router(); 

const products = [
  { id: 1, name: 'Producto 1', price: 100 },
  { id: 2, name: 'Producto 2', price: 200 },
  { id: 3, name: 'Producto 3', price: 300 },
];


router.get('/', (req, res) => {
	const limit = req.query.limit ? parseInt(req.query.limit) : products.length; 
	res.json(products.slice(0, limit)); 
});

router.get('/:pid', (req, res) => {
	const pid = parseInt(req.params.pid); 
	const product = products.find(p => p.id === pid);

	if(product){
		res.json(product);
	}else{
		res.status(404).json({error: 'Producto no encontrado'});
	} 
});

router.post('/', (req, res) => {
	const { title, description, code, price, status = true, stock, category, thumbnails = [] } = req.body;

	if(!title || !description || !code || !price || !stock || !category){
		return res.status(400).json({ error: "Asegurate de llenar los campos obligatorios."}); 
	} 

	const newId = products.length + 1; 
	const newProduct = {
		id: newId, 
		title,
		description, 
		code,
		price,
		status,
		stock,
		category,
		thumbnails
	}; 

	products.push(newProduct); 

	res.status(201).json(newProduct); 
}); 

router.put('/:pid', (req, res) => {
	const pid = parseInt(req.params.pid);
	const { title, description, code, price, status, stock, category, thumbnails } = req.body;

	const product = products.find(p => p.id === pid); 

	if(!product){
		return res.status(404).json({error: "Producto no encontrado"}); 
	}

	if (title) product.title = title;
  	if (description) product.description = description;
  	if (code) product.code = code;
  	if (price) product.price = price;
  	if (status !== undefined) product.status = status;
  	if (stock) product.stock = stock;
  	if (category) product.category = category;
  	if (thumbnails !== undefined) product.thumbnails = thumbnails;

  	res.json(product); 
}); 

router.delete('/:pid', (req, res) => {
	const pid = parseInt(req.params.pid); 
	const productIndex = products.findIndex(p => p.id === pid); 

	if(productIndex === -1){
		return res.status(404).json({error: "Producto no encontrado"}); 
	}

	products.splice(productIndex, 1); 
	res.status(200).json({message: "Producto eliminado"});
});

module.exports = router; 


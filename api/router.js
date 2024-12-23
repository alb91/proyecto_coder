const express = require('express');
const fs = require('fs/promises');
const path = require('path');

const router = express.Router(); 
const productsFilePath = path.join(__dirname, '../products.json');

const readProducts = async () => {
    try {
        const data = await fs.readFile(productsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
    	return [];
    }
};

const writeProducts = async (products) => {
    await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));
};

router.get('/', async (req, res) => {
	const products = await readProducts();
	const limit = req.query.limit ? parseInt(req.query.limit) : products.length; 
	res.json(products.slice(0, limit)); 
});

router.get('/:pid', async (req, res) => {
	const products = await readProducts();
	const pid = parseInt(req.params.pid); 
	const product = products.find(p => p.id === pid);

	if(product){
		res.json(product);
	}else{
		res.status(404).json({error: 'Producto no encontrado'});
	} 
});

router.post('/', async (req, res) => {
	const { title, description, code, price, status = true, stock, category, thumbnails = [] } = req.body;

	if(!title || !description || !code || !price || !stock || !category){
		return res.status(400).json({ error: "Asegúrate de llenar los campos obligatorios."}); 
	} 

	const products = await readProducts();
	const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
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
	await writeProducts(products);
	res.status(201).json(newProduct); 
}); 

router.put('/:pid', async (req, res) => {
	const pid = parseInt(req.params.pid);
	const { title, description, code, price, status, stock, category, thumbnails } = req.body;
	const products = await readProducts();
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

  	await writeProducts(products);
  	res.json(product); 
}); 

router.delete('/:pid', async (req, res) => {
	const pid = parseInt(req.params.pid);
	const products = await readProducts();
	const productIndex = products.findIndex(p => p.id === pid); 

	if(productIndex === -1){
		return res.status(404).json({error: "Producto no encontrado"}); 
	}

	products.splice(productIndex, 1);
	await writeProducts(products);
	res.status(200).json({message: "Producto eliminado"});
});

module.exports = router; 


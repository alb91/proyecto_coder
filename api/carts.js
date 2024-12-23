const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();

const cartsFilePath = path.join(__dirname, "../carts.json"); 

const readCarts = async () => {
	try{
		const data = await fs.readFile(cartsFilePath, 'utf-8');
		return JSON.parse(data);
	}catch(error){
		return []; 
	}
}

const writeCarts = async (carts) => {
	await fs.writeFile(cartsFilePath, JSON.stringify(carts, null, 2));
}

router.post('/', async (req, res) => {
	const carts = await readCarts();
	const newId = carts.length > 0 ? Math.max(...carts.map((c) => c.id)) + 1 : 1;
	const newCart = {
		id: newId,
		products: []
	};

	carts.push(newCart); 
	await writeCarts(carts); 
	res.status(201).json(newCart); 
}); 

router.get('/:cid', async (req, res) =>{
	const carts = await readCarts();
	const cid = parseInt(req.params.cid); 
	const cart = carts.find(c => c.id === cid);

	if(!cart){
		return res.status(404).json({ error: "Carrito no encontrado" });
	}

	res.json(cart.products);
}); 

router.post('/:cid/product/:pid', async (req, res) => {
	const carts = await readCarts();
	const cid = parseInt(req.params.cid);
	const pid = parseInt(req.params.pid);
	const cart = carts.find(c => c.id === cid);

	if(!cart){
		return res.status(404).json({ error: "Carrito no encontrado" });
	}

	const existingProduct = cart.products.find(p => p.product === pid);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.products.push({ product: pid, quantity: 1 });
    }

    await writeCarts(carts);
	res.status(200).json(cart); 
}); 

module.exports = router; 
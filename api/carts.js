const express = require('express'); 
const router = express.Router();

let carts = []; 

router.post('/', (req, res) => {
	const newId = carts.length + 1; 
	const newCart = {
		id: newId,
		products: []
	};

	carts.push(newCart); 
	res.status(201).json(newCart); 
}); 

module.exports = router; 
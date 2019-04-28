const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
	res.status(200).json({
		message: 'Handling GET request to /products'
	});
});

router.get('/:productId', (req, res, next) => {
	const id = req.params.productId;
	res.status(200).json({
		message: 'Handling GET request to /products/:productId',
		id : id
	});
});

router.post('/', (req, res, next) => {
	res.status(200).json({
		message: 'Handling Post request to /products'
	});
});

module.exports = router;
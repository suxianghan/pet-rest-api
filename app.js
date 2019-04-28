const express = require('express');
const app = express();

const allRoutes = './api/routes';
const productRoutes = require(allRoutes + '/products')

app.use('/products', productRoutes);

module.exports = app;
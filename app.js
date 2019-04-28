const express = require('express');
const app = express();

const admin = require('firebase-admin');
const acc = require('./api/ServiceAccountKey.json')

admin.initializeApp({
  credential: admin.credential.cert(acc),
  databaseURL: "https://pet-adoption-498rk.firebaseio.com"
});

const db = admin.firestore();

const allRoutes = './api/routes';
const productRoutes = require(allRoutes + '/products')

app.use('/products', productRoutes);

module.exports = app;
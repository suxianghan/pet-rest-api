const express = require('express');
const router = express.Router();

const admin = require('firebase-admin');
const db = admin.firestore();

const FieldValue = require('firebase-admin').firestore.FieldValue;

router.post('/', (req, res, next) => {
	newRequest = {
		ownerId: req.body.ownerId,
		guestId: req.body.guestId,
		info: req.body.info,
		status: "await response"
	};

});

router.post('/accept', (req, res, next) => {
	req.params.guestId, 
	
});
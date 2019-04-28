const express = require('express');
const router = express.Router();

const admin = require('firebase-admin');
const db = admin.firestore();

router.get('/test', (req, res, next) => {
	var citiesRef = db.collection('cities');

	var setSf = citiesRef.doc('SF').set({
    	name: 'San Francisco', state: 'CA', country: 'USA',
    	capital: false, population: 860000 });
	
	res.status(200).json({
		message: 'Handling GET request to /products'
	});
});

router.post('/', (req, res, next) => {
	const newuser = {
		email: req.body.email,
		emailVerified: false,
		displayName: req.body.name,
		password: req.body.password,
	};

	var newid, _newowner;
	admin.auth().createUser(newuser).then(result => {
		newid = result.uid;
		return admin.auth().setCustomUserClaims(result.uid, {
        	role: req.body.role
    	});
    }).then(foo => {
    	if(req.body.role == "owner"){
    		_newowner = {
				name: req.body.name,
				description: req.body.description,
				location: req.body.location,
				pet: [],
			};
			var ownerRef = db.collection('owners').doc(newid);
			return ownerRef.set(_newowner);
    	} else {
    		_newowner = {
				name: req.body.name,
				applies: [],
			};
			var guestRef = db.collection('guest').doc(newid);
			return guestRef.set(_newowner);
    	}
    }).then(userRecord => {
    		console.log(userRecord);
    		res.status(200).json({
				status: 'success',
				objectID: newid,
			})
	}).catch((err) => {
		console.log(err);
		res.status(400).json({
			error: err
		})
	})
});

module.exports = router;
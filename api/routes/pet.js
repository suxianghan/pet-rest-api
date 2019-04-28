const express = require('express');
const router = express.Router();

const admin = require('firebase-admin');
const db = admin.firestore();

const FieldValue = require('firebase-admin').firestore.FieldValue;

router.post('/', (req, res, next) => {
	const newPet = {
		name : req.body.name,
		owner : req.body.owner,
		breed : req.body.breed,
		gender : req.body.gender,
		age: req.body.age,
		size: req.body.size,
		color: req.body.color,
		goodWith: req.body.goodWith,
		description: req.body.description,
		health: req.body.health,
		photo: req.body.photo,
		active: true,
	}

	var newPetRef = db.collection('pets').doc();
	var ownerRef = db.collection('owners').doc(req.body.owner);

	newPetRef.set(newPet).then(ret => {
		console.log(newPetRef.id);
		return ownerRef.update({pet: FieldValue.arrayUnion(newPetRef.id)}, { merge: true });
    }).then(ret => {
    	res.status(200).json({
			status: 'success'
		});
    }).catch(err => {
    	console.log(err);
    	res.status(400).json({
			status: 'fail',
			error: err
		});
    });
    /*
	{
			"name" : "Happy Cat",
			"owner" : "3WTmh4pNJLeIlcVFEDLGysaWDOi2",
			"breed" : "red",
			"gender" : "female",
			"age": "1",
			"size": "12",
			"color": "blue",
			"goodWith": "3",
			"description": "asdf gggg fff sscscs",
			"health": "healthy",
			"photo": "undefined"
	}
	*/
});

router.get('/:petId', (req, res, next) => {
	const objectId = req.params.petId;
	var newPetRef = db.collection('pets').doc(objectId);
	newPetRef.get().then(ret => {
		if(!ret.exists){
			res.status(400).json({
				status: 'fail',
				error: 'such petId DNE'
			});			
		} else {
			res.status(200).json({
				status: 'success',
				data: ret.data()
			});
		}
	}).catch(err => {
    	console.log(err);
    	res.status(400).json({
			status: 'fail',
			error: err
		});
    });
});

router.delete('/:petId', (req, res, next) => {
	const objectId = req.params.petId;
	var newPetRef = db.collection('pets').doc(objectId);
	newPetRef.delete().then(ret => {
		res.status(200).json({
			status: 'success'
		});
	}).catch(err => {
    	console.log(err);
    	res.status(400).json({
			status: 'fail',
			error: err
		});
    });
});

module.exports = router;






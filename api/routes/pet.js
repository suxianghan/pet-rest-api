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
		goodWith: [req.body.goodWith],
		description: req.body.description,
		health: req.body.health,
		photo: [req.body.photo],
		active: true,
	}

	var newPetRef = db.collection('pets').doc();
	var ownerRef = db.collection('owners').doc(req.body.owner);

	newPetRef.set(newPet).then(ret => {
		console.log(newPetRef.id);
		return ownerRef.update({pet: FieldValue.arrayUnion(newPetRef.id)}, { merge: true });
    }).then(ret => {
    	res.status(200).json({
			status: 'success',
			data: {id: newPetRef.id}
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

router.get('/spec/:petId', (req, res, next) => {
	const objectId = req.params.petId;
	var newPetRef = db.collection('pets').doc(objectId);
	newPetRef.get().then({

	}).then(ret => {
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

router.get('/like', (req, res, next) => {
	var guestRef = db.collection('guest').doc(req.query.guestId);
	console.log(req.query.guestId, req.query.petId)
	guestRef.update({like: FieldValue.arrayUnion(req.query.petId)}, { merge: true })
		.then(ret => {
			res.status(200).json({
				status: 'success'
			});
		}).catch(err => {
    		console.log(err);
	    	res.status(400).json({
				status: 'fail',
				error: err
			});
    	});;
});

router.get('/dislike', (req, res, next) => {
	var guestRef = db.collection('guest').doc(req.query.guestId);
	console.log(req.query.guestId, req.query.petId)
	guestRef.update({like: FieldValue.arrayRemove(req.query.petId)}, { merge: true })
		.then(ret => {
			res.status(200).json({
				status: 'success'
			});
		}).catch(err => {
    		console.log(err);
	    	res.status(400).json({
				status: 'fail',
				error: err
			});
    	});;
});

router.get('/allLike', (req, res, next) => {
	var guestRef = db.collection('guest').doc(req.query.guestId);
	guestRef.get().then(ret => {
		id = ret.data().like
		const refs = id.map(idd => db.doc(`pets/${idd}`))

		return db.getAll(...refs);
	}).then(users => {
		arr = users.map(doc => doc.data())
		res.status(200).json({
			status: 'success',
			data: arr
		});
	});
});


// router.delete('/:petId', (req, res, next) => {
// 	const objectId = req.params.petId;
// 	var newPetRef = db.collection('pets').doc(objectId);
// 	newPetRef.delete().then(ret => {
// 		res.status(200).json({
// 			status: 'success'
// 		});
// 	}).catch(err => {
//     	console.log(err);
//     	res.status(400).json({
// 			status: 'fail',
// 			error: err
// 		});
//     });
// });

router.post('/event', (req, res, next) => {
	const newEvent = {
		name: req.body.name,
		location: req.body.location,
		pets: req.body.pets,
		description: req.body.description,
		owner:req.body.ownerId
	}
	console.log(newEvent);
	var newEventRef = db.collection('event').doc();
	var ownerRef = db.collection('owners').doc(req.body.ownerId);

	newEventRef.set(newEvent).then(ret => {
		console.log(newEventRef.id);
		return ownerRef.update({event: FieldValue.arrayUnion(newEventRef.id)}, { merge: true });
    }).then(ret => {
    	res.status(200).json({
			status: 'success',
			data: {id: newEventRef.id}
		});
    }).catch(err => {
    	console.log(err);
    	res.status(400).json({
			status: 'fail',
			error: err
		});
    });
});

router.get('/AllPet', (req, res, next) => {
	var guestRef = db.collection('owners').doc(req.query.ownerId);
	var id;
	guestRef.get().then(ret => {
		id = ret.data().pet
		const refs = id.map(idd => db.doc(`pets/${idd}`))
		return db.getAll(...refs);
	}).then(users => {
		arr = users.map(doc => doc.data())
		res.status(200).json({
			status: 'success',
			data: arr.map((item, index) => {
				return {
					data: item,
					id: id[index]
				}
			})
		});
	});
});

router.get('/AllEvent', (req, res, next) => {
	var guestRef = db.collection('owners').doc(req.query.ownerId);
	guestRef.get().then(ret => {
		id = ret.data().event
		const refs = id.map(idd => db.doc(`event/${idd}`))
		return db.getAll(...refs);
	}).then(users => {
		arr = users.map(doc => doc.data())
		res.status(200).json({
			status: 'success',
			data: arr
		});
	});
});

module.exports = router;






const express = require('express');
const router = express.Router();

const admin = require('firebase-admin');
const db = admin.firestore();

const FieldValue = require('firebase-admin').firestore.FieldValue;

router.post('/', (req, res, next) => {
	var newRequest = {
		ownerId: req.body.ownerId,
		guestId: req.body.guestId,
		petId: req.body.petId,
		name: req.body.name,
		email: req.body.email,
		reason: req.body.reason,
		health: req.body.health,
		care: req.body.care,
		time: req.body.time,
		otherPet: req.body.otherPet,
		status: 0,
		reject: false,
	};
	var newReqRef = db.collection('pets').doc(req.body.petId)
					  .collection('request').doc(req.body.guestId);
	var guestRef = db.collection('guest').doc(req.body.guestId);

	newReqRef.set(newRequest).then(ret =>{
		return guestRef.update({applies: FieldValue.arrayUnion(req.body.petId)}, { merge: true });
	}).then(ret => {
		res.status(200).json({
			status: 'success',
			data: newReqRef.id
		});
	}).catch(err => {
    	console.log(err);
    	res.status(400).json({
			status: 'fail',
			error: err
		});
    });

});

router.get('/guestAllReq', (req, res, next) => {
	var guestRef = db.collection('guest').doc(req.query.guestId);
	guestRef.get().then(ret => {
		id = ret.data().applies
		console.log(id);
		console.log(id.length);
		if(id.length == 0){
			// res.status(200).json({
			// 	status: 'success',
			// 	data: []]
			// });
			return []
		} else {
			const refs = id.map(idd => db.doc(`pets/${idd}/request/${req.query.guestId}`))
			return db.getAll(...refs);
		}
	}).then(users => {
		arr = users.map(doc => doc.data())
		res.status(200).json({
			status: 'success',
			data: arr
		});
	});
});

router.post('/accept', (req, res, next) => {
	var ReqRef = db.collection('pets').doc(req.query.petId)
				   .collection('request').doc(req.query.guestId);
	ReqRef.update({status: 2}).then(ret => {
		res.status(200).json({
			status: 'success',
		});
	}).catch(err => {
    	console.log(err);
    	res.status(400).json({
			status: 'fail',
			error: err
		});
    });
	
});

router.post('/reject', (req, res, next) => {
	var ReqRef = db.collection('pets').doc(req.query.petId)
				   .collection('request').doc(req.query.guestId);
	ReqRef.update({reject: true}).then(ret => {
		res.status(200).json({
			status: 'success',
		});
	}).catch(err => {
    	console.log(err);
    	res.status(400).json({
			status: 'fail',
			error: err
		});
    });
});

router.post('/view', (req, res, next) => {
	var ReqRef = db.collection('pets').doc(req.query.petId)
				   .collection('request').doc(req.query.guestId);
	ReqRef.get().then(ret => {
		if(ret.data().status === 0){
			ReqRef.update({status: 1}).then(ret => {
				res.status(200).json({
					status: 'success',
				});
			}).catch(err => {
		    	console.log(err);
		    	res.status(400).json({
					status: 'fail',
					error: err
				});
		    });
		} else {
			res.status(200).json({
				status: 'success',
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

router.get('/', (req, res, next) => {
	var ReqRef = db.collection('pets').doc(req.params.petId)
				   .collection('request').doc(req.params.guestId);;
	ReqRef.get().then(ret => {
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

router.get('/allReq', (req, res, next) => {
	var ReqRef = db.collection('pets').doc(req.query.petId).collection('request');
	ReqRef.get().then(snapshot => {
		var data = []
		snapshot.forEach(doc => {
			data.push(doc.data());
		});
		res.status(200).json({
			status: 'success',
			data: data
		});
	}).catch(err => {
    	console.log(err);
    	res.status(400).json({
			status: 'fail',
			error: err
		});
    });
});

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

router.get('/dog_ques', (req, res, next) => {
	var QueRef = db.collection('dog-questions').limit(3);
	QueRef.get().then(snapshot => {
		var data = []
		snapshot.forEach(doc => {
			data.push(doc.data());
		});
		data = shuffle(data);
		res.status(200).json({
			status: 'success',
			data: [data[0],data[1],data[2]]
		});
	}).catch(err => {
    	console.log(err);
    	res.status(400).json({
			status: 'fail',
			error: err
		});
    });
});

router.get('/cat_ques', (req, res, next) => {
	var QueRef = db.collection('dog-questions').limit(3);
	QueRef.get().then(snapshot => {
		var data = []
		snapshot.forEach(doc => {
			data.push(doc.data());
		});
		data = shuffle(data);
		res.status(200).json({
			status: 'success',
			data: [data[0],data[1],data[2]]
		});
	}).catch(err => {
    	console.log(err);
    	res.status(400).json({
			status: 'fail',
			error: err
		});
    });
});

router.get('/finish_train', (req, res, next) => {
	var ReqRef = db.collection('pets').doc(req.query.petId)
				   .collection('request').doc(req.query.guestId);
	ReqRef.update({status: 4}).then(ret => {
		res.status(200).json({
			status: 'success',
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
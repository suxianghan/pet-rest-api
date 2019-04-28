const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const algoliasearch = require('algoliasearch');

/* Auth the database */
const admin = require('firebase-admin');
const acc = require('./api/ServiceAccountKey.json')

admin.initializeApp({
  credential: admin.credential.cert(acc),
  databaseURL: "https://pet-adoption-498rk.firebaseio.com"
});

const db = admin.firestore();

/* Auth Algolia for search */
ALGOLIA_APP_ID = "UOGMUUFTVT"
ALGOLIA_API_KEY = "d2eb75961bec869b89d1e57688b71c61"
ALGOLIA_INDEX_NAME = 'pets'
const algolia = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);
const index = algolia.initIndex(ALGOLIA_INDEX_NAME);

var petCollection = db.collection("/pets");

petCollection.onSnapshot(snapshot => 
	{ snapshot.docChanges().forEach(change => {
		console.log(change.doc.data().active); 
		if ( (change.type === 'added') || (change.type === 'modified') )  {
			if(change.doc.data().active){
				addOrUpdateIndexRecord(change.doc);
			} else {
				deleteIndexRecord(change.doc);
			}
		}
		if (change.type === 'removed') {
			deleteIndexRecord(change.doc);
		}
	}); 
});

function addOrUpdateIndexRecord(dataSnapshot) {
  let firebaseObject = dataSnapshot.data();
  firebaseObject.objectID = dataSnapshot.id;
  index.saveObject(firebaseObject, err => {
    if (err) {
      throw err;
    }
    console.log('Save to Algolia: ', firebaseObject.objectID);
  });
}

function deleteIndexRecord(dataSnapshot) {
  const objectID = dataSnapshot.id;
  index.deleteObject(objectID, err => {
    if (err) {
      throw err;
    }
    console.log('Delete from Algolia: ', objectID);
  });
}

/* Body parser */
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

/* All routes */
const allRoutes = './api/routes';
const signupRoutes = require(allRoutes + '/signup')
const petRoutes = require(allRoutes + '/pet')

app.use('/signup', signupRoutes);
app.use('/pet', petRoutes);

app.use((req, res, next) => {
	res.status(404).json({
		error: {
			message: '404 not found'
		}
	})
})
module.exports = app;
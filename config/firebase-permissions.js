var admin = require("firebase-admin");
const firebase = require('firebase/app');
require("firebase/auth");

var serviceAccount = require('./reservalo-app-ce7b0-firebase-adminsdk-i6tvz-0df49240f2.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://reservalo-app-ce7b0.firebaseio.com"
});


const database = admin.database();

const firebaseConfig = {
    apiKey: "AIzaSyCyg23xWfnKeefvKRn0siCWdR7ePLU0jGI",
    authDomain: "reservalo-app-ce7b0.firebaseapp.com",
    databaseURL: "https://reservalo-app-ce7b0.firebaseio.com",
    projectId: "reservalo-app-ce7b0",
    storageBucket: "reservalo-app-ce7b0.appspot.com",
    messagingSenderId: "806862613442",
    appId: "1:806862613442:web:e7284d48c7e69bfda8445b",
    measurementId: "G-6420F0RET7"
  };

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
module.exports = {
  database,
  admin,
  auth
};
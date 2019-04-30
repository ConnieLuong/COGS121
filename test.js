//firebase
const firebase = require("firebase");
const sercret = require('./secret');
const config = sercret.getDb();
firebase.initializeApp(config);
const database = firebase.database();


$('#resetButton').click(() => {
  console.log('Resetting the database');
  database.ref('users/').remove(); // delete the entire collection
  // writes data to the database:
  database.ref('users/Philip').set({job: 'professor', pet: 'cat.jpg'});
  database.ref('users/John').set({job: 'student',   pet: 'dog.jpg'});
  database.ref('users/Carol').set({job: 'engineer',  pet: 'bear.jpg'});
});
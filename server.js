const express = require("express");
var firebase = require("firebase/app");
require("firebase/auth");
require("firebase/database")
const app = express();
app.use(express.static("static_files"));
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true})); // hook up with your app

var config = {
  apiKey: "AIzaSyD0R6vfBJHgyT5pkOJZKIQuPN-A0ybDfz4",
  authDomain: "poppa-hub.firebaseapp.com",
  databaseURL: "https://poppa-hub.firebaseio.com",
  projectId: "poppa-hub",
  storageBucket: "poppa-hub.appspot.com",
  messagingSenderId: "907928434472"
};
firebase.initializeApp(config);
const db = firebase.database(); //realtime database
const auth = firebase.auth(); //user authentication



app.post('/signin', (req, res) => {
  // Grab email & password from request
  email =  req.body.email;
  password = req.body.password;

  // Sign in using firebase
  firebase.auth().signInWithEmailAndPassword(email, password)
  .then(function(user){
    res.send({'message':'sucess sign in'});
  })
  .catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    
    if (errorCode == 'auth/invalid-email') {
      res.status(406).send({
        message: 'Email was invalid'
      });
    } else if(errorCode == 'auth/wrong-password'){
      res.status(406).send({
        message: 'Wrong password'
      });
    } else {
      res.status(406).send({
        message: 'User not found'
      });
    }
    return;
  });
});

app.post('/signup', (req, res) => {
  console.log(req.body);
  // Grab email & password from request
  email =  req.body.email;
  password = req.body.password;
  displayName = req.body.displayName;

  // Sign up using firebase
  firebase.auth().createUserWithEmailAndPassword(email, password)
  .then(function(){
    res.send({'message':'sucess sign up'});
    firebase.auth().currentUser.updateProfile(
      {
        displayName: displayName
      }
    );
  })
  .catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode);
    console.log(errorMessage);
    
    if (errorCode == 'auth/email-already-in-use') {
      res.status(406).send({
        message: 'Email already in use'
      });
    } else if(errorCode == 'auth/invalid-email'){
      res.status(406).send({
        message: 'Email was invalid'
      });
    } else if(errorCode == 'auth/weak-password'){
      res.status(406).send({
        message: 'Password too weak'
      });
    } else {
      res.status(406).send({
        message: errorMessage
      });
    }

    return;
  });
});


app.listen(3000, () => {
  console.log("Server started at https://localhost:3000/");
});
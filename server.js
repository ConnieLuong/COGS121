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

app.get('/getUser', (req, res) => {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.
        var displayName = user.displayName;
        var email = user.email;
        var photoURL = user.photoURL;
        
        return res.send({
            'displayName': displayName, 
            'email':email, 
            'photoURL': photoURL, 
            'text':'Sign out', 
            'textsrc':''
        });
    } else {
        // User is signed out.
        return res.send({
            'text': 'Sign in', 
            'textsrc': './signin.html'
        });
    }
  });
});

app.get('/signout', (req, res) => {
    var user = firebase.auth().currentUser;
    if (user) {
      user.signOut();
      return res.status(200).send({'message': 'Successfully signed user out'});
    } else{
        console.log("no user sign in..... couldn't sign out");
    }
});

app.post('/signin', (req, res) => {
  // Grab email & password from request
  email =  req.body.email;
  password = req.body.password;

  // Sign in using firebase
  firebase.auth().signInWithEmailAndPassword(email, password)
  .then(function(user){
    var user = firebase.auth().currentUser;
    if(user) {
        window.location = 'index.html'; //After successful login, user will be redirected to home.html
    }
    return res.status(200).send({'message':'sucess sign in'});
  })
  .catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    
    if (errorCode == 'auth/invalid-email') {
      return res.status(406).send({
        message: 'Email was invalid'
      });
    } else if(errorCode == 'auth/wrong-password'){
      return res.status(406).send({
        message: 'Wrong password'
      });
    } else {
      return res.status(406).send({
        message: 'User not found'
      });
    }
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
    return;
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
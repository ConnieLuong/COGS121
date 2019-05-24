/************************************** Initiations  **************************************/
const express = require("express");
const _ = require("underscore");
const firebase = require("firebase/app");
require("firebase/auth");
require("firebase/database");
const bodyParser = require("body-parser");
const app = express();
app.use(express.static("static_files"));
app.use(bodyParser.urlencoded({ extended: true }));
const config = {
  apiKey: "AIzaSyD0R6vfBJHgyT5pkOJZKIQuPN-A0ybDfz4",
  authDomain: "poppa-hub.firebaseapp.com",
  databaseURL: "https://poppa-hub.firebaseio.com",
  projectId: "poppa-hub",
  storageBucket: "poppa-hub.appspot.com",
  messagingSenderId: "907928434472"
};
firebase.initializeApp(config);
const database = firebase.database();
/************************************** GET REQUESTS **************************************/
app.get("/getUser", (req, res) => {
  console.log("trying to make GET request to /getUser");
  var user = firebase.auth().currentUser;
  if (user) {
    // User is signed in.
    var displayName = user.displayName;
    var email = user.email;
    var photoURL = user.photoURL;

    return res.send({
      displayName: displayName,
      email: email,
      photoURL: photoURL,
      text: "Sign out"
    });
  } else {
    // User is signed out.
    return res.send({
      text: "Sign in"
    });
  }
});

app.get("/signOut", (req, res) => {
  console.log("trying to make GET request to /signOut");
  var user = firebase.auth().currentUser;
  if (user) {
    console.log("signing out...");
    firebase.auth().signOut();
    return res.status(200).send({ message: "Successfully signed user out" });
  } else {
    console.log("no user sign in..... couldn't sign out");
  }
});

/************************************** POST REQUESTS **************************************/
app.post("/signin", (req, res) => {
  console.log("trying to make POST request to /signin");
  // Grab email & password from request
  email = req.body.email;
  password = req.body.password;

  // Sign in using firebase
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(function(user) {
      var user = firebase.auth().currentUser;
      // if(user) {
      //     window.location = 'index.html'; //After successful login, user will be redirected to home.html
      // }
      return res.status(200).send({ message: "sucess sign in" });
    })
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;

      if (errorCode == "auth/invalid-email") {
        return res.status(406).send({
          message: "Email was invalid"
        });
      } else if (errorCode == "auth/wrong-password") {
        return res.status(406).send({
          message: "Wrong password"
        });
      } else {
        return res.status(406).send({
          message: "User not found"
        });
      }
    });
});

app.post("/signup", (req, res) => {
  console.log("trying to make POST request to /signup");
  // Grab email & password from request
  email = req.body.email;
  password = req.body.password;
  displayName = req.body.displayName;

  // Sign up using firebase
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(function() {
      //create a user object in database
      database.ref("users/").once("value", function(snapshot) {
        var collectionSize = snapshot.val()
          ? Object.keys(snapshot.val()).length + 1
          : 1;
        var userName = "users/user" + collectionSize;
        database.ref(userName).set({
          email: email,
          favorite_tips: [0],
          favorite_songs: [0],
          favorite_stories: [0]
        });
      });

      //update user name
      firebase.auth().currentUser.updateProfile({
        displayName: displayName
      });
      return res.send({ message: "success sign up" });
    })
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);

      if (errorCode == "auth/email-already-in-use") {
        res.status(406).send({
          message: "Email already in use"
        });
      } else if (errorCode == "auth/invalid-email") {
        res.status(406).send({
          message: "Email was invalid"
        });
      } else if (errorCode == "auth/weak-password") {
        res.status(406).send({
          message: "Password too weak"
        });
      } else {
        res.status(406).send({
          message: errorMessage
        });
      }

      return;
    });
});

app.post("/favorite", (req, res) => {
  console.log("trying to make POST request to /favorite");
  var user = firebase.auth().currentUser;
  var collection = req.body.collection; //tips, stories, songs/favorites, songs/hot, songs/new
  var item = req.body.item; //ie. tip01
  console.log("collection: " + collection + " item: " + item);
  if (user) {
    database.ref("users/").once("value", function(snapshot) {
      //Get a copy of user object
      var userRef = _.findWhere(snapshot.val(), { email: user.email });
      var userKey = _.findKey(snapshot.val(), function(u) {
        return u.email == user.email;
      });
      console.log("userKey: " + userKey + " userRef: ", userRef);

      // Get reference to user's appropriate favorites list & add new item
      var userFav =
        collection == "tips"
          ? userRef.favorite_tips
          : collection == "stories"
          ? userRef.favorite_stories
          : userRef.favorite_songs;
      userFav.push(item);
      userFav = _.uniq(userFav);
      if (userFav[0] == 0) userFav.shift(); //removes the placeholder 0

      // Update database
      switch (collection) {
        case "tips":
          database.ref("users/" + userKey).update({
            favorite_tips: userFav
          });
          break;
        case "stories":
          database.ref("users/" + userKey).update({
            favorite_stories: userFav
          });
          break;
        default:
          database.ref("users/" + userKey).update({
            favorite_songs: userFav
          });
      }
    });
    return res.send({ message: "Added to your favorites" });
  } else {
    return res.send({ message: "Please sign in to add to favorites." });
  }
});

//loading favorite
app.post("/getFavorite", (req, res) => {
  console.log("trying to make GET request to /getFavorite");
  var user = firebase.auth().currentUser;
  var collection = req.body.collection; //tips, stories, songs/favorites, songs/hot, songs/new
  if (user) {
    console.log("getting favorite data from firebase");
    database.ref("users/").once("value", function(snapshot) {
      //Get a copy of user object
      var userRef = _.findWhere(snapshot.val(), { email: user.email });
      var userKey = _.findKey(snapshot.val(), function(u) {
        return u.email == user.email;
      });
      console.log("userKey: " + userKey + " userRef: ", userRef);

      //Get to user's favorites tip
      var userFav =
        collection == "tips"
          ? userRef.favorite_tips
          : collection == "stories"
          ? userRef.favorite_stories
          : userRef.favorite_songs;

      switch (collection) {
        case "tips":
          database.ref("tips/").once("value", function(t) {
            const data = t.val();
            const results = _.chain(Object.keys(data))
              .filter(function(key) {
                return userFav.includes(key);
              })
              .reduce((obj, key) => {
                obj[key] = data[key];
                return obj;
              }, {})
              .value();
            console.log(results);
            res.send(results);
          });
          break;
        case "stories":
          console.log("clicking stories");

          break;
        default:
          console.log("clicking songs");
      }
    });
  } else {
    console.log("You need to sign in to see favorites");
    return res.send(401);
  }
});

app.listen(3000, () => {
  console.log("Server started at https://localhost:3000/");
});

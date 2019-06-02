/**
 * File: server.js
 * Description: Performs all the GET & POST calls to Firebase & returns data
 *              back to the frontend
 * Authors: Connie Luong, Hao-in Choi
 */

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

//Checks if user is signed in & returns data based on this info
app.get("/getUser", (req, res) => {
  console.log("trying to make GET request to /getUser");
  var user = firebase.auth().currentUser;
  if (user) {
    // User is signed in.
    return res.send({
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      text: "Sign out" //text to show on navbar
    });
  } else {
    // User is signed out.
    return res.send({
      text: "Sign in" //text to show on navbar
    });
  }
});

//Signs user out
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

//Grabs the tips collection from db
app.get("/tips", (req, res) => {
  console.log("trying to make GET request to /tips");
  database.ref("tips/").once("value", function(snapshot) {
    res.send(snapshot.val());
  });
});

//Grabs the stories collection from db
app.get("/stories", (req, res) => {
  console.log("trying to make GET request to /stories");
  database.ref("stories/").once("value", function(snapshot) {
    res.send(snapshot.val());
  });
});

//Grabs the songs collection from db
app.get("/songs", (req, res) => {
  console.log("trying to make GET request to /songs");
  database.ref("songs/").once("value", function(snapshot) {
    res.send(snapshot.val());
  });
});

/************************************** POST REQUESTS **************************************/

//Sign user in
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
      return res.status(200).send({ message: "sucess sign in" });
    })
    .catch(function(error) {
      // Handle Errors
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

//User sign up
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
      // Handle Errors
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

//Favorite or Unfavorite a tip, story, or song
app.post("/favorite", (req, res) => {
  console.log("trying to make POST request to /favorite");
  var user = firebase.auth().currentUser;
  var collection = req.body.collection; //tips, stories, songs
  var item = req.body.item; //ie. tip01, favorites/track0, hot/track1, new/track3, 3 (stories)
  var message;
  console.log("collection: " + collection + " item: " + item);
  if (user) {
    var message;
    database.ref("users/").once("value", function(snapshot) {
      //Get a copy of user object
      var userRef = _.findWhere(snapshot.val(), { email: user.email });
      var userKey = _.findKey(snapshot.val(), function(u) {
        return u.email == user.email;
      });

      // Get reference to user's appropriate favorites(tips, songs, or story) list & add new item
      var userFav =
        collection == "tips"
          ? userRef.favorite_tips
          : collection == "stories"
          ? userRef.favorite_stories
          : userRef.favorite_songs;
      if (userFav.includes(item)) {
        //remove that item
        userFav = _.filter(userFav, function(elem) {
          return elem != item;
        });
        res.send({ message: "Removed item from your favorites" });
      } else {
        //add that item
        userFav.push(item);
        res.send({ message: "Added item to your favorites" });
      }
      userFav = _.uniq(userFav);
      if (userFav[0] == 0) userFav.shift(); //removes the placeholder 0
      if (userFav.length == 0) userFav.push(0);

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
  } else {
    return res.send({ message: "Please sign in to add to favorites." });
  }
});

//If user signed in, grab expected list of favorites
app.post("/getFavorite", (req, res) => {
  console.log("trying to make POST request to /getFavorite");
  var user = firebase.auth().currentUser;
  var collection = req.body.collection; //tips, stories, songs/favorites, songs/hot, songs/new
  if (user) {
    database.ref("users/").once("value", function(snapshot) {
      //Get a copy of user object
      var userRef = _.findWhere(snapshot.val(), { email: user.email });
      var userKey = _.findKey(snapshot.val(), function(u) {
        return u.email == user.email;
      });

      //Get to user's favorites tip
      var userFav =
        collection == "tips"
          ? userRef.favorite_tips
          : collection == "stories"
          ? userRef.favorite_stories
          : userRef.favorite_songs;

      //Grab the appropriate favorite list to send back
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
            res.send(results);
          });
          break;
        case "stories":
          database.ref("stories/").once("value", function(t) {
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
            res.send(results);
          });
          break;
        default:
          const results = [];
          //wait for grabbing all the songs before send the json back to frontend
          var promise1 = new Promise(function(resolve, reject) {
            userRef.favorite_songs.forEach(e => {
              database
                .ref("songs/" + e)
                .once("value")
                .then(snapshot => {
                  results.push(snapshot.val());
                });
              setTimeout(() => {
                resolve(results);
              }, 1000);
            });
          });
          //send the object back to frontend
          promise1.then(function(value) {
            res.send(value);
          });
      }
    });
  } else {
    console.log("You need to sign in to see favorites");
    return res.send({ message: "You need to sign in to see favorites" });
  }
});

//Update profile
app.post("/updateProfile", (req, res) => {
  console.log("trying to make POST request to /updateProfile");
  var user = firebase.auth().currentUser;
  //new profile info
  var newName = req.body.newName;
  var newEmail = req.body.newEmail;
  //update profile if signed in
  if (user) {
    if (newName && newName != "") {
      user.updateProfile({
        displayName: newName
      });
    }
    if (newEmail && newEmail != "") {
      user
        .updateEmail(newEmail)
        .then(function() {
          // Update successful.
        })
        .catch(function(error) {
          // An error happened.
          return res.status(400).send({ message: "Could not update email" });
        });
    }
  }
  return res.status(200).send({
    message: "Successfully updated profile",
    name: user.displayName,
    email: user.email
  });
});

//Change password
app.post("/changePassword", (req, res) => {
  console.log("trying to make POST request to /changePassword");
  var user = firebase.auth().currentUser;
  var newPassword = req.body.newPassword;

  //update password if signed in
  if (user) {
    if (newPassword && newPassword != "") {
      user
        .updatePassword(newPassword)
        .then(function() {
          // Update successful.
          return res.status(200).send({
            message: "Successfully changed password",
            name: user.displayName,
            email: user.email
          });
        })
        .catch(function(error) {
          // An error happened.
          return res.status(400).send({ message: "Could not change password" });
        });
    }
  }
});

app.listen(3000, () => {
  console.log("Server started at https://localhost:3000/");
});

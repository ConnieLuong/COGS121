const express = require("express");
const app = express();
app.use(express.static("static_files"));

app.listen(3000, () => {
  console.log("Server started at http://localhost:3000/");
});

// Initialize Firebase
var config = {
  apiKey: "AIzaSyD0R6vfBJHgyT5pkOJZKIQuPN-A0ybDfz4",
  authDomain: "poppa-hub.firebaseapp.com",
  databaseURL: "https://poppa-hub.firebaseio.com",
  projectId: "poppa-hub",
  storageBucket: "poppa-hub.appspot.com",
  messagingSenderId: "907928434472"
};
firebase.initializeApp(config);

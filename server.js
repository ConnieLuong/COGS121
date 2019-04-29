const express = require("express");
const app = express();
app.use(express.static("static_files"));
//import secret.js


app.listen(3000, () => {
  console.log("Server started at http://localhost:3000/");
});



/**
 * Duc Giang
 * Simple Gallery
 * 
 */

const express = require("express");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const path = require("path");
const fs = require("fs");
const app = express();

// get static data
let characters = JSON.parse(fs.readFileSync("./data/characters.json"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// PORT Config
app.set("port", (process.env.PORT || 3000));

// Views
app.engine(".hbs", exphbs({
  defaultLayout: "main", extname: ".hbs"}));

app.set("view engine", ".hbs");


// Set static path
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));

// Initial Routing
app.get("/", (req, res) => {
  res.render("index", {    
    data: characters
  });
});

// On Submit
app.post("/", function(req, res) {
  var indexId = req.body.character;

  if (indexId != "-1") {        
    var charName = characters[indexId].name;
    var imageFile = characters[indexId].filename;      
  
     res.render("index", {
       data: characters,
       name: charName,
       image: imageFile
     });
  }
  else {    
    res.render("index", {    
      data: characters
    });
  }
  
})

app.listen(app.get("port"), () => console.log("Server started on port " + app.get("port")));
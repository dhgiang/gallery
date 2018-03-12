/**
 * Duc Giang
 * Simple Gallery
 * WEB322 Assignment #2
 * 
 */

const express = require("express");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const path = require("path");
const fs = require("fs");
const session = require("client-sessions");
const randomStr = require("randomstring");

const app = express();

// get static data
let characters = JSON.parse(fs.readFileSync("./data/characters.json"));
//let users = JSON.parse(fs.readFileSync("./data/users.json"));
let strRandom = randomStr.generate();
let expiredSessionMsg = "Session expired. Please login to continue.";

// body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// PORT Config
app.set("port", (process.env.PORT || 3000));

// Views
app.engine(".hbs", exphbs({defaultLayout: "main", extname: ".hbs"}));
app.set("view engine", ".hbs");

// Set static path
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));

// Create session-cookies
app.use(session({
	cookieName: "MySession",
	secret: strRandom,
	duration: 5 * 60 * 1000,
	activeDuration: 1 * 60 * 1000,
  httpOnly: true,
  secure: true,
  ephemeral: true
}));

// Login Page
app.get("/", (req, res) => {  
  res.render("logingallery");
});

app.post("/", (req, res) => {
  var username = req.body.txtUserName;
  var password = req.body.txtPassword;
  var msg = "", match = false, userId = "";
  
  fs.readFile("./data/users.json", "utf-8", (err, data) => {
    if (err) throw err;
    var users = JSON.parse(data);

    // If the credentials match then create sessions and redirect to gallery
    if (users.hasOwnProperty(username)){
      if (users[username] === password) {
        console.log("match found");
        req.MySession.user = username;
        match = true;        
      }
      userId = username;
      msg = "Invalid password for the username used."
    } 
    else
      msg = "Not a registered username";

    var urlLink = match ? "gallery" : "logingallery";    
  
    res.render(urlLink, {
      message: msg,
      user: userId,
      character: characters
    });     
  }); 
});

// registration landing page
app.get("/register", (req, res) => {
  res.render("register");
});

// registration submission
app.post("/register", (req, res) => {
  var username = req.body.txtUserName;
  var password = req.body.txtPassword;
  var confimpw = req.body.txtConfirmPassword;
  var msg, exist = true, userId = "";

  fs.readFile("./data/users.json", "utf-8", (err,data) => {
    if (err) throw err;
    var users = JSON.parse(data);

    if (users.hasOwnProperty(username))
      msg = "This username is already registered.";
      
    else {      
      msg = "Password mismatch.";
      userId = username;

      if (password === confimpw) {
        users.hasOwnProperty(username) || (users[username] = password);
        json = JSON.stringify(users);
        console.log(json);
        exist = false;
        msg = "New user added!";
        fs.writeFile("./data/users.json", json, "utf-8", (err, data) => {
          if (err) throw err;
          console.log("user added");
        });        
      }
    }
    var urlLink = exist ? "register" : "logingallery";
    res.render(urlLink, {
      message: msg,
      userNom: userId
    });    
  });

});

// Log out
app.post("/logout", (req, res) => {
  console.log("logging out and killing session....");
  req.MySession.user = null;
  res.render("logingallery");
});

// Gallery page
app.get("/gallery", (req, res) => {
  if (req.MySession.user === undefined || req.MySession.user === null) {    
    res.render("logingallery", {
      message: expiredSessionMsg
    });
  }  
  else {
    res.render("gallery", {
      user: req.MySession.user,
      character: characters
    });
  }
});

// On Submit (gallery page)
app.post("/gallery", function(req, res) {
  var indexId = req.body.characterList;
  console.log("cookie session post: " + req.MySession.user);

  if (req.MySession.user === undefined || req.MySession.user === null) {
    console.log(`session is: ${req.MySession.user}, ${req.sessions}`);
    res.render("logingallery", {
      message: expiredSessionMsg
    });
  }
  else {
    if (indexId != "-1") {        
      var charName = characters[indexId].name;
      var imageFile = characters[indexId].filename;      
      
      res.render("gallery", {
        user: req.MySession.user,
        character: characters,
        name: charName,
        image: imageFile
      });
    }
    else {    
      res.render("gallery", {
        user: req.MySession.user,
        character: characters
      });
    }
  }
})

app.listen(app.get("port"), () => console.log("Server started on port " + app.get("port")));
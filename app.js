const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const path = require("path");
const fs = require("fs");
const passport = require("passport");
const mongoClient = require("mongodb").mongoClient;

const app = express();
const port = process.env.PORT || 5000;

// Load routes
const arts = require("./routes/arts");
const users = require("./routes/users");

// DB CONFIG
const db = require("./config/database");

// Passport Config
require("./config/passport")(passport);

// Connect to mongoose/mongo DB
mongoose.Promise = global.Promise;
mongoose
  .connect(db.mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Handlebars middleware
app.engine(
  ".hbs",
  exphbs({
    defaultLayout: "main",
    extname: ".hbs"
  })
);
app.set("view engine", ".hbs");

// Body Parser
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

// Static folder
app.use(express.static(path.join(__dirname, "public")));

// Method override
app.use(methodOverride("_method"));

// Express Session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// flash
app.use(flash());

// global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

// index page
app.get("/", (req, res) => {
  const title = "Welcome to Home";
  res.render("index", {
    title: title
  });
});

// About Route
app.get("/about", (req, res) => {
  res.render("about");
});

// Use routes
app.use("/users", users);
app.use("/arts", arts);

app.listen(port, () => console.log(`Server started on port ${port}`));

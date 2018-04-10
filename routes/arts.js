// import { resolve } from "url";

const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { ensureAuthenticated } = require("../helpers/auth");

// Load Idea model
require("../models/Art");
const Art = mongoose.model("arts");

// Reset art collection
router.get("/reload", (req, res) => {
  var images = [
    {
      filename: "batman.jpg",
      description: "Batman",
      price: 2000,
      status: "A"
    },
    {
      filename: "darkness.jpg",
      description: "The Darkness",
      price: 2500,
      status: "A"
    },
    {
      filename: "deadpool.jpg",
      description: "Deadpool",
      price: 3000,
      status: "A"
    },
    {
      filename: "deadshot.jpg",
      description: "Deadshot",
      price: 3200,
      status: "A"
    },
    {
      filename: "deathstroke.jpg",
      description: "Deathstroke",
      price: 3400,
      status: "A"
    },
    {
      filename: "ghostrider.jpg",
      description: "Ghost Rider",
      price: 3200,
      status: "A"
    },
    {
      filename: "hellboy.jpg",
      description: "Hell Boy",
      price: 3500,
      status: "A"
    },
    {
      filename: "moonknight.jpg",
      description: "Moon Knight",
      price: 3200,
      status: "A"
    },
    {
      filename: "ripclaw.jpg",
      description: "Ripclaw",
      price: 1200,
      status: "A"
    },
    {
      filename: "spawn.jpg",
      description: "Spawn",
      price: 3020,
      status: "A"
    },
    {
      filename: "venom.jpg",
      description: "Venom",
      price: 3120,
      status: "A"
    },
    {
      filename: "warblade.jpg",
      description: "Warblade",
      price: 3270,
      status: "A"
    },
    {
      filename: "witchblade.jpg",
      description: "Witch Blade",
      price: 2200,
      status: "A"
    },
    {
      filename: "wolverine.jpg",
      description: "Wolverine",
      price: 2300,
      status: "A"
    }
  ];

  // Remove all documents from the arts collection first
  Art.remove({}).then(() => {
    req.flash("success_msg", "documents deleted");
  });

  Art.insertMany(images).then(art => {
    req.flash("success_msg", "art pieces reloaded");
  });

  res.redirect("/users/login");
});

// Art Index Page
router.get("/", ensureAuthenticated, (req, res) => {
  Art.find({ status: "A" }).then(arts => {
    res.render("arts/index", {
      arts: arts
    });
  });
});

// Selection of Art Piece
router.post("/", ensureAuthenticated, (req, res) => {
  var indexId = req.body.characterList;
  var image;

  // If item selected
  if (indexId !== "-1") {
    console.log(indexId);
    Art.findById(indexId, (err, art) => {
      if(err) err => console.log("error msg: " + err);
      console.log("filename: " + art.filename);
      image = {
        id: art.id,
        filename: art.filename,
        description: art.description,
        price: art.price,
        status: art.status
      };

      Art.find({ status: "A" }).then(arts => {
        res.render("arts/index", {
          arts: arts,
          image: image
        });
      });
      console.log("image: " + image);
    });
  }
  else {
    Art.find({ status: "A" }).then(arts => {
      res.render("arts/index", {
        arts: arts,
        image: image
      });
    });
  }

});


// Purchase Art (Edit)
// Edit Form Process
router.put("/:id", ensureAuthenticated, (req, res) => {
  Art.findOne({
    _id: req.params.id
  }).then(art => {
    // updated value to Sold (S)    
    art.status = "S";
    art.save().then(art => {
      req.flash("success_msg", `${art.description} Sold!`);
      res.redirect("/arts");
    });
  });
});

module.exports = router;

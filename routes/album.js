const express = require('express')
const router = express.Router()
const dbConnector = require('../db')
const ObjectID = require('mongodb').ObjectId
const collection = require("./collections")


router.post("/album", (req, res) => {
  req.body = JSON.parse(JSON.stringify(req.body));

  var album = {
    album_name: req.body.album_name,
    album_img: req.body.album_img,
    album_release_date: req.body.album_release_date,
    artist: new ObjectID(req.body.artist),
    created_on: new Date(),
    active: true
  }

  dbConnector.collection(collection.ALBUM).insertOne(album, (err, doc) => {
    if (err) {
      res.json({ status: false, message: "Error occured while inserting " + err });
    } else {
      res.json({ status: true, message: "Album inserted successfully" })
    }
  })
})

router.get("/album", (req, res) => {

  // var cursor = dbConnector.collection(collection.ALBUM).find()

  var cursor = dbConnector.collection(collection.ALBUM).aggregate([
    { $match: {} },
    { $lookup: { from: collection.ARTIST, localField: "artist", foreignField: "_id", as: "artist_details" } },
    { $unwind: "$artist_details" },
    {
      $project: {
        "_id": 1,
        "album_name": 1,
        "album_img": 1,
        "album_release_date": 1,
        "artist_details._id": 1,
        "artist_details.artist_name": 1,
        "artist_details.artist_profile_img": 1,
      }
    }
  ])

  var albums = [];

  cursor.forEach((doc, err) => {
    if (err) {
      res.json({ status: false, message: "Error occured" + err });
    } else {
      albums.push(doc);
    }
  }, () => {
    if (albums.length == 0) {
      res.json({ status: false, message: "No Album found" })
    } else {
      res.json({ status: true, message: "Album Found", result: albums })
    }
  })
})



module.exports = router;
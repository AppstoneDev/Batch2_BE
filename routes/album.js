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
    album_release_date: parseInt(req.body.album_release_date),
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

  //Doing Individual Queries
  // var query = {}
  // if (req.query != undefined) {

  //   if (req.query.release_year != undefined && req.query.release_year != null && req.query.release_year != "") {
  //     query = { "album_release_date": { $gte: parseInt(req.query.release_year) } }
  //   }

  //   if (req.query.album_name != undefined && req.query.album_name != null && req.query.album_name != "") {
  //     query = { "album_name": new RegExp(req.query.album_name, "i") }
  //   }
  // }



  var query = []
  var match = {}
  if (req.query != undefined) {

    if (req.query.release_year != undefined && req.query.release_year != null && req.query.release_year != "") {
      query.push({ "album_release_date": { $gte: parseInt(req.query.release_year) } })
    }

    if (req.query.album_name != undefined && req.query.album_name != null && req.query.album_name != "") {
      query.push({ "album_name": new RegExp(req.query.album_name, "i") })
    }
    if (query.length > 0) {
      match = { $and: query }
    }
  }

  var cursor = dbConnector.collection(collection.ALBUM).aggregate([
    { $match: match },
    { $lookup: { from: collection.ARTIST, localField: "artist", foreignField: "_id", as: "artist_details" } },
    // { $unwind: "$artist_details" },
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

router.put("/album", (req, res) => {

  //Sample code for updateMany functionality
  // dbConnector.collection(collection.ALBUM).updateMany({}, { $set: { artist: [] } }, (err, doc) => {
  //   if (err) {
  //     res.json({ status: false, message: "Update Faied " + err })
  //   } else {
  //     res.json({ status: true, message: "Update successfull" });
  //   }
  // })
  req.body = JSON.parse(JSON.stringify(req.body))

  if (req.body.hasOwnProperty("_id")) {
    var updateData = {}
    if (req.body.album_name != undefined && req.body.album_name != null && req.body.album_name != "") {
      updateData.album_name = req.body.album_name
    }

    if (req.body.album_img != undefined && req.body.album_img != null && req.body.album_img != "") {
      updateData.album_img = req.body.album_img
    }

    if (req.body.album_release_date != undefined && req.body.album_release_date != null && req.body.album_release_date != "") {
      updateData.album_release_date = parseInt(req.body.album_release_date)
    }

    if (req.body.artist != undefined && req.body.album_release_date != null && req.body.album_release_date != "") {
      var artistArr = JSON.parse(req.body.artist);
      var newArtists = []

      for (var artist of artistArr) {
        newArtists.push(new ObjectID(artist))
      }

      updateData.artist = newArtists
    }

    dbConnector.collection(collection.ALBUM).updateOne({ _id: new ObjectID(req.body._id) }, { $set: updateData }, (err, doc) => {
      if (err) {
        res.json({ status: false, message: "Error occurred " + err });
      } else {
        res.json({ status: true, message: "Data updated successfully" });
      }
    })

  } else {
    if (!req.body.hasOwnProperty("_id")) {
      return res.json({ status: false, message: "_id parameter is missing" });
    }
  }
})



module.exports = router;
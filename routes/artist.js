const ObjectID = require("mongodb").ObjectId
const express = require('express')
const router = express.Router()

const dbConnector = require('../db')
const collection = require("./collections")

//ADD ARTIST
router.post("/artist", (req, res) => {
  req.body = JSON.parse(JSON.stringify(req.body))

  var newData = {
    artist_name: req.body.artist_name,
    artist_profile_img: req.body.artist_profile_img,
    dob: new Date(req.body.dob), // yyyy:MM:ddThh:mm:ss.sssZ
    active: true,
    created_on: new Date()
  }

  dbConnector.collection(collection.ARTIST).insertOne(newData, (err, doc) => {
    if (err) {
      res.json({ status: false, message: "Error occured while inserting " + err });
    } else {
      res.json({ status: true, message: "Artist Inserted successfully" });
    }
  })
})

//VIEW ARTIST
router.get("/artist", (req, res) => {

  var cursor = dbConnector.collection(collection.ARTIST).find({})

  var artistArr = [];

  cursor.forEach((doc, err) => {
    if (err) {
      res.json({ status: false, message: "Error occured" + err });
    } else {
      artistArr.push(doc)
    }
  }, () => {
    if (artistArr.length == 0) {
      res.json({ status: false, message: "no Artist found" });
    } else {
      res.json({ status: true, message: "Artists found", result: artistArr })
    }
  })

  router.delete("/artist", (req, res) => {
    req.body = JSON.parse(JSON.stringify(req.body))

    dbConnector.collection(collection.ARTIST).deleteOne({ "_id": new ObjectID(req.body._id) }, (err, doc) => {
      if (err) {
        res.json({ status: false, message: "Error occured while deleting" });
      } else {
        res.json({ status: true, message: "Record Deleted Successfully" });
      }
    })
  })

})


router.put("/artist", (req, res) => {
  req.body = JSON.parse(JSON.stringify(req.body))

  if (req.body.hasOwnProperty("_id")) {

    var updateData = {}

    if (req.body.artist_name != undefined && req.body.artist_name != null && req.body.artist_name != "") {
      updateData.artist_name = req.body.artist_name
    }

    if (req.body.artist_profile_img != undefined && req.body.artist_profile_img != null && req.body.artist_profile_img != "") {
      updateData.artist_profile_img = req.body.artist_profile_img
    }

    if (req.body.dob != undefined && req.body.dob != null && req.body.dob != "") {
      updateData.dob = new Date(req.body.dob)
    }

    dbConnector.collection(collection.ARTIST).updateOne({ _id: new ObjectID(req.body._id) }, {
      $set: updateData
    }, (err, doc) => {
      if (err) {
        res.json({ status: false, message: err });
      } else {
        res.json({ status: true, message: "Artist data updated" });
      }
    })

  } else {
    if (!req.body.hasOwnProperty("_id")) {
      return res.json({ status: false, message: "_id parameter is missing" });
    }
  }
})

module.exports = router
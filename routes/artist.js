const ObjectID = require("mongodb").ObjectId
const express = require('express')
const router = express.Router()

const dbConnector = require('../db')
const collection = require("./collections")


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

module.exports = router
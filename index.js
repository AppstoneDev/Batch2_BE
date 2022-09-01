const express = require('express');
let cors = require('cors')
const app = express();

const dbConnector = require('./db');
const ObjectID = require('mongodb').ObjectId;

app.set("PORT", 8000);
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors());

dbConnector.connect(() => {
  app.listen(app.get("PORT"), () => {
    console.log("App is running " + app.get("PORT"));
  })
})




app.get("/check_health", (req, res) => {
  // console.log("App Health is successful");
  res.send("App Health is Successful");
})

//USER -> name, email, phone_no, dept, username, password

var users = []

app.post("/user", (req, res) => {
  req.body = JSON.parse(JSON.stringify(req.body))

  if (req.body.hasOwnProperty("phone_no")
    && req.body.hasOwnProperty("email")) {
    // users.push(req.body)

    dbConnector.collection("users").findOne({ "phone_no": req.body.phone_no }, (err, doc) => {
      if (err) {
        res.send("Error in inserting " + err);
      } else {
        if (doc == null || doc == undefined || doc.matchedCount == 0) {
          dbConnector.collection("users").insertOne(req.body, (err, doc) => {
            if (err) {
              res.send("User adding error" + err);
            } else {
              res.send("User added successful");
            }
          })
        } else {
          res.send("user already exists")
        }
      }
    })




  } else {
    if (!req.body.hasOwnProperty("phone_no")) {
      res.send("Missing Phone Number Field")
    } else if (!req.body.hasOwnProperty("email")) {
      res.send("Missing Email Field")
    }
  }


})

app.get("/user", (req, res) => {
  // res.json({ status: true, message: "users found", result: users })
  var cursor = dbConnector.collection("users").find();

  var userResult = [];

  cursor.forEach((doc, err) => {
    if (err) {
      return res.send("Error in getting user information" + err);
    } else {
      userResult.push(doc);
    }
  }, () => {
    if (userResult.length == 0) {
      res.send("No Users found");
    } else {
      res.json({ status: true, result: userResult });
    }
  })

  // dbConnector.collection("users").findOne({ "name": "Kapuramani" }, (err, doc) => {
  //   if (err) {
  //     res.send("Error in finding user " + err);
  //   } else {
  //     if (doc != undefined && doc != null) {
  //       if (doc.matchedCount == 0) {
  //         res.send("User not found");
  //       } else {
  //         res.json({ "status": true, result: doc });
  //       }
  //     }else{
  //       res.send("User not found");
  //     }
  //   }
  // })
})

app.delete("/user", (req, res) => {
  req.body = JSON.parse(JSON.stringify(req.body))


  var userID = req.body.user_id

  delete req.body["user_id"]

  dbConnector.collection("users").deleteOne({ "_id": new ObjectID(userID) }, (err, doc) => {
    if (err) {
      res.json({ status: false, message: "Error occured " + err });
    } else {
      if (doc != undefined && doc != null && doc.deletedCount > 0) {
        res.json({ status: true, message: "User deleted successfully" })
      } else {
        res.json({ status: false, message: "User not found" });
      }
    }
  })


})

app.put("/user", (req, res) => {
  req.body = JSON.parse(JSON.stringify(req.body))

  // console.log(req.body)

  var phone_no = req.body.phone_no
  var userID = req.body.user_id

  delete req.body["phone_no"]
  delete req.body["user_id"]




  //dbConnector.collection("users").updateOne({condition_check}, {updating new values}, {upsert}, {callback})


  dbConnector.collection("users").updateOne(
    { "_id": new ObjectID(userID) },
    //{ "phone_no": phone_no }, // checking of the condition to match the document we want to edit.

    // { $set: req.body }, // setting the updated data to the database
    {
      $set: {
        name: req.body.name,
        email: req.body.email,
      }
    },

    { upsert: false }, // return or not the udpated value
    (err, doc) => {
      if (err) {
        res.json({ status: false, message: "error in updating user" })
      } else {
        res.json({ status: true, message: "User updated successfully" })
      }
    })
})


app.post("/artist", (req, res) => {
  req.body = JSON.parse(JSON.stringify(req.body))

  var newData = {
    artist_name: req.body.artist_name,
    artist_profile_img: req.body.artist_profile_img,
    dob: new Date(req.body.dob), // yyyy:MM:ddThh:mm:ss.sssZ
    active: true,
    created_on: new Date()
  }

  dbConnector.collection("artist").insertOne(newData, (err, doc) => {
    if (err) {
      res.json({ status: false, message: "Error occured while inserting " + err });
    } else {
      res.json({ status: true, message: "Artist Inserted successfully" });
    }
  })
})

//HTTP Methods - GET, POST, PUT / PATCH , DELETE 
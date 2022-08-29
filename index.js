const express = require('express');
let cors = require('cors')
const app = express();

const dbConnector = require('./db')

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

    dbConnector.collection("users").insertOne(req.body, (err, doc) => {
      if (err) {
        res.send("User adding error" + err);
      } else {
        res.send("User added successful");
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
  var cursor = dbConnector.collection("users").find({"name": "Kapuramani"});

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

  var nameToBeRemoved = req.body.name;

  for (var i in users) {
    if (users[i].name == nameToBeRemoved) {
      delete users[i];
      return
    }
  }

  res.send("User deleted successfully")
})

//HTTP Methods - GET, POST, PUT / PATCH , DELETE 
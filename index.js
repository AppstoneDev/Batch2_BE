const express = require('express');
let cors = require('cors')
const app = express();

app.set("PORT", 8000);
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors());

app.listen(app.get("PORT"), () => {
  console.log("App is running " + app.get("PORT"));
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
    users.push(req.body)
    res.send("User added successful");
  } else {
    if (!req.body.hasOwnProperty("phone_no")) {

      res.send("Missing Phone Number Field")
    } else if (!req.body.hasOwnProperty("email")) {
      res.send("Missing Email Field")
    }
  }


})

app.get("/user", (req, res) => {
  res.json({ status: true, message: "users found", result: users })
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
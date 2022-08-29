const mongoClient = require('mongodb').MongoClient

let server = null


const DBURL = "mongodb+srv://nextstacks:appstone123@batch2.a6dk4un.mongodb.net/ecom?retryWrites=true&w=majority"

const connect = (callBack) => {

  mongoClient.connect(DBURL, { useUnifiedTopology: true }, (err, db) => {
    if (err) {
      console.log("Error in connecting to Databse " + err);
    } else {
      server = db;
      console.log("App connected to Database");
      callBack();
    }
  })
}


function collection(value) {
  return server.db().collection(value);
}

module.exports = {
  connect,
  collection
}
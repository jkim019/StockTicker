var http = require("http");
const fs = require('fs');
var qs = require("querystring");

// mongo setup
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb+srv://ashtonkim:comp20@cluster0.ykj0bsh.mongodb.net/?retryWrites=true&w=majority";

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  if (req.url == "/search")
  {
    // listen to the html, and get the select type

  }

}).listen(8080); // local server

// initiate search on my mongo
async function searchMongo(){
  var result = "<h1>RESULTS</h1>";
  MongoClient.connect(url, { useUnifiedTopology: true }, (err, database) => {
    if(err) { console.log("Connection err: " + err); return; }

    // Otherwise, Connected, keep going


  }
});

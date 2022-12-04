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
    res.writeHead(200, { "Content-Type": "text/html" });
    read_html = "";
    req
      .on("data", (data) => {
        read_html += data.toString();
      })
      .on("end", () => {
        read_html = qs.parse(read_html);
        var searchtype = read_html["name_or_ticker"];
        var key = read_html["user_input"];

        var result = "<h1>RESULTS</h1>";
        MongoClient.connect(url, { useUnifiedTopology: true }, (err, database) => {
          if(err) { console.log("Connection err: " + err); return; }

          // Otherwise, Connected, keep going
          var dbo = database.db("StockTicker");
          var collection = dbo.collection("equities");

          // check type
          if (searchtype == "name")
          {
            // get ticker of inputted company
            var found = await collection.find({company: key}).toArray();
          } else { // search by ticker
            var found = await collection.find({ticker: key}).toArray();
          }

          for (var i = 0; i<found.length(); i++)
          {
            result += "found[i].name" + "found[i].ticker" ;
          }

        res.end(result);
        database.close();
      });
  }
}); // local server

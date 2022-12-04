const fs = require('fs');

// connect to mongodb from here
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb+srv://ashtonkim:comp20@cluster0.ykj0bsh.mongodb.net/?retryWrites=true&w=majority";
MongoClient.connect(url, { useUnifiedTopology: true }, (err, database) => {
  if(err) { console.log("Connection err: " + err); return; }

  // Otherwise, Connection successful, proceed
  var dbo = database.db("StockTicker");
  var collection = dbo.collection("equities");
  var allData = [];

  // get details from file per new line
  const parse = require("csv-parser");

  fs.createReadStream("/Users/jaehyunkim/Documents/TUFTS_FALL2223/COMP20/HW11/companies.csv")
    .on("error", function() {
      console.log("ERROR: Check your filename");
    })
    .pipe(parse())
    .on("data", function(row) {
      var company_toadd = row.Company;
      var ticker_toadd = row.Ticker;

      // MUST TURN INTO OBJECTS, NOT STRINGS
      var objToAdd = { company: company_toadd, ticker: ticker_toadd}
      // console.log(mongo_string);
      allData.push(objToAdd);
    })
    .on("end", function() {
      collection.insertMany(allData, (err, res) => {
        if (err) throw err;
        database.close()
      });
    });
});

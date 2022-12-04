var http = require("http");
var url = require("url");
var path = require("path");
var fs = require("fs");
var qs = require("querystring");
const MongoClient = require("mongodb").MongoClient;

// connection string
const MongoClient = "mongodb+srv://ashtonkim:comp20@cluster0.ykj0bsh.mongodb.net/?retryWrites=true&w=majority";

const server = http.createServer((req, res) => {
var file_path = path.join(__dirname, req.url === "/" ? "index.html" : req.url);

var content_type = get_content_type(file_path);

if (req.url == "/find") {
  res.writeHead(200, { "Content-Type": "text/html" });
  input_data = "";
  req
    .on("data", (data) => {
    input_data += data.toString();
    })
    .on("end", () => {
    input_data = qs.parse(input_data);
    var type = input_data["input_type"];
    var blank = input_data["input_blank"];
    database_connect_find_display(type, blank, res);
    });
} else {
  fs.readFile(file_path, function (err, content) {
    if (err) {
    display_404(err, res);
    } else {
    display_content(content, content_type, res);
    }
  });
}
});

// Connects to database and displays the correctly filtered information
async function database_connect_find_display(type, blank, res) {
var s = "<h1> Stock Ticker Results </h1>";

MongoClient.connect(
  mongoUrl,
  { useUnifiedTopology: true },
  async (err, database) => {
    if (err) {
      console.log("Error: Connection to Mongo " + err);
      return;
    }

    var dbo = database.db("stock_ticker");
    var collection = dbo.collection("equities");


    try {
      query_input = "";
      query_option = "";
      if (type == "company") { //user inputted company name
        query_input = { name: blank };
        query_option = {
          sort: { name: 1 },
          projection: { _id: 0, name: 1, ticker: 1 },
        };
        s += `<h2>Company ${blank} has ticker: </h2>`;
      } else { //user inputted ticker code
        query_input = { ticker: blank };
        query_option = {
          sort: { name: 1 },
          projection: { _id: 0, name: 1, ticker: 1 },
        };

        s += `<h2>Companies with ticker ${blank} are: </h2>`;
      }

      //array with info that matches the inputted query
      var result_array = await collection.find(query_input, query_option).toArray();
      if (result_array.length === 0) {
        s += `No results found`;
      } else {
        result_array.forEach(function (curr) {
          s += `${curr.name} (${curr.ticker})<br>`;
        });
      }
    } finally {
      res.end(s);
      database.close();
    }
  }
);
}

// Returns the Content-Type as a string when given a file path, file_path
function get_content_type(file_path) {
  var ext = path.extname(file_path);
  switch (ext) {
  case ".js":
    return "text/javascript";
  case ".html":
    return "text/html";
  case ".css":
    return "text/css";
  default:
    return "text/html";
  }
}


//port
server.listen(process.env.PORT || 3000, () => console.log(`Port: ${process.env.PORT ||
3000}`));

// Displays 404 error page
function display_404(err, res) {
if (err.code == "ENOENT") {
// Display 404 page
fs.readFile(path.join(__dirname, "public", "error404.html"), (err, content) => {
res.writeHead(200, { "Content-Type": "text/html" });
res.end(content, "utf8");
});
}
}

// Displays the content
function display_content(content, content_type, res) {
res.writeHead(200, { "Content-Type": content_type });
res.end(content, "utf8");
}

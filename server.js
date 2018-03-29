var http = require("http");
var Datastore = require('nedb');
var fs = require("fs");
var path = require("path");
var qs = require("querystring");
var db = new Datastore({
  filename: 'data/database.db'
});


function getData(req, res) {
  var allData = "";
  req.on("data", function(data) {
    console.log("data: " + data)
    allData += data;
  })

  req.on("end", function(data) {
    var parsedJSON = JSON.parse(allData);
    db.insert(parsedJSON, function(err, newDoc) {
      res.end(newDoc._id);
    });
  })

}

function loadCards(req, res) {
  db.find({}, function(err, docs) {
    res.end(JSON.stringify(docs));
  });
}

db.loadDatabase();

http.createServer(function(req, res) {
  console.log(req.url)
  var url = req.url,
    ext = path.extname(url),
    contentType;

  if (ext == ".js") {
    contentType = "application/javascript";
  } else if (ext == ".css") {
    contentType = "text/css";
  } else if (ext == ".html") {
    contentType = "text/html";
  } else if (ext == ".jpg") {
    contentType = "image/jpeg";
  } else if (ext == ".png") {
    contentType = "image/png";
  } else if (ext == ".woff") {
    contentType = "application/font-woff";
  }

  if (url == "/") {
    fs.readFile("static/index.html", function(error, data) {
      res.writeHead(200, {
        'Content-Type': 'text/html'
      });
      res.write(data);
      res.end();
    })
  } else if (url == "/ajax") {
    console.log("DANE OD AJAXA")
    switch (req.method) {
      case "POST":
        getData(req, res);
        break;
      case "GET":
        loadCards(req, res);
        break;
      case "PUT":
        break;
      case "DELETE":
        break;
    }
  } else {
    fs.readFile("static" + url, function(error, data) {
      res.writeHead(200, {
        'Content-Type': contentType
      });
      res.write(data);
      res.end();
    })
  }
}).listen(8080);


console.log("Start serwera")

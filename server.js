var http = require("http");
var Datastore = require('nedb');
var fs = require("fs");
var path = require("path");
var qs = require("querystring");
var db = new Datastore({
	filename: 'data/database.db'
});
var port = Number(process.env.PORT || 3000);


function getData(req, res) {
	var allData = "";
	req.on("data", function(data) {
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

function updateCards(req, res) {
	var allData = "";
	req.on("data", function(data) {
		allData += data;
	})

	req.on("end", function(data) {
		var parsedJSON = JSON.parse(allData);
		db.update({
			_id: parsedJSON.uid
		}, {
			$set: parsedJSON.tempObj
		}, {}, function(err, numReplaced) {
			res.end();
		})
	})
}

function removeCard(req, res) {
	var allData = "";
	req.on("data", function(data) {
		allData += data;

	})

	req.on("end", function(data) {
		var parsedJSON = JSON.parse(allData);
		db.remove({
			_id: parsedJSON.uid
		}, {})
		res.end();
	})
}

db.loadDatabase();

http.createServer(function(req, res) {
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
		switch (req.method) {
			case "POST":
				getData(req, res);
				break;
			case "GET":
				loadCards(req, res);
				break;
			case "PUT":
				updateCards(req, res);
				break;
			case "DELETE":
				removeCard(req, res);
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
}).listen(port);


console.log("Start serwera")
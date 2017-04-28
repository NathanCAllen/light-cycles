var express = require('express');
var app = express();
var defualt_ELO = 1200; // subject to change
app.set('port', (process.env.PORT || 5000));
app.use(express.static('public'))
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


var bodyParser = require('body-parser'); 
var validator = require('validator');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var mongoUri = process.env.MONGODB_URI || process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/nodemongoexample';
var MongoClient = require('mongodb').MongoClient, format = require('util').format;
var db = MongoClient.connect(mongoUri, function(error, databaseConnection) {
	db = databaseConnection;
});

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


app.post("/register", function(request, response){
	//may want to beef up the security on this
	var username = resquest.body.username;
	var password = request.body.password;
	var new_player = {
		"username" : username,
		"password": password,
		"wins": 0,
		"losses": 0,
		"ELO": defualt_ELO, //Default ELO subject to change
		"record": [];
	};

	db.collection("player", function(error, coll){
		//check if username already takn
		db.collection.findOne({"username":username}, function(error, item){
			if (Object.keys(item).length != 0){
				response.send("username already taken");
			}
			else{
				db.collection.insert(new_player, function(error, update){
					response.send("succesfully registered!");
				});

			}
		});
	});

});

app.post("/login", function(request, response){
	var username = request.body.username;
	var password = request.body.password;
	db.collection("players", function(error, coll){
		if (error){
			console.log("Error: " + error);
			response.send(500);
		}
		else{
			db.collection.findOne({"username": username, "password": password}, function(error, item){
				if (item == null){
					//change this later to what we'll actually send
					response.send("account not found");
				}
				else{
					response.send("valid account")
				}
			});
		}
	});
});


app.get('/', function(request, response) {
//	response.set('Content-Type', 'text/html');
	respond.send("index.html")
});





app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
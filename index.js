var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

var default_ELO = 1200; // subject to change
var rooms = ["room1", "room2", "room3", "room4"];


app.set('port', (process.env.PORT || 5000));
app.use(express.static('public'))
var path = require('path');


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


var bodyParser = require('body-parser'); 
var validator = require('validator');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var mongoUri = process.env.MONGODB_URI || process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/nodemongoexample';
var MongoClient = require('mongodb').MongoClient, format = require('util').format;
var db = MongoClient.connect(mongoUri, function(error, databaseConnection) {
	db = databaseConnection;
});


//
app.get("/stats", function(request, response){
	db.collection("players", function(error, coll){
			if (error){
	 			console.log("Error: " + error);
				response.send(500);
	 		}
			coll.find().toArray(function(error, items){
				if (error){
	 				console.log("Error: " + error);
					response.send(500);
	 			}
				response.send( JSON.stringify(items));
			});
		});

});

app.post("/register", function(request, response){
	//may want to beef up the security on this
	var username = request.body.username;
	var password = request.body.password;
	var new_player = {
		"username" : username,
		"password": password,
		"wins": 0,
		"losses": 0,
		"ELO": default_ELO, //Default ELO subject to change
		"record": []
	};

	db.collection("players", function(error, coll){
		//check if username already takn
		coll.findOne({"username":username}, function(error, item){
			if (item != null){
				response.send("username already taken");
			}
			else{
				coll.insert(new_player, function(error, update){
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
			coll.findOne({"username": username, "password": password}, function(error, item){
				if (item == null){
					//change this later to what we'll actually send
					response.send("account not found");
				}
				else{
					//check for password
					response.send("valid account")
				}
			});
		}
	});
});

app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname + "/public/" + "index.html"));

});



/*
io.on('connection',function(socket){

    socket.on('newplayer',function(data){
    	var new_player = {
    		"id" : data.username,
    		"opp": "";
    		//x, y locations needs to be fixed
    		"x": 0,
    		"y": 0,
    		"socket": socket
    	}
    	//search for opponenets
		for ( i = 0; i < players.length; i++){
			if (players[i].opp = ""){
				new_player.opp = players[i];
				players[i].opp = new_player;
			}
		}
		players.push(new_player);
        socket.player = new_player;
        if (new_player.opp != ""){
        	socket.emit('opponenet', socket,.player.opp);

        	new_player.opp.socket.emit('found_player',socket.player); //change this to broadcast only to opponent
    	}

        socket.on('click',function(data){
            console.log('click to '+data.x+', '+data.y);
            socket.player.x = data.x;
            socket.player.y = data.y;
            io.emit('move',socket.player);
        });

        socket.on('disconnect',function(){
            io.emit('remove',socket.player.id);
        });
    });
});

*/

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
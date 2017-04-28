var express = require('express')
  , http = require('http');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);



var default_ELO = 1200; // subject to change

server.listen(8080, function(){
	console.log("local server running");
});


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
app.get("/global-stats", function(request, response){
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
		"ELO": [default_ELO], //Default ELO subject to change
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
	console.log("in login");
	console.log("username is " + request.body.username);
	console.log("username is " + request.body.password);
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
					response.send("username or password incorrect; try again");
				}
				else{
					//check for password
					response.sendFile(path.join(__dirname + "/private/" + "waiting-room.html"))
				}
			});
		}
	});
});

app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname + "/public/" + "index.html"));

});


function insert_room(arr, room){
	for (i = 0; i < arr.length; i++){
		if (room < arr[i]){
			arr.splice(i,0,room);
			return;
		}
	}
	arr.push(room);
}
var empty_rooms = ["room1", "room2", "room3", "room4"];
var waiting_rooms = [];
var full_rooms = [];

io.on('connection',function(socket){

    socket.on('newplayer',function(data){
    	console.log("in new_player server_side");
    	console.log("data is " + data);
    	var room = "";
    	var player = {
    		"id" : data, //this might just be data, not data.username

    		/* neccesary user data goes here---TBD */
    		"room": room
    	}

    	//if waiting opponent, place into game
		if (waiting_rooms.length != 0){
			room = waiting_rooms[0];
		//	socket.join(room);
			//write this insertion function to insert it in order
		//	insert_room(full_rooms, room);
			full_rooms.push(room);
			player.room = room;
			waiting_rooms.splice(0,1);
			socket.broadcast.to(room).emit('opponent found');
			socket.emit("opponent found")
		}
		//if no waiting rooms, place inton empty rooms
		else{
			console.log("sending waiting client side");
			socket.emit("waiting");
			//if no empty rooms, make one
			if (empty_rooms.length = 0){
				//possibly make this better than adding one at a time, temp fix
				num = waiting_rooms.length + full_rooms.length;
				empty_rooms[0] = "room" + num;
			}
			else{
				room = empty_rooms[0];
			//	insert(waiting_rooms, room);
				waiting_rooms.push
				empty_rooms.splice(0,1);
			}
		}
		player.room = room;
		socket.player = player;
		socket.join(room);


	});
 	//lol who knows how gameplay will work fuck everything
   

  /*  socket.on('disconnect',function(){
    	//maybe add something to this to prevent proliferation of rooms; not an essential add

        //if waiting and not in-game
        if (waiting_rooms.indexOf(player.room) != -1){
        	room = waiting_rooms.indexOf(player.room);
        	waiting_rooms.splice(waiting_rooms.indexOf(player.room), 1);
        	insert_room(empty_rooms, room))
        }
        //else if in-game
        else{
        	room = full_rooms.indexOf(player.room);
        	full_rooms.splice(full_rooms.indexOf(player.room), 1);
        	insert_room(empty_rooms, room)
        }
		socket.broadcast.to(room).emit('forfeit');
*/
});



app.listen(process.env.PORT, function(){});

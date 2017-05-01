
var express = require('express')
  , http = require('http');

 var app = express();

 var server = http.createServer(app);

 var io = require('socket.io').listen(server);


var path = require('path');


app.use(express.static('public'));
app.use(express.static("phaser_phun"));


 // server.listen(8080, function(){
 // 	console.log("local server running");
 // });

  server.listen(process.env.PORT, function(){
 	console.log("non-local server running");
 });





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


app.post("/matchmake", function(request, response){
	response.sendFile(path.join(__dirname + "/phaser_phun/" + "game.html"));
});
app.post("/global-stats", function(request, response){
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

var default_ELO = 1200; // subject to change

app.post("/register", function(request, response){
	//may want to beef up the security on this
	var username = request.body.user;
	var password = request.body.pwd;
	console.log("in register");
	console.log("username is " + username);
	console.log("passwrd is " + password);
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
			console.log("searched username is " + JSON.stringify(item));
			if (item != null){

					response.sendFile(path.join(__dirname + "/public/" + "registration-failed.html"))
			}
			else{
				coll.insert(new_player, function(error, update){
					response.sendFile(path.join(__dirname + "/public/" + "registration-success.html"))
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
					response.sendFile(path.join(__dirname + "/public/" + "login-incorrect.html"))
				}
				else{
					response.sendFile(path.join(__dirname + "/phaser_phun/" + "game.html"))
				}
			});
		}
	});
});

app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname + "/public/" + "home.html"));

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
    		"id" : data, 

    		/* neccesary user data goes here---TBD */
    		"room": room
    	}

    	//if waiting opponent, place into game
		if (waiting_rooms.length != 0){
			room = waiting_rooms[0];
			insert_room(full_rooms, room);
			waiting_rooms.splice(0,1);

			player.room = room;
			socket.player = player;
			socket.join(room);
			var start_time = new Date().getTime();
			start_time = start_time + 10000;
			io.sockets.in(room).emit("start", a);			
		}
		//if no waiting rooms, place  empty rooms
		else{

			//if no empty rooms, make one
			if (empty_rooms.length == 0){
				//possibly make this better than adding one at a time, temp fix
				num = waiting_rooms.length + full_rooms.length;
				empty_rooms[0] = "room" + num;
			}
			else{
				room = empty_rooms[0];
				insert_room(waiting_rooms, room);
				empty_rooms.splice(0,1);
			}
			player.room = room;
			socket.player = player;
			socket.join(room);

		}
		console.log("number or players in room " + room + " is  " + io.sockets.adapter.rooms[room].length);


	});

 	//lol who knows how gameplay will work fuck everything
   
 	socket.on('left', function(){
 		socket.broadcast.to(socket.player.room).emit('right');

 	});

 	socket.on('right', function(){
 		socket.broadcast.to(socket.player.room).emit('left');

 	});

 	socket.on('up', function(){
 		socket.broadcast.to(socket.player.room).emit('up');

 	});

 	socket.on('down', function(){
 		socket.broadcast.to(socket.player.room).emit('down');

 	});

 	// socket.on('win', function(){

 	// });
    socket.on('disconnect',function(player){
    	//maybe add something to this to prevent proliferation of rooms; not an essential add

        //if waiting and not in-game
        room = player.room;
        if (waiting_rooms.indexOf(player.room) != -1){
        	waiting_rooms.splice(waiting_rooms.indexOf(player.room), 1);
        	insert_room(empty_rooms, room)
        }
        //else if in-game
        else{
        	full_rooms.splice(full_rooms.indexOf(player.room), 1);
        	insert_room(empty_rooms, room)
        }
		socket.broadcast.to(room).emit('forfeit');
		socket.leave(room);

	});
});




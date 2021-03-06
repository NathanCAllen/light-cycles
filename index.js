
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
 	console.log("Heroku server running");
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
	var new_player = {
		"username" : username,
		"password": password,
		"wins": 0,
		"losses": 0,
		"games_played":0,
		"ELO": [default_ELO],
		"record": []
	};
	old_username = username.replace(/[^\w\s]/gi, '');

	//If the username has special characters
	if (old_username != username){
		response.sendFile(path.join(__dirname + "/public/" + "registration-failed.html"));
	}
	else{ 
		db.collection("players", function(error, coll){
		//check if username already takn
			coll.findOne({"username":username}, function(error, item){
				if (item != null){
					response.sendFile(path.join(__dirname + "/public/" + "registration-failed.html"));
				}
				else{
					coll.insert(new_player, function(error, update){
						response.sendFile(path.join(__dirname + "/public/" + "registration-success.html"));
					});

				}
			});
		});
	}

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
					response.sendFile(path.join(__dirname + "/public/" + "login-incorrect.html"))
				}
				else{
					response.sendFile(path.join(__dirname + "/public/" + "waiting.html"))
				}
			});
		}
	});
});

app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname + "/public/" + "home.html"));

});

app.post("/player-stats", function(request, response) {
	var username = request.body.username;
	db.collection("players", function(error, coll){
		if (error) {
			console.log("Error: " + error);
			response.send(500);
		}
		else {
			coll.findOne({"username":username}, function(error, item) {
				if (item == null) {
					response.send("this shouldn't be possible");
				}
				else {
					response.send(JSON.stringify(item));
				}
			})
		}
	});
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

var empty_rooms = ["Room 0", "Room 1","Room 2", "Room 3", "Room 4", "Room 5", "Room 6", "Room 7", "Room 8", "Room 9", "Room 10"];
var waiting_rooms = [];
var full_rooms = [];
io.on('connection',function(socket){

    setInterval(function(){
        send_moves(socket);
    }, 120);

	function send_moves(socket){
		//if the player has not been initalized OR not player1
		if (!socket.player){
			return;
		}
		if (!socket.player.player1){
			return;
		}
		var moves = {"my_move": socket.player.p1_move, "their_move": socket.player.p2_move};

		socket.emit("execute_move", moves);
		moves.my_move = socket.player.p2_move;
		moves.their_move = socket.player.p1_move;

	 	socket.broadcast.to(socket.player.room).emit('execute_move', moves);
	}

    socket.on('newplayer',function(data){
    	var player = {
    		"id" : data, 
    		"player1": false,
    		"p1_move": "",
    		"p2_move": "",
    		"room": ""
    	}


    	//search for people waiting in game
    	if (waiting_rooms.length != 0){
    		player.room = waiting_rooms[0];
    		waiting_rooms.splice(0,1);
    		insert_room(full_rooms, player.room);
    		socket.join(player.room);
    		io.sockets.in(player.room).emit("start", player.room);			
    			
    		
    	}

    	//enter an empty room
    	else {
     		player.player1 = true;

    		if (empty_rooms.length != 0){
    			player.room = empty_rooms[0];
    			empty_rooms.splice(0,1);
    			insert_room(waiting_rooms, player.room);
    			socket.join(player.room);

    		}
    	
    		//if all rooms are full
    		if (player.room == ""){
    			var new_room = "Room " + (waiting_rooms.length + full_rooms.length);
    			player.room = new_room;
    			waiting_rooms.push(new_room);
    			socket.join(new_room);
    		}
    	}
    	socket.player = player;


	});

   
 	socket.on('my_move', function(move){
 		if (socket.player){
 			if (socket.player.player1){
 				socket.player.p1_move = move;
 			}
 			else{
 				socket.broadcast.to(socket.player.room).emit('bounce_move', move);
 			}
 		}
 		

 	});

 	socket.on('opp_move', function(move){
 		if(socket.player){
			if (socket.player.player1){
 				socket.player.p2_move = move;
 			}
 			else{
 				console.log("this shouldn't be happening");
 			}
 	}
 	});

 	
 	socket.on("draw", function(){
 		leave_room(socket);
	 		db.collection("players", function(error, coll){
			
	 		coll.findOne({"username": socket.player.id}, function(error, playr){
				if (playr){
	 				playr.record.push("draw");
	 				playr.games_played = playr.games_played + 1;
	 				coll.update({"username" : socket.player.id}, playr, function(error, updates){
				
	 				});
	 			}
	 		});
	 	});

 	});
 	

 	 socket.on('win', function(){
 	 	leave_room(socket);
 	 	db.collection("players", function(error, coll){
			
	 		coll.findOne({"username": socket.player.id}, function(error, playr){
				if (playr){
	 				playr.record.push("win");
	 				playr.games_played = playr.games_played + 1;
	 				playr.wins = playr.wins + 1;
	 				playr.ELO.push(playr.ELO[playr.ELO.length - 1] + 50);
	 				coll.update({"username" : socket.player.id}, playr, function(error, updates){
				
	 				});
	 			}
	 		});
	 	});
 	 });

 	 socket.on("lose", function(){
		leave_room(socket); 	
		db.collection("players", function(error, coll){
			
	 		coll.findOne({"username": socket.player.id}, function(error, playr){
				if (playr){
	 				playr.record.push("lose");
	 				playr.games_played = playr.games_played + 1;
	 				playr.losses = playr.losses + 1;
	 				playr.ELO.push(playr.ELO[playr.ELO.length - 1] - 50);
	 				coll.update({"username" : socket.player.id}, playr, function(error, updates){
				
	 				});
	 			}
	 		});
	 	});
 	 });
    socket.on('disconnect',function(){
    	leave_room(socket);


	});

	function leave_room(socket){

		if (socket.player){
			room = socket.player.room;
			if (room != ""){

					if(waiting_rooms.indexOf(room) != -1){
						waiting_rooms.splice(waiting_rooms.indexOf(room), 1);
						insert_room(empty_rooms, room);
					}
					else if (full_rooms.indexOf(room) != -1){
						full_rooms.splice(full_rooms.indexOf(room), 1);
						insert_room(empty_rooms, room);
					}
					socket.leave(room);
					socket.player.room = "";

				
			}
		}
	}
	
});




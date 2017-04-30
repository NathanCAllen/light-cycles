var Client = {};
Client.socket = io.connect();
var username = "Janet";
var pink = "pinky";
console.log("sending new_player from client");
Client.socket.emit('newplayer', username);


Client.socket.on("waiting", function(){
	 console.log("pink is " + pink);
	console.log("in waiting client_side");
});

Client.socket.on("lol bud", function(){
	console.log("don't ever, ever tweet");
});

Client.socket.on("opponent found", function(){
	console.log("opp found, don't print");
});



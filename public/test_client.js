var Client = {};
Client.socket = io.connect();
var username = "Janet";
console.log("sending new_player from client");
Client.socket.emit('newplayer', username);


Client.socket.on("waiting", function(){
	console.log("in waiting client_side");
});
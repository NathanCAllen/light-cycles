var game = new Phaser.Game(720, 720, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
	game.load.image('player','res/player.png');
}

function create() {
	players = game.add.group();
	createPlayer();
}

function update() {
}

function createPlayer(){
	var player = players.create(0,0, 'player');
}
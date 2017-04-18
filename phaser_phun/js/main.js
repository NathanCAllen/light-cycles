var game = new Phaser.Game(1080, 720, Phaser.AUTO, '');

console.log("Let's start the party!");

var LightBikes = function (game) {

	console.log("Pizza Party");
	this.map = null;
	this.layer = null;
	this.car = null;

	this.safetile = 1;
	this.gridsize = 32;

	this.speed = 150;
	this.threshold = 3;
	this.turnSpeed = 100;

	this.marker = new Phaser.Point();
	this.turnPoint = new Phaser.Point();

	this.directions = [null, null, null, null, null];
	this.opposites = [Phaser.NONE, Phaser.RIGHT, Phaser.LEFT, Phaser.DOWN, Phaser.UP];

	this.current = Phaser.UP;
	this.turning = Phaser.NONE;
};

LightBikes.prototype = {

	init: function () {
		console.log("Init Party");
		this.physics.startSystem(Phaser.Physics.ARCADE);
	},

	preload: function() {
		console.log("Preload Party");
		this.load.crossOrigin = 'anonymous';
		this.load.image('player','res/player.png');
		this.load.tilemap('map', 'res/Board1.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.image('tile', 'res/Tile.png')
		// this.load.image('enemy', 'res/enemy.png');
	},

	create: function() {
		this.map = this.add.tilemap('map');
		console.log("Create Party");
		this.map.addTilesetImage('Tile','tile');

		this.layer = this.map.createLayer('Tile Layer 1');

		this.map.setCollision(1, true, this.layer); //set edges as collision

		this.player = this.add.sprite(32, 32, 'player');
		// this.player.anchor.set(0.5);

		// this.physics.arcade.enable(this.player);

		this.cursors = this.input.keyboard.createCursorKeys();

		// this.move(Phaser.DOWN);
	}

	// function update() {
	// }

	// function createPlayer(){
	// 	var player = players.create(0,0, 'player');
	// }
};

game.state.add('Game', LightBikes, true);
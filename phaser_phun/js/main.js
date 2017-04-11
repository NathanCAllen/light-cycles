var game = new Phaser.Game(1080, 720, Phaser.AUTO, 'light-bikes');

var LightBikes = function (light-bikes) {
	this.map = null
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
		this.physics.startSystem(Phaser.Physics.ARCADE);
	},

	preload: function() {
		this.load.crossOrigin = 'anonymous';
		game.load.image('player','res/player.png');
		game.load.tilemap('map', 'res/Board1.json', null, Phaser.Tilemap.TILED_JSON);
	},

	create: function() {
		
	}

	function update() {
	}

	function createPlayer(){
		var player = players.create(0,0, 'player');
	}
};
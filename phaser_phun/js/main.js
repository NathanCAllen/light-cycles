var game = new Phaser.Game(320, 320, Phaser.CANVAS, '');

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

	this.next = Phaser.NONE;
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

		this.car = this.add.sprite(16, 16, 'player');
		this.car.anchor.set(0.5);

		this.physics.arcade.enable(this.car);

		this.cursors = this.input.keyboard.createCursorKeys();

		// this.move(Phaser.DOWN);
	},

	checkKeys: function () {

		// console.log("Check Key Party");

		if (this.cursors.left.isDown && this.current !== Phaser.LEFT) {
			console.log("Left Party");
			// this.checkDirection(Phaser.LEFT);
			// this.move(Phaser.LEFT);
			this.next = Phaser.LEFT;
		} else if (this.cursors.right.isDown && this.current !== Phaser.RIGHT) {
			console.log("Right Party");
			// this.checkDirection(Phaser.RIGHT);
			// this.move(Phaser.RIGHT);
			this.next = Phaser.RIGHT;
		} else if (this.cursors.up.isDown && this.current !== Phaser.UP) {
			console.log("Up Party");
			// this.checkDirection(Phaser.UP);
			// this.move(Phaser.UP);
			this.next = Phaser.UP;
		} else if (this.cursors.down.isDown && this.current !== Phaser.DOWN) {
			console.log("Down Party");
			// this.checkDirection(Phaser.DOWN);
			// this.move(Phaser.DOWN);
			this.next = Phaser.DOWN;
		} else {
			//  This forces them to hold the key down to turn the corner
			this.turning = Phaser.NONE;
		}

        },

        checkDirection: function (turnTo) {

		if (this.turning === turnTo || this.directions[turnTo] === null || this.directions[turnTo].index !== this.safetile)
		{
			//  Invalid direction if they're already set to turn that way
			//  Or there is no tile there, or the tile isn't index a floor tile
			return;
		}

		//  Check if they want to turn around and can
		if (this.current === this.opposites[turnTo])
		{
			this.move(turnTo);
		}
		else
		{
			this.turning = turnTo;

			this.turnPoint.x = (this.marker.x * this.gridsize) + (this.gridsize / 2);
			this.turnPoint.y = (this.marker.y * this.gridsize) + (this.gridsize / 2);
		}

        },

        turn: function () {

		var cx = Math.floor(this.car.x);
		var cy = Math.floor(this.car.y);

		//  This needs a threshold, because at high speeds you can't turn because the coordinates skip past
		if (!this.math.fuzzyEqual(cx, this.turnPoint.x, this.threshold) || !this.math.fuzzyEqual(cy, this.turnPoint.y, this.threshold))
		{
			return false;
		}

		this.car.x = this.turnPoint.x;
		this.car.y = this.turnPoint.y;

		this.car.body.reset(this.turnPoint.x, this.turnPoint.y);

		this.move(this.turning);

		this.turning = Phaser.NONE;

		return true;

        },

        move: function (direction) {

		var speed = this.speed;

		if (direction === Phaser.LEFT || direction === Phaser.UP)
		{
			speed = -speed;
		}

		if (direction === Phaser.LEFT || direction === Phaser.RIGHT)
		{
			this.car.body.velocity.y = 0;
			this.car.body.velocity.x = speed;
		}
		else
		{
			this.car.body.velocity.x = 0;
			this.car.body.velocity.y = speed;
		}

		this.add.tween(this.car).to( { angle: this.getAngle(direction) }, this.turnSpeed, "Linear", true);

		this.current = direction;

        },

        getAngle: function (to) {

		if (this.current === this.opposites[to])
		{
			return "180";
		}

		if ((this.current === Phaser.UP && to === Phaser.LEFT) ||
		 (this.current === Phaser.DOWN && to === Phaser.RIGHT) ||
		 (this.current === Phaser.LEFT && to === Phaser.DOWN)  ||
		 (this.current === Phaser.RIGHT && to === Phaser.UP))
		{
			return "-90";
		}

		return "90";

        },

        update: function () {
        	this.physics.arcade.collide(this.car, this.layer);

        	this.checkKeys();

        	if ((this.car.x + 16) % 32 == 0 && (this.car.y + 16) % 32 == 0 && this.current !== this.next && this.next !== Phaser.NONE) {
        		this.move(this.next);
        	};

 	        this.marker.x = this.math.snapToFloor(Math.floor(this.car.x), this.gridsize) / this.gridsize;
            	this.marker.y = this.math.snapToFloor(Math.floor(this.car.y), this.gridsize) / this.gridsize;

		//  Update our grid sensors
		// this.directions[1] = this.map.getTileLeft(this.layer.index, this.marker.x, this.marker.y);
		// this.directions[2] = this.map.getTileRight(this.layer.index, this.marker.x, this.marker.y);
		// this.directions[3] = this.map.getTileAbove(this.layer.index, this.marker.x, this.marker.y);
		// this.directions[4] = this.map.getTileBelow(this.layer.index, this.marker.x, this.marker.y);

        	if (this.turning !== Phaser.NONE) {
        		this.turn();
        	};

        }
};

game.state.add('Game', LightBikes, true);
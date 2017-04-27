var game = new Phaser.Game(640, 640, Phaser.CANVAS, '');

console.log("Let's start the party!");

var LightBikes = function (game) {

	console.log("Pizza Party");
	this.map = null;
	this.layer = null;
	this.car = null;

	this.safetile = 1;
	this.gridsize = 32;

	this.speed = 16;
	this.threshold = 3;
	this.turnSpeed = 100;

	this.lastUpdate = 0;

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
		this.load.image('player','res/sprite.png');
		this.load.tilemap('map', 'res/Tilemap.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.image('tile', 'res/Tileset2.png')
		this.load.image('enemy', 'res/enemy.png');
	},

	create: function() {
		this.map = this.add.tilemap('map');
		console.log("Create Party");
		this.map.addTilesetImage('Tileset2','tile');

		this.layer = this.map.createLayer('Tile Layer 1');

		this.map.setCollision(1, true, this.layer); //set edges as collision

		// this.car = this.add.sprite(250, 250, 'player');
		this.car = [];
		this.car.push(this.add.sprite(48, 0, 'player'));
		this.increaseLength();
		this.car[0].anchor.set(0);

		this.physics.arcade.enable(this.car[0]);

		this.cursors = this.input.keyboard.createCursorKeys();

		this.move(Phaser.DOWN);
	},

	increaseLength: function () {
		var tail = this.add.sprite(48, 0, 'player');
		this.physics.arcade.enable(tail);
		this.car.push(tail);
	},

	checkKeys: function () {

		// console.log("Check Key Party");

		if (this.cursors.left.isDown && this.next !== Phaser.RIGHT) {
			console.log("Left Party");
			// this.checkDirection(Phaser.LEFT);
			// this.move(Phaser.LEFT);
			this.next = Phaser.LEFT;
		} else if (this.cursors.right.isDown && this.next !== Phaser.LEFT) {
			console.log("Right Party");
			// this.checkDirection(Phaser.RIGHT);
			// this.move(Phaser.RIGHT);
			this.next = Phaser.RIGHT;
		} else if (this.cursors.up.isDown && this.next !== Phaser.DOWN) {
			console.log("Up Party");
			// this.checkDirection(Phaser.UP);
			// this.move(Phaser.UP);
			this.next = Phaser.UP;
		} else if (this.cursors.down.isDown && this.next !== Phaser.UP) {
			console.log("Down Party");
			// this.checkDirection(Phaser.DOWN);
			// this.move(Phaser.DOWN);
			this.next = Phaser.DOWN;
		} else {
			//  This forces them to hold the key down to turn the corner
			this.turning = Phaser.NONE;
		}

        },

  //       checkDirection: function (turnTo) {

		// if (this.turning === turnTo || this.directions[turnTo] === null || this.directions[turnTo].index !== this.safetile)
		// {
		// 	//  Invalid direction if they're already set to turn that way
		// 	//  Or there is no tile there, or the tile isn't index a floor tile
		// 	return;
		// }

		// //  Check if they want to turn around and can
		// if (this.current === this.opposites[turnTo])
		// {
		// 	this.move(turnTo);
		// }
		// else
		// {
		// 	this.turning = turnTo;

		// 	this.turnPoint.x = (this.marker.x * this.gridsize) + (this.gridsize / 2);
		// 	this.turnPoint.y = (this.marker.y * this.gridsize) + (this.gridsize / 2);
		// }

  //       },

  //       turn: function () {

		// var cx = Math.floor(this.car.x);
		// var cy = Math.floor(this.car.y);

		// //  This needs a threshold, because at high speeds you can't turn because the coordinates skip past
		// if (!this.math.fuzzyEqual(cx, this.turnPoint.x, this.threshold) || !this.math.fuzzyEqual(cy, this.turnPoint.y, this.threshold))
		// {
		// 	return false;
		// }

		// this.car.x = this.turnPoint.x;
		// this.car.y = this.turnPoint.y;

		// this.car.body.reset(this.turnPoint.x, this.turnPoint.y);

		// this.move(this.turning);

		// this.turning = Phaser.NONE;

		// return true;

  //       },

        move: function (direction) {

		var speed = this.speed;

		if (direction === Phaser.LEFT || direction === Phaser.UP)
		{
			speed = -speed;
		}

		if (direction === Phaser.LEFT || direction === Phaser.RIGHT)
		{
			// this.car.body.velocity.y = 0;
			// this.car.body.velocity.x = speed;
			this.car[0].x += speed;
		}
		else
		{
			// this.car.body.velocity.x = 0;
			// this.car.body.velocity.y = speed;
			this.car[0].y += speed;
		}

		// this.add.tween(this.car).to( { angle: this.getAngle(direction) }, this.turnSpeed, "Linear", true);

		this.increaseLength();

		this.moveTrain();

		this.current = direction;

        },

        moveTrain: function () {
        	var oldX, oldY;
		for(var i = 0; i < this.car.length; i++) {
			var x = this.car[i].x;
			var y = this.car[i].y;
			if(i != 0) {
				this.car[i].x = oldX;
				this.car[i].y = oldY;
			}

			oldX = x;
			oldY = y;
		}
        },

  //       getAngle: function (to) {

		// if (this.current === this.opposites[to])
		// {
		// 	return "180";
		// }

		// if ((this.current === Phaser.UP && to === Phaser.LEFT) ||
		//  (this.current === Phaser.DOWN && to === Phaser.RIGHT) ||
		//  (this.current === Phaser.LEFT && to === Phaser.DOWN)  ||
		//  (this.current === Phaser.RIGHT && to === Phaser.UP))
		// {
		// 	return "-90";
		// }

		// return "90";

  //       },

        getTimeStamp: function () {
        	return new Date().getTime();
        },

        checkBoundaries: function () {
        	if(this.car[0].x >= this.width || this.car[0].x < 0) {
			this.gameOver("You ");
		}
		if(this.car[0].y >= this.height || this.car[0].y < 0) {
			this.gameOver("You ");
		}
        },

        checkCollideSelf: function () {
		for(var i = 2; i < this.car.length; i++) {
			if(this.car[0].body.hitTest(this.car[i].x, this.car[i].y)) {
				// console.log(i);
				this.gameOver("You ");
			}
		}

        },

        update: function () {

        	// this.addTrail();

        	// this.car[0].body.collideWorldBounds = true;

        	this.checkCollideSelf();

        	if ((this.getTimeStamp() - this.lastUpdate) < 100) {
        		// console.log("Steady now");
        		return;
        	};

        	this.checkBoundaries();


        	this.physics.arcade.collide(this.car[0], this.layer);

        	// if (this.car.body.velocity.y == 0 && this.car.body.velocity.x == 0) {
        	// 	this.gameOver("You ");
        	// };

        	this.checkKeys();

        	// console.log("go go jo");

        	this.lastUpdate = new Date();

        	// console.log(this.car.x, this.car.y);

        	if (/*this.current !== this.next && this.next !== Phaser.NONE*/ true) {
        		this.move(this.next);
        	};

 	        // this.marker.x = this.math.snapToFloor(Math.floor(this.car[0].x), this.gridsize) / this.gridsize;
          //   	this.marker.y = this.math.snapToFloor(Math.floor(this.car[0].y), this.gridsize) / this.gridsize;

		//  Update our grid sensors
		// this.directions[1] = this.map.getTileLeft(this.layer.index, this.marker.x, this.marker.y);
		// this.directions[2] = this.map.getTileRight(this.layer.index, this.marker.x, this.marker.y);
		// this.directions[3] = this.map.getTileAbove(this.layer.index, this.marker.x, this.marker.y);
		// this.directions[4] = this.map.getTileBelow(this.layer.index, this.marker.x, this.marker.y);

        	if (this.turning !== Phaser.NONE) {
        		this.turn();
        	};

        },

        gameOver: function (loser) {
        	game.paused = true;
		var style = {fill: '#F00'};
		var text = this.add.text(game.width * .5, game.height * .5, "Game Over", style);
		text.anchor.set(.5, .5);
        },

        addTrail: function() {
        	var origin_x, origin_y, width, height;
        	console.log(this.current);
        	if (this.current == Phaser.UP) {
        		height = 2;
        		width = 16;
        		origin_y = this.car.y + 25;
        		origin_x = this.car.x - 8;
        	} else if (this.current == Phaser.DOWN) {
        		height = 2;
        		width = 16;
        		origin_y = this.car.y - 26;
        		origin_x = this.car.x - 8;
        	} else if (this.current == Phaser.LEFT) {
        		height = 16;
        		width = 2;
        		origin_y = this.car.y - 8;
        		origin_x = this.car.x + 25;        		
        	} else {
        		height = 16;
        		width = 2;
        		origin_y = this.car.y - 8;
        		origin_x = this.car.x + 26;        		
        	}
		// this.map.putTile(1, origin_x, origin_y);

		// var tiles = this.map.tiles;
		// tiles[origin_x * width + origin_y] = 1;
		// this.map.tiles[origin_x * width + origin_y] = 1;
		// console.log(this.map.layers[0].data[origin_x * width + origin_y]);

		// console.log(origin_x, origin_y);

		// for (var i = 0; i < width; i++) {
		// 	for (var j = 0; j < height; j++) {
		// 		console.log("Tile Party");
		// 		this.map.getTile(origin_x + i, origin_y + j).index = 1;
		// 		this.map.getTile(origin_x + i, origin_y + j).canCollide = true;
		// 	};
		// };
        }
};

game.state.add('Game', LightBikes, true);
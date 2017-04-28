var game = new Phaser.Game(640, 640, Phaser.CANVAS, '');

console.log("Let's start the party!");

var LightBikes = function (game) {

	console.log("Pizza Party");
	this.map = null;
	this.layer = null;
	this.car = null;
	this.enemy = null;

	this.width = 640;
	this.height = 640;

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
		this.enemy = [];
		this.enemy.push(this.add.sprite(240, 0, 'enemy'));
		this.increaseLength(this.car);
		this.increaseLength(this.enemy);
		this.car[0].anchor.set(0);
		this.enemy[0].anchor.set(0);

		this.physics.arcade.enable(this.car[0]);
		this.physics.arcade.enable(this.enemy[0]);

		this.cursors = this.input.keyboard.createCursorKeys();

		this.move(this.car, Phaser.DOWN);
		this.move(this.enemy, Phaser.DOWN)
	},

	increaseLength: function (player) {
		if (player == this.car) {
			var tail = this.add.sprite(48, 0, 'player');
		} else {
			var tail = this.add.sprite(240, 0, 'enemy');
		}
		this.physics.arcade.enable(tail);
		player.push(tail);
	},

	checkKeys: function (player) {

		if (this.cursors.left.isDown && player.next !== Phaser.RIGHT) {
			console.log("Left Party");
			player.next = Phaser.LEFT;
		} else if (this.cursors.right.isDown && player.next !== Phaser.LEFT) {
			console.log("Right Party");
			player.next = Phaser.RIGHT;
		} else if (this.cursors.up.isDown && player.next !== Phaser.DOWN) {
			console.log("Up Party");
			player.next = Phaser.UP;
		} else if (this.cursors.down.isDown && player.next !== Phaser.UP) {
			console.log("Down Party");
			player.next = Phaser.DOWN;
		} else {
			//  This forces them to hold the key down to turn the corner
			this.turning = Phaser.NONE;
		}
        },

	enemyMovement: function () {

		// if (this.cursors.left.isDown && player.next !== Phaser.RIGHT) {
		// 	console.log("Left Party");
		// 	player.next = Phaser.LEFT;
		// } else if (this.cursors.right.isDown && player.next !== Phaser.LEFT) {
		// 	console.log("Right Party");
		// 	player.next = Phaser.RIGHT;
		// } else if (this.cursors.up.isDown && player.next !== Phaser.DOWN) {
		// 	console.log("Up Party");
		// 	player.next = Phaser.UP;
		// } else if (this.cursors.down.isDown && player.next !== Phaser.UP) {
		// 	console.log("Down Party");
		// 	player.next = Phaser.DOWN;
		// } else {
		// 	//  This forces them to hold the key down to turn the corner
		// 	this.turning = Phaser.NONE;
		// }
        },

        move: function (player, direction) {

		var speed = this.speed;

		if (direction === Phaser.LEFT || direction === Phaser.UP)
		{
			speed = -speed;
		}

		if (direction === Phaser.LEFT || direction === Phaser.RIGHT)
		{
			player[0].x += speed;
		}
		else
		{
			player[0].y += speed;
		}

		this.increaseLength(player);

		this.moveTrain(player);

		this.current = direction;

        },

        moveTrain: function (player) {
        	var oldX, oldY;
		for(var i = 0; i < player.length; i++) {
			var x = player[i].x;
			var y = player[i].y;
			if(i != 0) {
				player[i].x = oldX;
				player[i].y = oldY;
			}

			oldX = x;
			oldY = y;
		}
        },

        getTimeStamp: function () {
        	return new Date().getTime();
        },

        checkBoundaries: function (player) {
        	if(player[0].x >= this.width - 1 || player[0].x < 0) {
			this.gameOver("You ");
		}
		if(player[0].y >= this.height - 1 || player[0].y < 0) {
			this.gameOver("You ");
		}
        },

        checkCollideSelf: function (player) {
		for(var i = 2; i < player.length; i++) {
			if(player[0].body.hitTest(player[i].x, player[i].y)) {
				// console.log(i);
				this.gameOver("You ");
			}
		}

        },

        update: function () {

        	this.checkCollideSelf(this.car);
        	this.checkCollideSelf(this.enemy);

        	if ((this.getTimeStamp() - this.lastUpdate) < 100) {
        		// console.log("Steady now");
        		return;
        	};

        	this.checkBoundaries(this.car);
        	this.checkBoundaries(this.enemy);

        	this.physics.arcade.collide(this.car[0], this.layer);
        	this.physics.arcade.collide(this.enemy[0], this.layer);

        	this.checkKeys(this.car);

        	this.enemyMovement();

        	this.lastUpdate = new Date();

       		this.move(this.car, this.car.next);

       		this.move(this.enemy, this.enemy.next);

        	if (this.turning !== Phaser.NONE) {
        		this.turn();
        	};

        },

        gameOver: function (loser) {
        	game.paused = true;
		var style = {fill: '#F00'};
		var text = this.add.text(game.width * .5, game.height * .5, "Game Over", style);
		text.anchor.set(.5, .5);
        }
};

game.state.add('Game', LightBikes, true);
var game = new Phaser.Game(640, 640, Phaser.AUTO, '');

console.log("Let's start the party!");

var Client = {};
Client.socket = io.connect();
var username = localStorage.getItem("username");

var LightBikes = function (game) {

        console.log("Pizza Party");
        this.map = null;
        this.layer = null;
        this.bike = null;
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

                this.bike = [];
                this.bike.push(this.add.sprite(160, 320, 'player'));
                this.enemy = [];
                this.enemy.push(this.add.sprite(464, 320, 'enemy'));
                this.bike[0].anchor.set(0);
                this.enemy[0].anchor.set(0);

                this.physics.arcade.enable(this.bike[0]);
                this.physics.arcade.enable(this.enemy[0]);

                this.cursors = this.input.keyboard.createCursorKeys();

                this.enemyMovement();
                game.paused = true;
                console.log("right before newplayer sent");
                Client.socket.emit('newplayer', username);
                console.log("right after new player sent");
                Client.socket.on("start", function(room){
                    console.log("in start and your room is " + room);
                    $("#status").html("<legend>Status</legend> <p> Opponent Found! You are in " + room + 
                    " Please wait a few second for their"+
                    "game to load and remember to click on the board. " )
                    game.paused = false;
                });

                console.log("end o create");

                this.checkKeys();
        },

        getFirstMove: function() {
                this.bike.next = -1;
                while (this.bike.next == -1) {
                        this.checkKeys();
                }
        },

        increaseLength: function (player) {
                var x = player[0].x;
                var y = player[0].y;
                if (player == this.bike) {
                        var tail = this.add.sprite(x, y, 'player');
                } else {
                        var tail = this.add.sprite(x, y, 'enemy');
                }
                this.physics.arcade.enable(tail);
                player.push(tail);
        },

        checkKeys: function () {

                var player = this.bike;

                document.addEventListener('keydown', function (event) {
                        if (event.key == "ArrowUp" && this.current != Phaser.DOWN) {
                                Client.socket.emit("my_move", "up");
                                player.next = Phaser.UP; 
                        } else if (event.key == "ArrowDown" && this.current != Phaser.UP) {
                                Client.socket.emit("my_move", "down");
                                player.next = Phaser.DOWN; 
                        } else if (event.key == "ArrowLeft" && this.current != Phaser.RIGHT) {
                                Client.socket.emit("my_move", "left");
                                player.next = Phaser.LEFT; 
                        } else if (event.key == "ArrowRight" && this.current != Phaser.LEFT) {
                                Client.socket.emit("my_move", "right");
                                player.next = Phaser.RIGHT; 
                        }
                });

                console.log("checkKeys ran");
        },

        enemyMovement: function () {

                Client.socket.on("bounce_move", function (move) {
                        Client.socket.emit("opp_move", move);
                });

                var g = this;

                Client.socket.on("execute_move", function (moves) {
                        if (game.paused) {
                                return;
                        }

                        var move = moves.my_move;
                        var opp_move = moves.their_move;

                        if (move == "" || opp_move == "") {
                                return;
                        }

                        console.log("move is:" + move);
                        console.log("opp_move is:" + opp_move);

                        if (move == "left") {
                                console.log("move_left");
                                g.move(g.bike, Phaser.LEFT);

                        } else if (move == "right") {
                                console.log("move_right");
                                g.move(g.bike, Phaser.RIGHT);
                        } else if (move == "up") {
                                console.log("move_up");
                                g.move(g.bike, Phaser.UP);

                        } else if (move == "down") {
                                console.log("move_down");
                                g.move(g.bike, Phaser.DOWN);
                        }

                        if (opp_move == "left") {
                                console.log("opp_right");
                                g.move(g.enemy, Phaser.RIGHT);

                        } else if (opp_move == "right") {
                                console.log("opp_left");
                                g.move(g.enemy, Phaser.LEFT);
                        } else if (opp_move == "up") {
                                console.log("opp_up");
                                g.move(g.enemy, Phaser.UP);

                        } else if (opp_move == "down") {
                                console.log("opp_down");
                                g.move(g.enemy, Phaser.DOWN);
                        }
                });
        },

        move: function (player, direction) {

                var speed = this.speed;

                this.increaseLength(player);

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

                this.current = direction;

        },

        getTimeStamp: function () {
                return new Date().getTime();
        },

        checkBoundaries: function (player) {
                if (player[0].x >= this.width - 1 || player[0].x < 0) {
                        console.log("x_boundary");
                        return true;
                }

                if (player[0].y >= this.height - 1 || player[0].y < 0) {
                        console.log("y_boundary");
                        return true;
                }
        },

        checkCollideSelf: function (player) {
                for(var i = player.length - 2; i > 0; i--) {
                        if(player[0].body.hitTest(player[i].x, player[i].y)) {
                                console.log(i);
                                return true;
                        }
                }

        },

        checkCollideOther: function () {
                for (var i = 1; i < this.bike.length; i++) {
                        if (this.enemy[0].body.hitTest(this.bike[i].x, this.bike[i].y)) {
                                console.log("enemy_hit");
                                return this.enemy.name;
                        }
                }
                
                for (var i = 1; i < this.enemy.length; i++) {
                        if (this.bike[0].body.hitTest(this.enemy[i].x, this.enemy[i].y)) {
                                console.log("player_hit");
                                return "You";
                        }
                }

                return false;
        },

        update: function () {

                var youDie = this.checkCollideSelf(this.bike) || this.checkBoundaries(this.bike);
                var theyDie = this.checkCollideSelf(this.enemy) || this.checkBoundaries(this.enemy);
                var collideOther = this.checkCollideOther();
                if (collideOther === this.enemy.name) {
                        theyDie = true;
                } else if (collideOther === "You") {
                        youDie = true;
                }
                if (youDie && theyDie) {
                        Client.socket.emit("draw");
                        this.gameOver(0);
                } else if (youDie) {
                        Client.socket.emit("lose");
                        this.gameOver(1);
                } else if (theyDie) {
                        Client.socket.emit("win");
                        this.gameOver(2);
                }

                this.physics.arcade.collide(this.bike[0], this.layer);
                this.physics.arcade.collide(this.enemy[0], this.layer);
        },

        gameOver: function (loser) {

                game.paused = true;
                var style = {fill: '#F00'};
                var text = this.add.text(game.width * .5, game.height * .5, "Game Over", style);
                text.anchor.set(.5, .5);

                var whoDied;
                if (loser == 0) {
                        whoDied = this.add.text(game.width * .5,
                                game.height * .5 + 100, "Draw!", style);
                        whoDied.anchor.set(.5, .5);
                } else if (loser == 1) {
                        whoDied = this.add.text(game.width * .5,
                                game.height * .5 + 100, "You Lose!", style);
                        whoDied.anchor.set(.5, .5);
                } else if (loser == 2) {
                        whoDied = this.add.text(game.width * .5,
                                game.height * .5 + 100, "You Win!", style);
                        whoDied.anchor.set(.5, .5);
                }

                document.getElementById('exit-button').style.display = "block";
        }
};

game.state.add('Game', LightBikes, true);

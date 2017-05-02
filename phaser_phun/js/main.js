
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

                // this.map.setCollision(1, true, this.layer);

                this.bike = [];
                this.bike.push(this.add.sprite(0, 320, 'player'));
                this.enemy = [];
                this.enemy.push(this.add.sprite(624, 320, 'enemy'));
                // this.increaseLength(this.bike);
                // this.increaseLength(this.enemy);
                this.bike[0].anchor.set(0);
                this.enemy[0].anchor.set(0);

                this.physics.arcade.enable(this.bike[0]);
                this.physics.arcade.enable(this.enemy[0]);

                this.cursors = this.input.keyboard.createCursorKeys();

                // this.move(this.bike, Phaser.RIGHT);
                // this.bike.next = Phaser.RIGHT;
                // this.move(this.enemy, Phaser.LEFT);
                // this.enemy.next = Phaser.LEFT;

                this.enemyMovement();
                game.paused = true;
                console.log("right before newplayer sent");
                Client.socket.emit('newplayer', username);
                console.log("right after new player sent");
                Client.socket.on("start", function(){
                    console.log("in start");
                    game.paused = false;
                });

                        // console.log("meeting time is " + delay);
                        // $.post("time", function(time){
                        //     console.log("now is " + time);
                        //     console.log("time difference is " + (delay - time));
                        //     setTimeout('start_function()', delay - time);
    
                        // });
                       
                    //    this.lastUpdate = new Date().getTime();
                // });

                console.log("end o create");

                // this.getFirstMove();

                Client.socket.emit("my_move", "left");
        },

        getFirstMove: function() {
                //tell players to input direction
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

        checkKeys: function (player) {

                if (this.cursors.left.isDown && player.next !== Phaser.RIGHT) {
                        console.log("Left Party");
                        Client.socket.emit("my_move", "left");
                        player.next = Phaser.LEFT;
                } else if (this.cursors.right.isDown && player.next !== Phaser.LEFT) {
                        console.log("Right Party");
                        Client.socket.emit("my_move", "right");
                        player.next = Phaser.RIGHT;
                } else if (this.cursors.up.isDown && player.next !== Phaser.DOWN) {
                        console.log("Up Party");
                        Client.socket.emit("my_move", "up");
                        player.next = Phaser.UP;
                } else if (this.cursors.down.isDown && player.next !== Phaser.UP) {
                        console.log("Down Party");
                        Client.socket.emit("my_move", "down");
                        player.next = Phaser.DOWN;
                }
        },

        enemyMovement: function () {
                // var enemy = this.enemy;
                // Client.socket.on("left", function() {
                //      enemy.next = Phaser.LEFT;
                // });
                // Client.socket.on("right", function() {
                //      enemy.next = Phaser.RIGHT;
                // });
                // Client.socket.on("up", function() {
                //      enemy.next = Phaser.UP;
                // });
                // Client.socket.on("down", function() {
                //      enemy.next = Phaser.DOWN;
                // });








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

                        switch (move) {
                                case "left":
                                        g.move(g.bike, Phaser.LEFT);
                                case "right":
                                        g.move(g.bike, Phaser.RIGHT);
                                case "up":
                                        g.move(g.bike, Phaser.UP);
                                case "down":
                                        g.move(g.bike, Phaser.DOWN);
                        }

                        switch (opp_move) {
                                case "left":
                                        g.move(g.enemy, Phaser.RIGHT);
                                case "right":
                                        g.move(g.enemy, Phaser.LEFT);
                                case "up":
                                        g.move(g.enemy, Phaser.UP);
                                case "down":
                                        g.move(g.enemy, Phaser.DOWN);
                        }
                });


                // if (this.cursors.left.isDown && this.enemy.next !== Phaser.RIGHT) {
                //         console.log("Left Party");
                //         this.enemy.next = Phaser.LEFT;
                // } else if (this.cursors.right.isDown && this.enemy.next !== Phaser.LEFT) {
                //         console.log("Right Party");
                //         this.enemy.next = Phaser.RIGHT;
                // } else if (this.cursors.up.isDown && this.enemy.next !== Phaser.DOWN) {
                //         console.log("Up Party");
                //         this.enemy.next = Phaser.UP;
                // } else if (this.cursors.down.isDown && this.enemy.next !== Phaser.UP) {
                //         console.log("Down Party");
                //         this.enemy.next = Phaser.DOWN;
                // }
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


                // this.moveTrain(player);

                this.current = direction;

        },

        moveTrain: function (player) {
  //            var oldX, oldY;
                // for(var i = 0; i < player.length; i++) {
                //      var x = player[i].x;
                //      var y = player[i].y;
                //      if(i != 0) {
                //              player[i].x = oldX;
                //              player[i].y = oldY;
                //      }

                //      oldX = x;
                //      oldY = y;
                // }
        },

        getTimeStamp: function () {
                return new Date().getTime();
        },

        checkBoundaries: function (player) {
                if(player[0].x >= this.width - 1 || player[0].x < 0) {
                        return true;
                }
                if(player[0].y >= this.height - 1 || player[0].y < 0) {
                        return true;
                }
        },

        checkCollideSelf: function (player) {
                for(var i = 2; i < player.length; i++) {
                        if(player[0].body.hitTest(player[i].x, player[i].y)) {
                                // console.log(i);
                                // this.gameOver("You");
                                return true;
                        }
                }

        },

        checkCollideOther: function () {
                for (var i = 1; i < this.bike.length; i++) {
                        if (this.enemy[0].body.hitTest(this.bike[i].x, this.bike[i].y)) {
                                // this.gameOver(this.enemy.name);
                                return this.enemy.name;
                        }
                }
                for (var i = 1; i < this.enemy.length; i++) {
                        if (this.bike[0].body.hitTest(this.enemy[i].x, this.enemy[i].y)) {
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

                this.checkKeys(this.bike);

                // if ((this.getTimeStamp() - this.lastUpdate) < 375) {
                //         return;
                // };

                this.physics.arcade.collide(this.bike[0], this.layer);
                this.physics.arcade.collide(this.enemy[0], this.layer);



                // this.lastUpdate = new Date().getTime();

                // this.move(this.bike, this.bike.next);

                // this.move(this.enemy, this.enemy.next);

                // if (this.turning !== Phaser.NONE) {
                //      this.turn();
                // };

        },

        gameOver: function (loser) {

                game.paused = true;
                var style = {fill: '#F00'};
                var text = this.add.text(game.width * .5, game.height * .5, "Game Over" + loser, style);
                text.anchor.set(.5, .5);
        }
};

game.state.add('Game', LightBikes, true);
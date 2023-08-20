var game;

window.onload = function() {
    game = new Phaser.Game(1080, 570, Phaser.AUTO, 'gameContainer', { preload: preload, create: create, update: update });
};

function preload() {

    game.load.image('background', 'assets/img/background.jpg');

    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.parentIsWindow = true;

    game.load.image('ground', 'assets/img/ground.png');
    game.load.image('platform', 'assets/img/platform.png')
    game.load.image('platform1', 'assets/img/platform1.png')
    game.load.image('experience', 'assets/img/experience.png')
    game.load.spritesheet('player-walk', 'assets/img/player-walk.png', 60, 64, 5);

    game.load.image('canEnemy', 'assets/img/canEnemy.png');
    game.load.image('gameOverImage', 'assets/img/gameOver.png');  
}


var player;
var ground;
var platform1;
var score = 0;
var scoreText;
var lives = 3;
var livesText;


function create() {
    var backgroundImage = game.add.sprite(0, 0, 'background'); // 'background' is the key used in preload
    backgroundImage.width = game.width;
    backgroundImage.height = game.height;

    //set the background image to follower the player
    backgroundImage.fixedToCamera = true;

	// player = game.add.sprite(480, 340, 'player');
    player = game.add.sprite(480, 340, 'player-walk');
    player.animations.add('walk');
    player.animations.play('walk', 10, true);
    player.anchor.x = 0.5;
	game.physics.arcade.enable(player);
	player.body.bounce.y = 0.2;
	player.body.gravity.y = 300;
	player.body.collideWorldBounds = true;

    cursors = game.input.keyboard.createCursorKeys();

   
    ground = game.add.sprite(0, 500, 'ground');
    game.physics.arcade.enable(ground);
    ground.body.setSize(1080, 20, 0, 0);
    ground.body.immovable = true;
    
    ground1 = game.add.sprite(460, 500, 'ground');
    game.physics.arcade.enable(ground1);


    platform = game.add.sprite(100, 370, 'platform');
    game.physics.arcade.enable(platform);
    platform.body.immovable = true;

    platform1 = game.add.sprite(100, 340, 'platform1');
    game.physics.arcade.enable(platform1);
    platform1.body.immovable = true;

    platform2 = game.add.sprite(500, 300, 'platform');
    game.physics.arcade.enable(platform2);
    platform2.body.immovable = true;

    platform3 = game.add.sprite(500, 270, 'platform1');
    game.physics.arcade.enable(platform3);
    platform3.body.immovable = true;

    experience = game.add.sprite(260, 320, 'experience');
    game.physics.arcade.enable(experience);
    experience.body.immovable = true;

    experience1 = game.add.sprite(320, 320, 'experience');
    game.physics.arcade.enable(experience1);
    experience1.body.immovable = true;

    canEnemy = game.add.sprite(600, 260, 'canEnemy');
    game.physics.arcade.enable(canEnemy);
    canEnemy.body.immovable = true;

    canEnemy1 = game.add.sprite(10, 442, 'canEnemy');
    game.physics.arcade.enable(canEnemy1);
    canEnemy1.body.immovable = true;

    
    game.world.setBounds(0, -540*3, 1080, 540*4);
    game.camera.follow(player);

    scoreText = game.add.text(16, 16, 'Score: 0', { fontSize: '18px', fill: '#FFFFFF', font: 'Arial' });
    scoreText.fixedToCamera = true;

    livesText = game.add.text(game.width - 16, 16, 'Lives: ' + lives, { fontSize: '18px', fill: '#FFFFFF', font: 'Arial' });
    livesText.anchor.setTo(1, 0);
    livesText.fixedToCamera = true;
  
}


function update() {
    game.physics.arcade.collide(player, experience, null, onCollision, this);
    game.physics.arcade.collide(player, experience1, null, onCollision, this);


    game.physics.arcade.collide(player, canEnemy, null, onCollision, this);
    game.physics.arcade.collide(player, canEnemy1, null, onCollision, this);

    game.physics.arcade.collide(player, ground);
    game.physics.arcade.collide(player, platform);
    game.physics.arcade.collide(player, platform2);

    player.body.velocity.x = 0;
    if (cursors.left.isDown) {
        player.body.velocity.x = -150;
    } else if (cursors.right.isDown) {
        player.body.velocity.x = 150;
    } else if (cursors.up.isDown && player.body.touching.down) {
        player.body.velocity.y = -300;
    }

    // Player moving
    if (player.body.velocity.x > 0) {
        // Player is moving right
        player.scale.x = 1;
        player.animations.play('walk');
    } else if (player.body.velocity.x < 0) {
        // Player is moving left
        player.scale.x = -1; // Flip the image
        player.animations.play('walk');
    } else {
        // Player is not moving
        player.animations.stop();
        player.frame = 0; // Set the frame to the standing character frame
    }
}


function onCollision(player, sprite) {
    if (sprite.key === 'experience') {
        // Player touched the experience sprite
        sprite.destroy();
        score += 10;
        scoreText.text = 'Score: ' + score;
    } else if (sprite.key === 'canEnemy') {
        // Player touched the canEnemy sprite
        sprite.destroy();
        lives--;
        livesText.text = 'Lives: ' + lives;

        if (lives === 0) {
            gameOver();
        } else {
            player.reset(480, 340);
        }
    }
}


// ...

function gameOver() {
    // Game over logic
    // For example, you can display a game over image and restart the game
    var gameOverImage = game.add.sprite(0, 0, 'gameOverImage');
    gameOverImage.anchor.setTo(0.5); // Set the anchor point to the center of the image
    gameOverImage.scale.setTo(0.2); // Adjust the scale as needed
    gameOverImage.fixedToCamera = true;
    gameOverImage.cameraOffset.setTo(game.camera.view.centerX, game.camera.view.centerY);

    // Add a window resize event listener
    window.addEventListener('resize', function() {
        // Update the camera offset when the window is resized
        gameOverImage.cameraOffset.setTo(game.camera.view.centerX, game.camera.view.centerY);
    });

    // Hide the game over image after 2 seconds
    game.time.events.add(Phaser.Timer.SECOND * 2, function() {
        gameOverImage.destroy();
        restartGame();
    }, this);
}

// ...

// ...

function restartGame() {
    // Reset the game
    score = 0;
    lives = 3;
    scoreText.text = 'Score: ' + score;
    livesText.text = 'Lives: ' + lives;
    player.reset(480, 340);
    create(experience, canEnemy);
    // Reset any other game elements as needed
}

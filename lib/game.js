var game;
var isMusicPlaying = true;
var buttonText; // Declare buttonText as a global variable
var musicKey; // Declare musicKey as a global variable

window.onload = function() {
    game = new Phaser.Game(1080, 570, Phaser.AUTO, 'gameContainer', { preload: preload, create: create, update: update });
};

function preload() {
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.parentIsWindow = true;

    game.load.image('background', 'assets/img/background.jpg');
    game.load.image('ground', 'assets/img/ground.png');
    game.load.image('platform', 'assets/img/platform.png')
    game.load.image('platform1', 'assets/img/platform1.png')
    game.load.image('game_enemy', 'assets/img/game_enemy.png')
    game.load.spritesheet('player-walk', 'assets/img/player-walk.png', 60, 64, 5);

    game.load.image('game_collector', 'assets/img/game_collector.png');
    game.load.image('gameOverImage', 'assets/img/gameOver.png');  

    //Fx
    game.load.audio('jump', 'assets/fx/jump.mp3');
    game.load.audio('running', 'assets/fx/running.mp3');
    game.load.audio('bonus', 'assets/fx/game_bonus.mp3');
    game.load.audio('negative', 'assets/fx/negative_beep.mp3');

    //Background music
    game.load.audio('backgroundMusic', 'assets/fx/background_game.mp3');
}


var player;
var ground;
var platform1;
var score = 0;
var scoreText;
var lives = 2;
var livesText;

//Fx:
var jumpSound;
var runningSound;
var bonusSound;
var negativeSound;




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

    game_enemy = game.add.sprite(260, 320, 'game_enemy');
    game.physics.arcade.enable(game_enemy);
    game_enemy.body.immovable = true;

    game_enemy1 = game.add.sprite(320, 320, 'game_enemy');
    game.physics.arcade.enable(game_enemy1);
    game_enemy1.body.immovable = true;

    game_collector = game.add.sprite(600, 260, 'game_collector');
    game.physics.arcade.enable(game_collector);
    game_collector.body.immovable = true;

    game_collector1 = game.add.sprite(10, 442, 'game_collector');
    game.physics.arcade.enable(game_collector1);
    game_collector1.body.immovable = true;

    
    game.world.setBounds(0, -540*3, 1080, 540*4);
    game.camera.follow(player);

    scoreText = game.add.text(16, 16, 'Score: 0', { fontSize: '18px', fill: '#FFFFFF', font: 'Arial' });
    scoreText.fixedToCamera = true;

    livesText = game.add.text(game.width - 16, 16, 'Lives: ' + lives, { fontSize: '18px', fill: '#FFFFFF', font: 'Arial' });
    livesText.anchor.setTo(1, 0);
    livesText.fixedToCamera = true;
    
    //fx sound
    jumpSound = game.add.audio('jump');
    runningSound = game.add.audio('running');
    bonusSound = game.add.audio('bonus');
    negativeSound = game.add.audio('negative');


    //Key to mute the backround sound
    musicKey = game.input.keyboard.addKey(Phaser.Keyboard.M);
    musicKey.onDown.add(toggleBackgroundMusic, this);
    
    // Create the toggle button text
    buttonText = game.add.text(580, 16, 'Music: ON', { font: '18px Arial', fill: '#ffffff' });
    buttonText.anchor.setTo(1, 0);
    buttonText.inputEnabled = true;
    buttonText.input.useHandCursor = true;
    buttonText.events.onInputUp.add(toggleBackgroundMusic, this);
    buttonText.fixedToCamera = true;

    // Play background music
    backgroundMusic = game.add.audio('backgroundMusic');
    backgroundMusic.loop = true;
    backgroundMusic.play();
}

function toggleBackgroundMusic() {
    if (isMusicPlaying) {
        backgroundMusic.pause();
        isMusicPlaying = false;
    } 
    else {
        backgroundMusic.resume();
        isMusicPlaying = true;
    } 

    updateButtonText();
}

function updateButtonText() {
    buttonText.text = 'Music: ' + (isMusicPlaying ? 'ON' : 'OFF');
}

function update() {
    game.physics.arcade.collide(player, game_enemy, null, onCollision, this);
    game.physics.arcade.collide(player, game_enemy1, null, onCollision, this);


    game.physics.arcade.collide(player, game_collector, null, onCollision, this);
    game.physics.arcade.collide(player, game_collector1, null, onCollision, this);

    game.physics.arcade.collide(player, ground);
    game.physics.arcade.collide(player, platform);
    game.physics.arcade.collide(player, platform2);

    player.body.velocity.x = 0;
    if (cursors.left.isDown) {
        player.body.velocity.x = -150;
    } else if (cursors.right.isDown) {
        player.body.velocity.x = 150;
    }

    if (player.body.velocity.x !== 0) {
        if (!runningSound.isPlaying) {
            runningSound.play(); // Play the running sound if it's not already playing
        }
    } else {
        runningSound.stop(); // Stop the running sound if the player is not moving
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.body.velocity.y = -300;
        jumpSound.play();
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
    if (sprite.key === 'game_collector') {
        // Player touched the game_collector sprite
        sprite.destroy();
        score += 10;
        scoreText.text = 'Score: ' + score;

        // Play the bonus sound
        bonusSound.play();
    } else if (sprite.key === 'game_enemy') {
        // Player touched the game_enemy sprite
        sprite.destroy();
        lives--;
        livesText.text = 'Lives: ' + lives;

        // Play the negative sound
        negativeSound.play();

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
    create(game_enemy, game_collector);
    // Reset any other game elements as needed
}

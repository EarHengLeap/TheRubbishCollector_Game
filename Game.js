/*
 * initalise Phaser framework with width:960px, height:540px
 */
var game = new Phaser.Game(960, 540, Phaser.AUTO, 'gameContainer', { preload: preload, create: create, update: update });

/*
 * Preload runs before the game starts. Assets such as images and sounds such be preloaded here.
 * A webserver is required to load assets.
 *
 * Also in this function we set game scale so it full browser width.
 */
function preload() {

    game.load.image('background', 'images/background_city.jpg');
   
    // set to scale to full browser width
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.parentIsWindow = true;
    //set the background color so can confirm the game renders in the browser
    //this.stage.backgroundColor = '#af6c1e';
    

    //preload images & sounds
    // game.load.image('player', 'images/minecraft.png');
    game.load.image('ground', 'images/ground.png');
    game.load.image('platform', 'images/platform.png')
    game.load.image('platform1', 'images/platform1.png')
    game.load.image('experience', 'images/experience.png')

    game.load.spritesheet('player-walk', 'images/player-walk.png', 60, 64, 5);
    // game.load.spritesheet('player-stand', 'images/player-walk.png', 60, 64, 4);
    //game.load.image('key', 'folder/filename.png');
}

/*
* Add game variables here
*
*/
var player;
var ground;
var platform1;
var score = 0;
var scoreText;

/*
 * Create runs once only when Phaser first loads
 * create the game scene by adding objects to the stage
 */
function create() {
    var backgroundImage = game.add.sprite(0, 0, 'background'); // 'background' is the key used in preload
    backgroundImage.width = game.width;
    backgroundImage.height = game.height;

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
    ground.body.setSize(960, 20, 0, 0);
    ground.body.immovable = true;

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
    
    game.world.setBounds(0, -540*3, 1500, 540*4);
    game.camera.follow(player);

    scoreText = game.add.text(16,16, 'score: 0', {fontSize: '32px', fill: '#FFFFFF'})
    scoreText.fixedToCamera = true;
  
}


/*
 * Update runs continuously. Its the game loop function.
 * Add collision detections and control events here
 */
function update() {
    game.physics.arcade.collide(player, experience, null, onCollision, this);
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

function onCollision(player, experience) {
    experience.destroy();
    score = score + 10;
    scoreText.text = 'Score: ' + score;
}


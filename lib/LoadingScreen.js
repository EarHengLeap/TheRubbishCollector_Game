var LoadingScreen = function() {};

LoadingScreen.prototype = {
    init: function() {
        this.loadingBar = game.make.sprite(game.world.centerX - (387 / 2), 400, "loading");
    },
    
    preload: function() {
        // Load assets for the loading screen (e.g., loading bar, background, etc.)
        game.load.image("loading", "loading.png");
    },
    
    create: function() {
        // Set up the loading screen (e.g., display loading bar, background, etc.)
        game.add.sprite(0, 0, "background");
        game.add.existing(this.loadingBar);
    },
    
    update: function() {
        // Update the loading screen (e.g., check loading progress, transition to the game when ready)
        this.loadingBar.scale.x = game.load.progress / 100;
        
        if (game.load.progress === 100) {
            // Loading complete, transition to the game
            game.state.start("Game");
        }
    }
};
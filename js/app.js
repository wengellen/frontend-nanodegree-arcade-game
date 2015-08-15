'use strict';

var NUM_ENEMY = 3;
var GAME_STATUS_START = 0; 
var GAME_STATUS_WON = 1;
var GAME_STATUS_LOSS = 2;
var gameStatus = GAME_STATUS_START;
var STARTING_CELL_NUM = 6 ;
var allEnemies = [];
var player;

// Enemies our player must avoid
var Enemy = function() {
    // Returns a random start position for each enemy
    this.getRandomStartPos = function(){
        return -(getRandomArbitrary(100, 1000) + this.width);
    };
    this.width = 101;  // enemy sprite actual image area width
    this.height = 77;  // enemy sprite actual image area height
    this.sprite =  'images/enemy-bug.png';
    this.x = this.getRandomStartPos(); // default start x position
    this.y = 0;    // default start y position
    this.speed = getRandomArbitrary(50, 120);   // create random speed for each enemy
    this.offsetLeft = 1;  // enemy sprite left empty area
    this.offsetTop = 77;  // enemy sprite top empty area
    this.getBounds = function() {
        return  {
            'top': this.y + this.offsetTop,
            'right': this.x + this.offsetLeft + this.width,
            'bottom': this.y + this.offsetTop + this.height,
            'left': this.x + this.offsetLeft
        };
    };
};

// Returns a random number between min (inclusive) and max (exclusive)
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    var pos = this.x;
    this.x = (pos) % canvas.width;
    if(pos >= canvas.width){
        this.x = this.getRandomStartPos();   // To create random re-start positions
    }
    this.x += dt * this.speed;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
 * Player Class
 * @constructor
 */
var Player = function(){
    this.offsetY = 10;  // player y position offset value;
    this.minY = 0 - this.offsetY;   // The left-most in-bound x value
    this.maxY = (STARTING_CELL_NUM - 1) * Board.cellH - this.offsetY; // The top-most in-bound y value
    this.minX = 0;                  // The right-most in-bound x value
    this.maxX = (Board.numCols-1) * Board.cellW;                       // The bottom-most in-bound y value
    this.width = 67;         // player sprite actual image area width
    this.height = 83;        // player sprite actual image area height
    this.sprite = 'images/char-boy.png';
    this.vy = Board.cellH;   // y velocity
    this.vx = Board.cellW;   // x velocity
    this.offsetTop = 63;     // player sprite top empty area
    this.offsetLeft = 19;    // player sprite left empty area
    this.y =  this.maxY;     // Starting Y Position
    this.x =  (canvas.width/2) - (Board.cellW/2);   // Start X Position at the center
    this.startPos = [this.x, this.y];   // Store position for reset
    this.getBounds = function(){        // Used for collision detection bound checking
        return  { 'top': this.y + this.offsetTop,
                  'right': this.x + this.offsetLeft + this.width,
                  'bottom': this.y + this.offsetTop + this.height,
                  'left': this.x + this.offsetLeft};
    };

    this.handleInput = function(dir){
        switch(dir) {
            case 'left':
                    var posX = this.x;
                    if(parseInt(posX - this.vx) < parseInt(this.minX)){
                        console.log('illegal move');
                    }else {
                        this.x -= this.vx ;
                    }
                break;

            case 'right':
                    posX = this.x;
                    if(parseInt(posX + this.vx) > parseInt(this.maxX)){
                        console.log('illegal move');
                    }else {
                        this.x += this.vx ;
                    }

                break;

            case 'up':
                    var posY = this.y;
                    if(parseInt(posY - this.vy) < parseInt(this.minY)){
                        console.log('illegal move');
                    }else {
                        this.y -= this.vy;
                    }
                break;

            case 'down':
                    posY = this.y;
                    if(parseInt(posY + this.vy) > parseInt(this.maxY)){
                        console.log('illegal move');
                    }else {
                        this.y += this.vy;
                    }
                break;

            default:
                console.log('Key not allowed');
        }
        checkGameWon();
    };
};

Player.prototype.update = function(){
    checkCollisions();
};

Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
 * This function is used to instantiate enemies and
 * save them to allEnemies array
 * @param num Default number of enemy to create
 */
function createEnemies(num){
    for(var i = 0; i < num; i++) {
        var enemy = new Enemy();
        // first row
        enemy.y = (i+1) * Board.cellH - 20;
        allEnemies.push(enemy);
    }
}

// initialize enemies and player
createEnemies(NUM_ENEMY);
player = new Player();

/**
 *  This function is called continuously while game is running.
 *  It checks for collision between enemies and player.
 *  And reset the player position to the start position when collided.
 *
 */
function checkCollisions(){
    if(gameStatus != GAME_STATUS_START) return;

    for(var i = 0; i < allEnemies.length; i++) {
        var enemy = allEnemies[i];
        var playerBounds = player.getBounds();
        var enemyBounds = enemy.getBounds();
        if((enemyBounds.right > playerBounds.left &&
            enemyBounds.left < playerBounds.right) &&
            (enemyBounds.bottom > playerBounds.top &&
            enemyBounds.top < playerBounds.bottom )
        ){
            console.log('Collided!');
            gameStatus = GAME_STATUS_LOSS;
            Board.reset();
        }
    }
}

/**
 *  This function is used to check if the player has won the game by
 *  reaching the top-most cell on the board.
 *  It's called every time when a key event happened.
 */
function checkGameWon(){
    var playerBounds = player.getBounds();
    if(playerBounds.top > 0 &&
        playerBounds.top < Board.cellH){
        console.log('You Won!!');
        gameStatus = GAME_STATUS_WON;
        Board.reset();
    }
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

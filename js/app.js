
var NUM_ENEMY = 3;
var GAME_STATUS_START = 0;
var GAME_STATUS_WON = 1;
var GAME_STATUS_LOSS = 2;
var gameStatus = GAME_STATUS_START;
var STARTING_CELL_NUM = 6 ;

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // Returns a random start position
    this.getRandomStartPos = function(){
        return -(getRandomArbitrary(100, 1000) + this.width);
    };

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.width = 101;
    this.height = 77;
    this.sprite =  'images/enemy-bug.png';//'images/char-horn-girl.png';//'images/enemy-bug.png';
    this.x = this.getRandomStartPos();
    this.y = 0;
    this.speed = getRandomArbitrary(50, 120)
    this.offsetX = 1;
    this.offsetTop = 77;
    this.offsetBottom = 17;
    this.getBounds = function() {
        return  { "top": this.y + this.offsetTop,
            "right": this.x + this.offsetX + this.width,
            "bottom": this.y + this.offsetTop + this.height,
            "left": this.x + this.offsetX};
    }
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
        this.x = this.getRandomStartPos();
    }
    this.x += dt * this.speed;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
var Player = function(){
    this.width = 67;
    this.height = 83;
    this.sprite = "images/char-boy.png";
    this.vy = Board.cellH;
    this.offsetTop = 63;
    this.offsetX = 19;
    this.vx = Board.cellW;
    this.x =  (canvas.width/2) - (Board.cellW/2);
    this.y =  (STARTING_CELL_NUM - 1) * Board.cellH - 10;  //Staring from the 6th row
    this.startPos = [this.x, this.y];
    this.getBounds = function(){
        return  { "top": this.y + this.offsetTop,
                  "right": this.x + this.offsetX + this.width,
                  "bottom": this.y + this.offsetTop + this.height,
                    "left": this.x + this.offsetX};
    }

    this.handleInput = function(dir){
        switch(dir) {
            case 'left':
                if(isLegalMove()) {
                    this.x -= this.vx;
                }
                break;

            case 'right':
                this.x += this.vx ;
                break;

            case 'up':
                this.y -= this.vy ;
                console.log(this.y);
                break;

            case 'down':
                this.y += this.vy ;
                console.log(this.y);
                break;

            default:
                console.log("There is an problem");
        }
        checkGameWon();
    }

};


Player.prototype.update = function(){
    //console.log("player.y:"+this.y);
    //checkCollision();
    //checkGameWon();
}

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

function checkGameWon(){
    var playerBounds = player.getBounds();
    if(playerBounds.top > 0 && playerBounds.top < Board.cellH){
            console.log('You Won!!');
            gameStatus = GAME_STATUS_WON;
            //Board.reset();
        }
}

Player.prototype.render = function(){
   ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
var allEnemies = [];

function createEnemies(num){
    for(var i = 0; i < num; i++) {
        var enemy = new Enemy();
        // first row
        enemy.y = (i+1) * Board.cellH - 20;
        allEnemies.push(enemy);
    }
}

createEnemies(NUM_ENEMY);

// Place the player object in a variable called player
var player = new Player();


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


// TODO: Collision



// TODO: End game
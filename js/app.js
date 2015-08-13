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
    this.width = Board.cellW;
    this.height = 171;
    this.sprite =  'images/enemy-bug.png';//'images/char-horn-girl.png';//'images/enemy-bug.png';
    this.x = this.getRandomStartPos();
    this.y = 0;
    this.speed = getRandomArbitrary(50, 120);
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
    this.width = Board.cellW;
    this.height = 171;
    this.sprite = "images/char-boy.png";
    this.vy = Board.cellH;
    this.vx = Board.cellW;
    this.x =  (canvas.width/2) - (Board.cellW/2);
    this.y =  canvas.height - (this.height + Board.cellH/2);

    this.handleInput = function(dir){
        switch(dir) {
            case 'left':
                this.x -= this.vx ;
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
    }

};

Player.prototype.update = function(){
    //console.log("player.y:"+this.y);

};

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
        console.log('enemy-'+ i + ":" + enemy.y);
        allEnemies.push(enemy);
    }
}

createEnemies(3);

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

console.log(Engine);
//Enemies vars to count and store enemies
var totalEnemies = 3;
var allEnemies = [];
var enemyMinSpeed = 50;
var enemyMaxSpeed = 400;

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    
    //Sets the position of the enemy and set a random Y pos and speed
    this.setPos = function(){
        this.x = Resources.tiles.w * - 1;
        this.y = (Resources.randomY(1,3) * Resources.tiles.h) - Resources.tiles.offset;
        this.speed = Resources.randomSpeed(enemyMinSpeed, enemyMaxSpeed);
    }
 
    //Checks if the position of the enemy is out of the screen
    this.isOut = function(){
        if(this.x > canvas.width + Resources.tiles.w){
            this.setPos();
        }
    }

    //Sets the position at start
    this.setPos();
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;
    this.isOut();
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Now write your own player class
var Player = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images

    //Sets the initial position of the Player
    this.setPos = function(){
        this.x = Resources.tiles.w * 2;
        this.y = Resources.tiles.h * 5 - Resources.tiles.offset; 
    }

    this.sprite = 'images/char-boy.png';

    //Moves the playes depending the direction. Calculates the 
    this.move = function(direction){
        if(direction == 'left' && this.x >= Resources.tiles.w){
            this.x -= Resources.tiles.w;
        }else if(direction == 'right' && this.x <= Resources.tiles.w * 3){
            this.x += Resources.tiles.w;
        }else if(direction == 'down' && this.y <= Resources.tiles.h * 4 - Resources.tiles.offset){
            this.y += Resources.tiles.h;
        }else if(direction == 'up' && this.y >= Resources.tiles.h - Resources.tiles.offset){
            this.y -= Resources.tiles.h;
        }
    }

    //Sets the position at start
    this.setPos(); 
}

//Detects the player collitions with another type of obects
Player.prototype.hitTest = function(arrayObj, typeObj) {
    //log('calls hittets')
    for(var i = 0; i < arrayObj.length; i++) {
        if(this.x > arrayObj[i].x && this.x < arrayObj[i].x +  Resources.tiles.w - Resources.tiles.offset
        && this.y > arrayObj[i].y - Resources.tiles.offset && this.y < arrayObj[i].y + Resources.tiles.h - Resources.tiles.offset ){
            log('hit')

            switch(typeObj){
                case 'enemy':
                    this.die();
                    break;
                case 'gem':
                    log(typeObj)
                    break;
                default:
                    log(typeObj)
                    break;
            }
        }        
    }
}

//Player dies and game resets
Player.prototype.die = function() {
    reset()
}

//Detects when the player gets to the water
Player.prototype.checkGoal = function(){
    if(this.y < Resources.tiles.h - Resources.tiles.offset){
        log('win');
    }
}

// This class requires an update(), render()
Player.prototype.update = function(dt) {
    this.hitTest(allEnemies, 'enemy');
    this.checkGoal();
}

Player.prototype.render = function() {
   //log(this.x, this.y);
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// a handleInput() method.
Player.prototype.handleInput = function(allowedKey) {
    switch(allowedKey){
        case 'left':
            this.move('left');
            break;
        case 'up':
            this.move('up');
            break;
        case 'right':
            this.move('right');
            break;
        case 'down':
            this.move('down');
            break;
        default:
            //
            break;
    }
}



// Now instantiate your objects.
for(var i = 0; i < totalEnemies; i++){
    var myEnemy = new Enemy();
    // Place all enemy objects in an array called allEnemies
    setTimeout(function(){
        allEnemies.push(new Enemy());
        log('count')
    }, 1000)
}

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

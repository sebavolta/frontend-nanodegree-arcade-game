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
    //Check if the game is playing and not stopped
    if(Resources.gameConfig.isPlaying){
        this.x += this.speed * dt;
        this.isOut();
    }
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
    this.sprite = 'images/char-boy.png';

    //Sets the position at start
    this.setPos(); 
}

//Sets the initial position of the Player
Player.prototype.setPos = function(){
    this.x = Resources.tiles.w * 2;
    this.y = Resources.tiles.h * 5 - Resources.tiles.offset; 
}

//Moves the playes depending the direction. Calculates the 
Player.prototype.move = function(direction){
    if(Resources.gameConfig.isPlaying){
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

// This class requires an update(), render()
Player.prototype.update = function(dt) {
    if(Resources.gameConfig.isPlaying){
        this.hitTest(allEnemies, 'enemy');
        this.checkGoal();
    }
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

//Player dies and game resets
Player.prototype.die = function() {
    Resources.gameConfig.isPlaying = false;
    Resources.gameConfig.gameOver = true;
    reset();
}

//Detects when the player gets to the water
Player.prototype.checkGoal = function(){
    if(this.y < Resources.tiles.h - Resources.tiles.offset){
        reset();
        addScore();
    }
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

/*Adds score function*/
var addScore = function(){
    Resources.gameConfig.score+= 10;
}

/*Shows Game Over screen*/
var showOver = function(){
    cto.font = "60px Verdana";
    cto.fillStyle = "#fff"; 
    cto.fillText(Resources.gameConfig.overText, canvas.width/2 - cto.measureText(Resources.gameConfig.overText).width/2, canvas.height/2);
    cto.font = "20px Verdana";
    cto.fillText(Resources.gameConfig.tryAgain, canvas.width/2 - cto.measureText(Resources.gameConfig.tryAgain).width/2, canvas.height/2 + 50);
}

/*Score function*/
var showScore = function(){
    cto.fillStyle = "#fff"; 
    cto.clearRect(0,0,canvas.width,canvas.height);
    cto.font = "20px Verdana";
    cto.fillText(Resources.gameConfig.scoreText + Resources.gameConfig.score, canvas.width/2 - cto.measureText(Resources.gameConfig.scoreText).width/2, 80);
}

/*Listen to click on canvas on Game Over*/
var listenClick = function(){
    document.getElementById("canvasOver").addEventListener('click', function(e) {
        if(Resources.gameConfig.gameOver){
            restart();
        }
    });
}

/*Restart game function*/
var restart = function(){
    cto.clearRect(0,0,canvas.width,canvas.height);
    Resources.gameConfig.score = 0;
    Resources.gameConfig.gameOver = false;
    Resources.gameConfig.isPlaying = true;
}

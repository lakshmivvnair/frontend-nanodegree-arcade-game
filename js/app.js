/**************************************************************
*       Class - Enemy
*       Role - To be avoided by Player Object Character
*       Game Stats - Reduce Lives by 1, Score by 50
***************************************************************/
var Enemy = function() {
    this.sprite = 'images/enemy-bug.png';
    this.baseX = 0;     // intial x to reset bug
    this.baseY = 0;     // intial y to reset bug
    this.x = 0;
    this.y = 0;
    this.speed = 0;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    // Keep bug object within canvas bounds
    if (this.x > 505) {
        this.x = this.baseX;
    } else {
        this.x += dt * this.speed;
    }

    //  Collision Detection with Player Object
    var leftDiff, crossDiff, topDiff;

    leftDiff = Math.abs(this.x - player.x);
    crossDiff = Math.abs((this.x + 101) - player.x);
    topDiff = Math.abs(this.y - player.y);

    if (leftDiff <= 50 && crossDiff <= 150 && topDiff === 0) {

        player.reset();                                             //  Reset Player to start position
        player.lives > 0 ? player.lives -= 1 : player.lives = 0;    //  Reduce Live by 1
        player.score > 0 ? player.score -= 50 : player.score = 0;   //  Reduce score by 50

        // Update message to display life reduced by 1
        message.text = '-1';
        message.y = 175;
        message.x = player.x + 20;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Reset enemy object. Called when game restarted
Enemy.prototype.reset = function() {
    this.x = this.baseX;
    this.y = this.baseY;
    this.speed = getRandomInt(350, 50);
};


/**************************************************************
*       Class - Player
*       Role -  Reach Water,
*               Avoid Collision with bug, Collect gems
*       Game Stats - Gain 100 for reaching water.
***************************************************************/
var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.x = 200;
    this.y = 390;
    this.top = false;                       // Boolean to check if player reached water
    this.score = 0;
    this.scoreHistory = [];
    this.lives = 3;
    this.gemCollected = 0;
    this.keysCollected = 0;
};

// Update player position
Player.prototype.update = function() {
    if (this.top && (this.y === -10)) {     // Check if player reached water
        player.score += 100;                // Add 100 to score
        this.top = false;                   // Reset boolean
        message.text = '100';               // Display message
        message.y = 150;
        message.x = this.x + 20;            // Display message near player
    }

    if (player.gemCollected > 9) {
        player.lives += 1;                  // Player gets 1 life for every 10 gems collected
        player.gemCollected = 0;            // Reset gem collected property
        message.text = '+1';
        message.y = 200;
        message.x = this.x + 20;
    }

    updateScores();                         // Update Game Stats display on right of canvas
};

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Reset player object back to start
Player.prototype.reset = function(savePlayerState) {
    this.x = 200;
    this.y = 390;

    // To reset only score, gemCollected & lives when game restarted
    if (savePlayerState === 'savePlayerState') {
        player.lives = 3;
        player.score  = 0;
        player.gemCollected = 0;
        player.keysCollected = 0;
    }
};

// Handle keyboard input to move player object on canvas
// Function blockCheck() checks if there is a rock object near player
Player.prototype.handleInput = function(keyCode) {
    if (player.lives !== 0) {
        enterKey = false;
        switch (keyCode) {
        case 'left' :
            if ((this.x - 100) > -50 && blockCheck().indexOf('LEFT') === -1) {
                this.x -= 100;
            }
            break;
        case 'right' :
            if ((this.x + 100) < 500 && blockCheck().indexOf('RIGHT') === -1) {
                this.x += 100;
            }
            break;
        case 'up' :
            if ((this.y - 80) > -50 && blockCheck().indexOf('UP') === -1) {
                this.y -= 80;
                // To check if player reached water
                this.y === -10 ? this.top = true : this.top = false;
            }
            break;
        case 'down':
            if ((this.y + 80) < 450 && blockCheck().indexOf('DOWN') === -1) {
                this.y += 80;
            }
            break;
        case 'enter':
            enterKey =  true;
            break;
        default:
        }
    }
};

/**************************************************************
*       Class - Gem
*       Role - To be collected by player
*       Adds to score : Blue - 50, Green - 30, Orange - 20
***************************************************************/
var Gem = function() {
    this.x = 0;
    this.y = 0;
    this.score = 0;
    this.gemIndex = 0;   // to access both gem image and score
};

// Update Gem on collision with player
Gem.prototype.update = function() {

    var leftDiff, topDiff, compareVal, signVal;

    leftDiff = Math.abs(this.x - player.x);
    topDiff = Math.abs(this.y - player.y);
    signVal = Math.sign(this.x - player.x);
    signVal === 1 ? compareVal = 73 : compareVal = 50;

    if (leftDiff <= compareVal && topDiff === 50) {
        if (this.gemIndex === 3 && keyEnable) {         // if collided with key add to keysCollected
            player.keysCollected += 1;
            keyEnable = false;                          // Stop rendering key object
            keySetUp();                                 // Change key x y positions
        } else if (this.gemIndex !== 3) {
            player.score += this.score;
            player.gemCollected += 1;
            message.text = this.score;                  // Display the score linked to gem
            message.y = 200;
            message.x = this.x + 30;
            this.reset();
            keyEnable = true;                           // Reset this gem
        }
        updateScores();                                 // Update gameStats div on right
    }
};

// Draw the gem collectible on screen based gemIndex value
Gem.prototype.render = function() {
    var rowGems = [
        'images/gem-blue.png',
        'images/gem-green.png',
        'images/gem-orange.png',
        'images/key.png'];
    ctx.drawImage(Resources.get(rowGems[this.gemIndex]), this.x, this.y, 50, 85);

    // key object will displayed for every 7 gems collected
    // it will stop rendering if player collects another gem before key
    if (player.gemCollected > 7 && keyEnable) {
        ctx.drawImage(Resources.get(rowGems[key.gemIndex]), key.x, key.y, 50, 85);
    }
};

Gem.prototype.reset = function() {
    gemSetUp(this);
};

/**************************************************************
*       Class - Message
*       Role - To draw messages on top of game canvas
***************************************************************/
var Message = function(x,y,value) {
    this.x = x;
    this.y = y;
    this.text = value;
};

// Check for messages that need to disappear
// To be used to set text back to '' when called with
// score or collision update
Message.prototype.update = function() {

    this.y > 100 ? this.y -= 1 : this.y = 500;               //  Check bounds for message

    if (this.text === '100' && this.y < 120) {
            this.text = '';
            player.reset();                                  //  Reset player
    }
    if (this.text === '+1' && this.y < 120) {
        this.text = '';
    }
    if ((this.text === 50 || this.text === 30 || this.text === 20) && this.y < 120) {
        this.text = '';
    }
    if (this.text === '-1' && this.y < 120) {
        this.text = '';
    }
};

// Draw message on screen with border using strokeText with fillText
Message.prototype.render  = function() {
    ctx.font = '50px Luckiest Guy';
    ctx.fillStyle = '#d90000';
    ctx.strokeStyle = '#eee';
    ctx.fillText(this.text, this.x, this.y);
    ctx.strokeText(this.text, this.x, this.y);
};

// Reset the message to game start/ restart mode
Message.prototype.reset = function() {
    this.x = 25;
    this.y = 500;
    this.text =  "<-- Pick character";
};

/**************************************************************
*       Class - Rock
*       Role - Block player
***************************************************************/
var Rock = function() {
    this.x = 0;
    this.y = 0;
    this.sprite = 'images/rock.png';
    this.block = '';
};

//  Set the property block to 'UP', 'DOWN', 'LEFT', 'RIGHT'
//  depending on player position with respect to the rock object
Rock.prototype.update = function() {
    var xState, yState, xDiff, yDiff;

    xState = this.x === player.x;
    yState = this.y === player.y;

    xDiff = this.x - player.x;
    yDiff = this.y - player.y;

    if (xState && yDiff === -80) {
        this.block = 'UP';
    } else if (xState && yDiff === 80) {
        this.block = 'DOWN';
    } else if (yState && xDiff === -100) {
        this.block = 'LEFT';
    } else if (yState && xDiff === 100) {
        this.block = 'RIGHT';
    } else {
        this.block= '';
    }

    // if player has keys then reset rock position on canvas
    if (this.block !== '' && player.keysCollected !== 0 && enterKey) {
        player.keysCollected - 1 > 0 ? player.keysCollected -= 1 : player.keysCollected = 0;
        rockSetUp(this);
    }
};

//  Draw rock on canvas
Rock.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 90, 152);
};



/**************************************************************
*       Instantiate Objects here
***************************************************************/

// Create enemy objects - 3 nos.
var enemy1 = new Enemy(),
    enemy2 = new Enemy(),
    enemy3 = new Enemy();


// Place all enemy objects in an array called allEnemies
var allEnemies = [];

allEnemies.push(enemy1);
allEnemies.push(enemy2);
allEnemies.push(enemy3);


// Place the player object in a variable called player
var player = new Player();


// Create gems - 2 gems at a time
var gem1 = new Gem(),
    gem2 = new Gem(),
    key = new Gem();

var allGems = [];

allGems.push(gem1);
allGems.push(gem2);


// Create 2 Rock objects
var rock1 = new Rock(),
    rock2 = new Rock();

var allRocks = [];

allRocks.push(rock1);
allRocks.push(rock2);


// Create message object
var message = new Message(25,500, "<-- Pick character");


// To check if key object needs to rendered
// Key will be rendered only when player collects more than 7 gems
// It will stop rendering once player collects it
// OR player collects another gem before key
var keyEnable = true;

//  Boolean variable to test if enter key was hit to clear rock
var enterKey;

/************   Create variables for HTML Elements    ********/


// All images in div with id 'characters'
var playerCharacters = document.getElementById('characters').getElementsByTagName('img');

// Load Game Stats HTML Elements to display score, lives and collectibles
var highScore = document.getElementById('highScore');
var score = document.getElementById('score');
var lives = document.getElementById('lives');
var gemCollected = document.getElementById('gemCollected');
var keysCollected = document.getElementById('keysCollected');


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        13: 'enter'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
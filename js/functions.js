/* Function.js
 * All functions to load array objects and other enabler functions are written here
 */


// Called from init()
function setUpGame() {

    // Set values in all Enemy Objects
    enemySetUp();

    // Set values in all Rock Objects
    rockSetUp();

    // Set values in all Gem Objects
    allGems.forEach(function(gem) {
        gemSetUp(gem);
    });

    // Set up special collectible Gem object 'key'
    keySetUp();

}


// Function to set up Enemy object values
function enemySetUp() {
    var yValues = [70, 150, 230];

    for (var i = 0; i < allEnemies.length; i++) {
        allEnemies[i].x = 0;
        allEnemies[i].y = yValues[i];
        allEnemies[i].baseX = 0;
        allEnemies[i].baseY = yValues[i];
        allEnemies[i].speed = getRandomInt(350, 50);
    }
}


//  Function to set up one gem object
function gemSetUp(gem) {
    var yValues = [120, 200, 280];
    var gemScores = [50,30,20];

    var gemIndex, x, y;

    gemIndex =  getRandomInt(3,0);
    x = getFreeX();                              // function returns x value away from rock
    y = yValues[gemIndex];
    gem.x = x;
    gem.y = y;
    gem.score = gemScores[gemIndex];
    gem.gemIndex = gemIndex;
}


//  Function to set up Rock Objects
function rockSetUp(clearRock){
    var yValues = [70, 150, 230];
    var xValues = [100,200,300,400];

    var yIndex, prevXval, xIndex, rock;
    prevXval = -1;                                  // to keep a distance between the rocks

    for (var i = 0; i < allRocks.length ; i++) {
        yIndex = getRandomInt(3,0);
        xIndex = getRandomInt(4,0);
        if (prevXval !== xValues[xIndex]) {         // Rock objects cannot have same 'x' value
            x = xValues[xIndex];
            y = yValues[yIndex];
            if (clearRock !== undefined) {          // if rock object passed , reset just that
                rock = clearRock;                   // used to reset just one rock when player has key
                i = allRocks.length;
            } else {
                rock = allRocks[i];
            }
            rock.x = x;
            rock.y = y;
            prevXval = xValues[xIndex];
        } else {
            i--;                                    // if same, reset i to run loop again
        }
    }
}


//  Function to set up special collectible 'key'
function keySetUp() {
    gemSetUp(key);              // not adding this to allGems array because we want to
    key.gemIndex = 3;           // avoid resetting the gemIndex
    key.score = 1;              // gemIndex and score are not changed for this object
}

// Function to load the characters for left div id 'characters'
// And set the click event on image element to change the player objects sprite property
function loadCharacters() {
    var tempText;
    for (var i = 0; i < playerCharacters.length; i++) {
        tempText = playerCharacters[i].getAttribute('src').toString();
        tempText = tempText.slice(tempText.indexOf('image'));
        playerCharacters[i].addEventListener('click', function(value) {
            return function() {
                player.sprite = value;
                player.scoreHistory.length = 0;
                message.text = 'Start Game -->';
                message.x = 100;
            };
        }(tempText), false);
    }
}

// Function to check and return x axis value for gem
// to avoid gem under rocks that can't be collected
// and hence can't be reset until game over
function getFreeX() {

    var xVal;

    var firstX, secondX, inRange;
    var xLeft, xRight, xxLeft, xxRight;

    firstX = allRocks[0].x;
    secondX = allRocks[1].x;
    inRange = true;

    xRight = firstX + 50;
    xLeft = firstX - 50;

    xxRight = secondX + 50;
    xxLeft = secondX - 50;

    do {
        xVal = getRandomInt(400,63);

        if ((xVal < xRight && xVal > xLeft) || (xVal < xxRight && xVal > xxLeft)) {
            xVal = getRandomInt(400,63);
        } else {
            inRange = false;
        }
    } while (inRange);

    return xVal;
}

// Function to check if block property for any Rock object is set
function blockCheck() {
    var block = [];
    for (var i = 0; i < allRocks.length ; i++) {
        if (allRocks[i].block !== '') {
            block.push(allRocks[i].block);      // add to array to check in player handleInput method
        }
    }
    return block;
}

// To keep the score panel on right updated
function updateScores() {
    score.textContent = player.score;
    lives.textContent = player.lives;
    gemCollected.textContent = player.gemCollected;
    player.scoreHistory.length === 0 ? highScore.textContent = 0 : highScore.textContent = getMaxOfArray(player.scoreHistory);
    keysCollected.textContent = player.keysCollected;
}

//  Function to return maximum value in an Array
//  Used to determine Highscore in Player objects scoreHistory property
function getMaxOfArray(numArray) {
  return Math.max.apply(null, numArray);
}

// Return random int for x, y or index values
// Uses Math.random() & Math.floor()
function getRandomInt(max, min) {
    return Math.floor(Math.random() * (max - min)) + min;
}

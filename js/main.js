var canvas = document.getElementById("breakout");
var ctx = canvas.getContext("2d");

var pointsTag = document.getElementById("points");
var livesTag = document.getElementById("lives");
var messageTag = document.getElementById("message");

var retrievablePowerupsArr = [];
var bulletsArr = [];
var gameOver = false;
//Brick types
var normalBrick = new Brick(0, -100, -100, 50.0, 25, "#000000", 1, true, true);
var toughBrick = new Brick(1, -100, -100, 50.0, 25, "#ffff00", 3, true, true);
var invincibleBrick = new Brick(2, -100, -100, 50.0, 25, "#ff0000", 100, true, true);
var defaultBricksArr = [normalBrick, normalBrick, normalBrick, normalBrick, toughBrick, toughBrick, toughBrick, invincibleBrick]; //Should order from most common to rarest bricks


//brick amount at game start (memory can only go up to 192)
var brickQuantity = 26;
var gameRunning = true;

//Original Paddle, Ball, and Level properties
var defaultPaddle = new Paddle(canvas.width/2-50, canvas.height-20, 100, 15, 0, .8, "#000000", false, null);
var defaultBall = new Ball(canvas.width/2, canvas.height/3, 10, "purple", 0, 3, 1, 1);
var tempBricksArray = getRandomWeightedArray(defaultBricksArr, brickQuantity);

var j = 0;
var i = 0;
var bricksArray = [];
while (j < brickQuantity) {
    
    if (i === tempBricksArray.length) {
        i = 0;   
    }
    bricksArray.push(tempBricksArray[i]);
    j++;
    i++;
}

var defaultLevel = new Level(0, 0, canvas.width, canvas.height, brickQuantity, bricksArray, retrievablePowerupsArr, defaultPaddle, defaultBall, 1, "#cccccc", false, true);

//Player input
var keyState = {};
window.addEventListener('keydown',function(e){
    keyState[e.keyCode || e.which] = true;
    
},true);

window.addEventListener('keyup',function(e){
    defaultLevel.paddle.xVel = 0;
    keyState[e.keyCode || e.which] = false;
},true);

var gravity = .1;
var terminalVel = 3;

//points, lives, etc
var currentPoints = 0, currentLives = 3;

var messageArr = [];
function messageBox(msg) {
    messageArr.push(msg);
    messageTag.innerHTML = "";
    for (var i = 0; i < messageArr.length; i++) {
        messageTag.innerHTML += messageArr[i] + "<br>";
    }
    
    //clear oldest slot in message box
    setTimeout(function(){
        messageArr.splice(0, 1);
        messageTag.innerHTML = "";
        for (var i = 0; i < messageArr.length; i++) {
            messageTag.innerHTML += messageArr[i] + "<br>";
        }
    }, 3000);
}

function createLevel(level) {
    //clear screen
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.style.background = level.backgroundColor;

    drawBricks(0, 0, 0, level.bricksArr, level.brickQuantity, 1);
    //testDrawBricks(defaultLevel.bricksArr);
    
    level.ball = new Ball(level.ball.x, level.ball.y, level.ball.r, level.ball.c, level.ball.xVel, level.ball.yVel, level.ball.xAngle, level.ball.yAngle);
    level.paddle = new Paddle(level.paddle.x, level.paddle.y, level.paddle.w, level.paddle.h, level.paddle.xVel, level.paddle.speed, level.paddle.outline, level.paddle.stick, level.paddle.guns); 
    level = new Level(level.x, level.y, level.w, level.h, level.brickQuantity, level.bricksArr, level.powerupsArr, level.paddle, level.ball, level.levelNumber, level.backgroundColor, level.finished, level.active);   
    
    drawPowerups(level.powerupsArr);
    if (level.paddle.guns !== null) {
        drawBullets(level.paddle.guns.bulletsArr);
    }
}

function checkVelocity(projectile, terminalVelocity) {
    if (Math.abs(projectile.xVel) > terminalVelocity) {
        projectile.xVel = projectile.xVel/Math.abs(projectile.xVel) * terminalVelocity;   
    }
    if (Math.abs(projectile.yVel) > terminalVelocity) {
        projectile.yVel = projectile.yVel/Math.abs(projectile.yVel) * terminalVelocity;
    }
}

function checkCollisions(level) {
       // console.log(level.powerupsArr);
    
    for (var i = 0; i < level.powerupsArr.length; i++) {
    //    console.log(level.powerupsArr[i]);
        //level.powerupsArr[i].soundOb.frequency.value = (canvas.height - level.powerupsArr[i].y) / 2;   
    }
    
    //ball collision w/ bricks
    var brickOsc = context.createOscillator();
    for (var i = 0; i < level.bricksArr.length; i++) {
        if (i === 0) {
            level.bricksArr[level.bricksArr.length-1].active = true;
        } else {
            level.bricksArr[i-1].active = true;
        }
        
        if (checkObjectCollision(level.bricksArr[i], level.ball, level.ball.x, level.ball.y, level.ball.r, level.ball.r)){
            if (level.bricksArr[i].active) { 
                console.log(level.ball.xVel);
                console.log(level.ball.yVel);
                brickOsc.frequency.value = (level.ball.xVel + level.ball.yVel) * 150;
                brickOsc.connect(context.destination);
                brickOsc.start(0);
            
                setTimeout(function(){
                    brickOsc.stop();
                },200);
                level.ball.yVel = level.ball.yVel * level.ball.yAngle;
                level.ball.xVel = level.ball.xVel * level.ball.xAngle;  
                level.bricksArr[i].hp--;
                if (level.bricksArr[i].hp === 1) {
                    level.bricksArr[i].c = "#000000";
                } else if (level.bricksArr[i].hp === 2) {
                    level.bricksArr[i].c = "#777700";   
                } else if (level.bricksArr[i].hp === 3) {
                    level.bricksArr[i].c = "#ffff00";
                }
                currentPoints+=10;
                level.bricksArr[i].active = false;                    
                break;
            }  
        }
    }

    //ball collision w/ wall
    if (!checkSpecificCollision(level, level.ball, level.ball.x, level.ball.y, level.ball.r/2, level.ball.r/2)) {
        if (level.active) {             
            level.ball.yVel = level.ball.yVel * level.ball.yAngle;
            level.ball.xVel = level.ball.xVel * level.ball.xAngle;
            level.active = false;
       
            setTimeout(function(){
                level.active = true;
            }, 200);
        }
    }
    
    //ball out of bounds error
    if (level.ball.x < -100 || level.ball.x > canvas.width+100 || level.ball.y > canvas.height+100 || level.ball.y < -100) {
        currentLives++;
        die();
         messageBox("Error - Keep Going");
    }
        
    if (!checkSpecificCollision(level, level.ball, level.ball.x, level.ball.y, level.ball.r/2, level.ball.r/2)) {
        if (level.active) {             
            level.ball.yVel = level.ball.yVel * level.ball.yAngle;
            level.ball.xVel = level.ball.xVel * level.ball.xAngle;
            level.active = false;
       
            setTimeout(function(){
                level.active = true;
            }, 200);
        }
    }
    
    
    //paddle collision w/ wall
    if (!checkSpecificCollision(level, level.paddle, level.paddle.x+level.paddle.w/2, level.paddle.y, level.paddle.w/8, level.paddle.h)) {
        if (level.paddle.x < level.paddle.w) {
             level.paddle.x += level.paddle.w/2;  
        }
        if (level.paddle.x > level.w - level.paddle.w) {
             level.paddle.x -= level.paddle.w/2;  
        }
    }
    
    //paddle collision w/ ball
    if (checkSpecificCollision(level.paddle, level.ball, level.ball.x, level.ball.y, level.ball.r, level.ball.r)) {
        level.ball.y = level.paddle.y - level.paddle.h; //reset ball at top of paddle to avoid overlap issues
        if (level.paddle.stick) {
            level.ball.yVel = 0;
            level.ball.xVel = 0;
            level.ball.x = level.paddle.x + level.paddle.w/2; 
            level.ball.y = level.paddle.y - level.paddle.h/1.5;
        } else {
            //How much velocity ball will maintain after bounce
            var paddleAngle = level.paddle.x+level.paddle.w/2 - level.ball.x;
            level.ball.xVel = -paddleAngle/10;
            //console.log(level.ball.xVel);
            //level.ball.xVel = level.ball.xVel + level.paddle.xVel/2; //x velocity
            level.ball.yVel *= -6/Math.abs(level.ball.yVel); //y velocity
        }
    } else if (level.ball.y - level.ball.r > level.paddle.y){
        die();
    }
    
    //powerups collision w/ paddle
    for (var i = 0; i < level.powerupsArr.length; i++) { 
        if (checkSpecificCollision(level.powerupsArr[i], level.paddle, level.paddle.x+level.paddle.w/2, level.paddle.y+level.paddle.h/2, level.paddle.w/2, level.paddle.h/2)) {
            //remove powerup and add to toggled powerups
            messageBox(level.powerupsArr[i].msg);
            activatePowerup(level.powerupsArr[i], level.paddle, level.ball);           
            //level.powerupsArr[i] = null;
            level.powerupsArr.splice(i, 1);
            break;
        }
    }
    
    //powerups collision w/ wall
    for (var i = 0; i < level.powerupsArr.length; i++) {
        if (!checkSpecificCollision(level, level.powerupsArr[i], level.powerupsArr[i].x, level.powerupsArr[i].y, level.powerupsArr[i].w, level.powerupsArr[i].h)) {
            if (level.active) {           
                level.powerupsArr[i].yVel = level.powerupsArr[i].yVel * level.powerupsArr[i].yAngle;
                level.powerupsArr[i].xVel = level.powerupsArr[i].xVel * level.powerupsArr[i].xAngle; 
                level.active = false;  
                
                setTimeout(function(){
                    level.active = true;
                }, 200);
            }
        }
        if (level.powerupsArr[i].y - level.powerupsArr[i].h > level.paddle.y){
            retrievablePowerupsArr[i] = null;
            retrievablePowerupsArr.splice(i, 1);
        }
    }
    
    //bullets collision w/ bricks
    if (level.paddle.guns != null) {
        for (var j = 0; j < level.bricksArr.length; j++) {
            for (var i = 0; i < level.paddle.guns.bulletsArr.length; i++) {
                if (checkObjectCollision(level.bricksArr[j], level.paddle.guns.bulletsArr[i], level.paddle.guns.bulletsArr[i].x, level.paddle.guns.bulletsArr[i].y, level.paddle.guns.bulletsArr[i].w, level.paddle.guns.bulletsArr[i].h)) {
                    currentPoints+=10;
                    level.paddle.guns.bulletsArr[i] = null;  
                    level.paddle.guns.bulletsArr.splice(i, 1);
                    level.bricksArr[j].hp--;  
                    break;
                }
            }
        }
    }
    
    if (Math.abs(level.paddle.xVel) > terminalVel) {
        level.paddle.xVel = level.paddle.xVel/Math.abs(level.paddle.xVel) * terminalVel;   
    }
}

//function checkIfFinished(bricksArray) {
//    for (var i = 0; i < bricksArray.length; i++) {
//      if (bricksArray[i].visible) {
//          defaultLevel.finished = false;
//      }
//    }
//    if (defaultLevel.finished) {
//        return true;   
//    }
//    
//}

//main game loop
function draw() {
 //   if (!paused) {
    createLevel(defaultLevel);
    checkCollisions(defaultLevel);
    checkVelocity(defaultLevel.ball, terminalVel);
    checkVelocity(defaultLevel.powerupsArr, terminalVel);
    
    if (defaultLevel.paddle.guns != null) {
        defaultLevel.paddle.guns = new Guns(defaultLevel.paddle.x-defaultLevel.paddle.guns.w/2, defaultLevel.paddle.y-defaultLevel.paddle.guns.h, defaultLevel.paddle.guns.w, defaultLevel.paddle.guns.h, defaultLevel.paddle.guns.ammo, defaultLevel.paddle.guns.bulletsArr);   
    }
    
    activateGravity();
    checkPlayerAttributes();
    
    //if (checkIfFinished(defaultLevel.bricksArr)) {
      //  newLevel();   
    //}
    
    pointsTag.innerHTML = "Score: " + Math.round(currentPoints);
    livesTag.innerHTML = "Lives: " + currentLives;
    
    //player input
    if (keyState[39] || keyState[68]) { //'d' or right arrow key
     //   keyState[37] = false;
      //  keyState[65] = false;
        movePaddle(1, defaultLevel.paddle);
    }
    if (keyState[37] || keyState[65]) { //'a' or left arrow key  
     //   keyState[39] = false;
     //   keyState[68] = false;
        movePaddle(-1, defaultLevel.paddle);
    }    
    if (keyState[32]) { // spacebar
        if (defaultLevel.paddle.guns != null) {
            var osc = context.createOscillator();
            osc.frequency.value = 300;
            osc.connect(context.destination);
            osc.start(0);
            
            setTimeout(function(){
                osc.stop();
            },200);
            shootBullet(defaultLevel.paddle);
            defaultLevel.paddle.guns.ammo--;
            if (defaultLevel.paddle.guns.ammo <= 0) {
                defaultLevel.paddle.guns = null;
            }
            keyState[32] = false;
        }
        
        if (defaultLevel.paddle.stick) {
            defaultLevel.paddle.stick = false;
            defaultLevel.ball.yVel = 4;
        }
    }
        if (bricksAreDestroyed(defaultLevel.bricksArr, defaultLevel.finished)) {
            defaultLevel.finished = false;
            if (gameRunning) {
                gameRunning = false;
                newLevel();
            }
        } 
  
    if (gameOver) {
        var tempBrick = new Brick(0, canvas.width/2 - 50, 0, 100, 50, defaultLevel.backgroundColor, 1, false, false);
        tempBrick.x += (Math.random() * canvas.width/2) - canvas.width/4;
        if (bonusToggle < 3) {
            requestPowerup(tempBrick, defaultLevel.powerupsArr);
        }
        if (bonusToggle<10) {
            bonusToggle++
        } else {
            bonusToggle = 0;   
        }
    }
}

var bonusToggle = true;

var curInterval;
function gameStart() {
    
    defaultLevel.paddle.stick = true;
    defaultLevel.paddle.x = canvas.width/2 - defaultLevel.paddle.w/2;
    defaultLevel.ball.x = defaultLevel.paddle.x + defaultLevel.paddle.w/2;
    defaultLevel.ball.y = defaultLevel.paddle.y - defaultLevel.paddle.h/2;
    
    //reset velocites
    defaultLevel.ball.yVel = 0;
    defaultLevel.ball.xVel = 0;
    curInterval = setInterval(draw, 10);
    messageBox("Level: " + defaultLevel.levelNumber);
}


gameStart();

function activateGravity() {
    if (defaultLevel.paddle.guns !== null) {
        for (var i = 0; i < defaultLevel.paddle.guns.bulletsArr.length; i++) {
            defaultLevel.paddle.guns.bulletsArr[i].y -= defaultLevel.paddle.guns.bulletsArr[i].yVel; 
        }
    }
    
    for (var i = 0; i < defaultLevel.powerupsArr.length; i++) {
        defaultLevel.powerupsArr[i].yVel += gravity/terminalVel;
        defaultLevel.powerupsArr[i].y += defaultLevel.powerupsArr[i].yVel;
        defaultLevel.powerupsArr[i].x += defaultLevel.powerupsArr[i].xVel;   
    }
    
    defaultLevel.ball.y += defaultLevel.ball.yVel;
    defaultLevel.ball.x += defaultLevel.ball.xVel;
    
    //add points based on x and y velocity
    if (defaultLevel.ball.xVel > 0.1 && defaultLevel.ball.yVel > 0.1) 
        currentPoints += (Math.abs(defaultLevel.ball.yVel) + Math.abs(defaultLevel.ball.xVel))/250; 
    
    if (gameOver) {
        defaultLevel.ball.y = canvas.height/2;
        defaultLevel.ball.x = canvas.width/2;
    }
}

function drawBricks(x, y, i, arr, quantity, spacing) {
    if (i === arr.length) i = 0;
    if (x >= canvas.width-arr[i].w) {
        x = 0;
        y += arr[i].h;
    }
    if (quantity > 0) {
        if (x % arr[i].w === 0) {
            if (arr[i].visible) arr[i] = new Brick(arr[i].id, x, y, arr[i].w, arr[i].h, arr[i].c, arr[i].hp, arr[i].visible, arr[i].active);
            else arr[i].c = defaultLevel.backgroundColor;
            i++;
            quantity--;
        }
        x+=arr[i-1].w*spacing;
        drawBricks(x, y, i, arr, quantity, spacing);
    }
}

function testDrawBricks(arr) {
    var x = canvas.width/2;
    var y = 0;
    while (defaultLevel.brickQuantity > 0) {
        if (y === canvas.width) {
            y += arr[i].h; 
        }
        for (var i = 0; i < arr.length; i++) {
            if (x % arr[i].w === 0) {
                //console.log(x);
                if (arr[i].visible) {
                    arr[i] = new Brick(arr[i].id, x, y, arr[i].w, arr[i].h, arr[i].c, arr[i].hp, arr[i].visible, arr[i].active);
                }
                else { 
                    arr[i].c = defaultLevel.backgroundColor;
                }
                arr[i].x -= arr[i].w; 
                defaultLevel.brickQuantity--;
                x = canvas.width/2;
            }
            x++;
        }
    }
}

function bricksAreDestroyed(arr, finished) {
    finished = true;
    if (gameRunning) {
        
    if (arr.length > 0) {
        var i = 0;
        while (finished && i < arr.length) {
            if (arr[i].id !== 2 && arr[i].visible) finished = false;
            i++;
        }
        if (finished) {
            return true;   
        } else {
            return false;
        }
    }
    } else {
        for (var i = 0; i < defaultLevel.bricksArr.length; i++) {
            if (!defaultLevel.bricksArr[i].visible) {
                defaultLevel.bricksArr[i].visible = true;
                if (defaultLevel.bricksArr[i].id === 0) {
                    defaultLevel.bricksArr[i].hp = 1;
                    defaultLevel.bricksArr[i].c = "#000000";
                } else if (defaultLevel.bricksArr[i].id === 1) {
                    defaultLevel.bricksArr[i].hp = 3;
                    defaultLevel.bricksArr[i].c = "#ffff00";
                } if (defaultLevel.bricksArr[i].id === 2) {
                    defaultLevel.bricksArr[i].hp = 100;
                    defaultLevel.bricksArr[i].c = "#ff0000";
                }
            }
        }
        gameRunning = true;
        return false;   
    }
}

function getRandomWeightedArray(arr, quantity){
    var tmpArr = []; 
    for (var i = 0; i < quantity; i++) {
        var j = 0;
        while (j < arr.length) {
            tmpArr.push(arr[j]);
            j++;
        }
    }
    return shuffle(tmpArr);
}

function shuffle(o){
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

function drawBullets(arr) {
    for (var i = 0; i < arr.length; i++) {
        arr[i] = new Bullets(arr[i].x, arr[i].y, arr[i].w, arr[i].h, arr[i].c, arr[i].xVel, arr[i].yVel, arr[i].damage);    
    }
}

function checkPlayerAttributes() {
    if (currentLives <= 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        endGame();
        currentPoints = 0;
        //currentLives = 3;
        for (var i = 0; i < defaultLevel.bricksArr.length; i++) {
            if (!defaultLevel.bricksArr[i].visible) {
                defaultLevel.bricksArr[i].visible = true;
                if (defaultLevel.bricksArr[i].id === 0) {
                    defaultLevel.bricksArr[i].hp = 1;
                    defaultLevel.bricksArr[i].c = "#000000";
                } else if (defaultLevel.bricksArr[i].id === 1) {
                    defaultLevel.bricksArr[i].hp = 3;
                    defaultLevel.bricksArr[i].c = "#0000ff";
                } if (defaultLevel.bricksArr[i].id === 2) {
                    defaultLevel.bricksArr[i].hp = 100;
                    defaultLevel.bricksArr[i].c = "#ff0000";
                }
            }
        }
    }
}

function movePaddle(key, paddle){
    var maxVel = 4;
    //-1 is move-left key
    if (key === -1) {
      //  compares paddle position to left wall
        if (paddle.x > 0) {
            if (Math.abs(paddle.xVel) < maxVel) {
                paddle.xVel -= 2;           
            }
            paddle.x += paddle.xVel/paddle.speed;   
        } else {
            paddle.x += 15;
            paddle.xVel = 0;   
        }
       // 1 is move-right key
    } else if (key === 1) {
      //  compares paddle position to right wall
        if (paddle.x < canvas.width - paddle.w) {
            if (Math.abs(paddle.xVel) < maxVel) {
                paddle.xVel += 2;  
            }
            paddle.x += paddle.xVel/paddle.speed;  
        } else {
            paddle.x -= 15;
            paddle.xVel = 0;   
        }
    }      
}

function endGame(){
    
    var text2 = new Text(canvas.width/2, canvas.height/2+100, "#000000", "60px", "Final Score: " + Math.round(currentPoints));
    messageBox("Final Score: " + Math.round(currentPoints));
    
    clearInterval(curInterval);
}

function newLevel() {
    defaultLevel.levelNumber++;
    
    defaultLevel.finished = false;
    
    if (defaultLevel.levelNumber > 3) {
        gameOver = true;
        messageBox("Bonus Round!");
    } else {
        defaultLevel.paddle.stick = true;
        defaultLevel.ball.x = defaultLevel.paddle.x + defaultLevel.paddle.w/2;
        defaultLevel.ball.y = defaultLevel.paddle.y - 10;
        
        for (var i = 0; i < defaultLevel.powerupsArr.length; i++) {
            defaultLevel.powerupsArr[i] = null;  
      
            defaultLevel.powerupsArr.splice(i, 1);
        }
        //reset effects from powerups
        defaultLevel.paddle.w = 100;
        defaultLevel.paddle.speed = .8;
        if (defaultLevel.paddle.guns) {
            defaultLevel.paddle.guns = null;
        }
        
        
        if (defaultLevel.brickQuantity != 0) {
            defaultLevel.brickQuantity *= 2;
        } else {
            defaultLevel.brickQuantity++;
        }
        
        var tempBricksArray = getRandomWeightedArray(defaultBricksArr, defaultLevel.brickQuantity);

        var j = 0;
        var i = 0;
        var bricksArray = [];
        while (j < defaultLevel.brickQuantity) {
    
            if (i === tempBricksArray.length) {
                i = 0;   
            }
            bricksArray.push(tempBricksArray[i]);
            j++;
            i++;
        }
        
        defaultLevel = new Level(defaultLevel.x, defaultLevel.y, defaultLevel.w, defaultLevel.h, defaultLevel.brickQuantity, bricksArray, defaultLevel.powerupsArr, defaultLevel.paddle, defaultLevel.ball, defaultLevel.levelNumber, defaultLevel.backgroundColor, defaultLevel.finished, true);
        
        
        
        terminalVel += 1;
        messageBox("Level " + defaultLevel.levelNumber);
    }
}

function die() {
    
    //reset positions
    defaultLevel.paddle.stick = true;
    defaultLevel.paddle.x = canvas.width/2 - defaultLevel.paddle.w/2;
    defaultLevel.ball.x = defaultLevel.paddle.x + defaultLevel.paddle.w/2;
    defaultLevel.ball.y = defaultLevel.paddle.y - defaultLevel.paddle.h/2;
    
    //reset velocites
    defaultLevel.ball.yVel = 0;
    defaultLevel.ball.xVel = 0;
    //reset powerups floating in air
    defaultLevel.powerupsArr.splice(0, defaultLevel.powerupsArr.length);
    //reset effects from powerups
    defaultLevel.paddle.w = 100;
    defaultLevel.paddle.speed = .8;
    if (defaultLevel.paddle.guns) {
        defaultLevel.paddle.guns = null;
    }
    //decrement lives
    currentLives--;
}
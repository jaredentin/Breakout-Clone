function drawPowerups(arr) {
    for (var i = 0; i < arr.length; i++) {
        arr[i] = new Powerup(arr[i].id, arr[i].msg, arr[i].x, arr[i].y, arr[i].w, arr[i].h, arr[i].c, arr[i].xVel, arr[i].yVel, arr[i].xAngle, arr[i].yAngle, arr[i].active);
    }
}

var soundArray = [];
function requestPowerup(brick, arr) {
    if (Math.round(Math.random() * 0) === 0) { //chance of spawning a powerup after brick breaks
      //  var testsound = context.createOscillator();
           // console.log(testsound);
        
        var selecter = Math.round(Math.random() * 6);
        if (selecter === 0) {
            var sound = context.createOscillator();
            //console.log(sound);
            sound.frequency.value = "100";
            arr.push(new Powerup(0, "Extra Life", brick.x, brick.y, 40, 40, "#00dd00", 0, 0, 1, 1, true));
//            console.log(arr[arr.length-1].soundOb);
//            //arr[arr[i].length-1].soundOb
//            arr[arr.length-1].soundOb.connect(context.destination);
//            arr[arr.length-1].soundOb.start(0);
        } else if (selecter === 1) {
            var sound = context.createOscillator();
           sound.frequency.value = "100";
            arr.push(new Powerup(1, "Slow Down Ball", brick.x, brick.y, 40, 40, "#dddd00", 0, 0, 1, 1, true));
//            arr[arr.length-1].soundOb.frequency.value = (canvas.height - arr[arr.length-1].y) * 200;
//            arr[arr.length-1].soundOb.connect(context.destination);
//            arr[arr.length-1].soundOb.start(0);
        } else if (selecter === 2) {
            var sound = context.createOscillator();
            sound.frequency.value = "100";
            arr.push(new Powerup(2, "Lose a Life", brick.x, brick.y, 40, 40, "#000000", 0, 0, 1, 1, true));
//            console.log(arr[arr.length-1].soundOb );
//            arr[arr.length-1].soundOb.connect(context.destination);
//            arr[arr.length-1].soundOb.start(0);
        } else if (selecter === 3) {
            var sound = context.createOscillator();
            sound.frequency.value = "100";
            arr.push(new Powerup(3, "Widen Paddle", brick.x, brick.y, 40, 40, "#0000dd", 0, 0, 1, 1, true));
//            arr[arr.length-1].soundOb.connect(context.destination);
//            arr[arr.length-1].soundOb.start(0);
        } else if (selecter === 4) {
            var sound = context.createOscillator();
            sound.frequency.value = "100";
            arr.push(new Powerup(4, "Speed Up Paddle", brick.x, brick.y, 40, 40, "#00dddd", 0, 0, 1, 1, true));
//            arr[arr.length-1].soundOb.connect(context.destination);
//            arr[arr.length-1].soundOb.start(0);
        } else if (selecter === 5) {
            var sound = context.createOscillator();
            sound.frequency.value = "100";
            arr.push(new Powerup(5, "Sticky Paddle", brick.x, brick.y, 40, 40, "#ff00ff", 0, 0, 1, 1, true));
//            arr[arr.length-1].soundOb.frequency.value = (canvas.height - arr[arr.length-1].y) * 200;
//            arr[arr.length-1].soundOb.connect(context.destination);
//            arr[arr.length-1].soundOb.start(0);
        } else if (selecter === 6) {
            var sound = context.createOscillator();
            sound.frequency.value = "100";
            arr.push(new Powerup(6, "Guns", brick.x, brick.y, 40, 40, "#999999", 0, 0, 1, 1, true));            
//            arr[arr.length-1].soundOb.connect(context.destination);
//            arr[arr.length-1].soundOb.start(0);
        }

        //gives powerup a random trajectory upon spawn
        arr[arr.length-1].xVel = (Math.random() * 3) - 1.5;
        arr[arr.length-1].yVel = (Math.random() * 1.5) - 1.5;
    }
}

function activatePowerup(powerup, paddle, ball) {
    currentPoints+=10;
    if (powerup.id === 0) {
        giveExtraLife();
    } else if (powerup.id === 1) {
        slowDownBall(ball);
    } else if (powerup.id === 2) {
        if (!gameOver) {
            die();   
        } else {
            gameOver = false;
            paddle.guns = null;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            var text2 = new Text(canvas.width/2, canvas.height/2, "#000000", "60px", "Winner!");
            endGame();   
        }
    } else if (powerup.id === 3) {
        widenPaddle(paddle);
    } else if (powerup.id === 4) {
        speedUpPaddle(paddle); 
    } else if (powerup.id === 5) {
        createSticky(paddle);
    } else if (powerup.id === 6) {
        createGuns(paddle);
    }
}

function giveExtraLife() {
    currentLives++;
}

function slowDownBall(ball) {
    ball.xVel /= 2;
    ball.yVel /= 2;
}

function widenPaddle(paddle) {
    if (paddle.w * 2 < canvas.width/2) {
        paddle.w *= 2;
    }
}

function speedUpPaddle(paddle) {
    if (paddle.speed - .2 >= .4) {
        paddle.speed -= .2;
    }
}

function createSticky(paddle) {
    paddle.stick = true;
}

function createGuns(paddle) {
    paddle.guns = new Guns(paddle.x, paddle.y, 10, 20, 10, bulletsArr);
}

function shootBullet(paddle) {
    paddle.guns.bulletsArr.push(new Bullets(paddle.guns.x+paddle.guns.w/2, paddle.guns.y-paddle.guns.h/2, paddle.guns.w/2, paddle.guns.h*1.5, "#ff0000", 0, 15, 1));
    paddle.guns.bulletsArr.push(new Bullets(paddle.guns.x+paddle.w, paddle.guns.y, paddle.guns.w/2, paddle.guns.h*1.5, "#ff0000", 0, 15, 1));
}
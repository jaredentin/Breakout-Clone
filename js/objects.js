function Brick(id, x, y, w, h, c, hp, visible, active){
    this.id = id;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;
    this.hp = hp;
    this.visible = visible;
    this.active = active;
    
    ctx.beginPath();
    ctx.fillStyle = c;
    ctx.fillRect(x, y, w, h);
    ctx.closePath();
}

function Ball(x, y, r, c, xVel, yVel, xAngle, yAngle) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.c = c;
    this.xVel = xVel;
    this.yVel = yVel;
    this.xAngle = xAngle;
    this.yAngle = yAngle;
    
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI, false);
    ctx.fillStyle = c;
    ctx.strokeStyle = c;
    ctx.lineWidth = "5";
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
}

function Paddle(x, y, w, h, xVel, speed, outline, stick, guns) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.xVel = xVel;
    this.speed = speed;
    this.outline = outline;
    this.stick = stick;
    this.guns = guns;
    
    if (stick) {
        outline = "#00dd00";
    } else {
        outline = "#000000";
    }
    ctx.beginPath();
    ctx.fillStyle = "#000000";
    ctx.lineWidth = 5;
    ctx.strokeStyle = outline;
    ctx.strokeRect(x, y, w, h);
    ctx.fillRect(x, y, w, h);
    ctx.closePath();
}

function Powerup(id, msg, x, y, w, h, c, xVel, yVel, xAngle, yAngle, active, soundOb) {
    this.id = id;
    this.msg = msg;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;
    this.xVel = xVel;
    this.yVel = yVel;
    this.xAngle = xAngle;
    this.yAngle = yAngle;
    this.active = active;
    this.soundOb = soundOb;
    
    ctx.beginPath();
    ctx.fillStyle = c;
    ctx.fillRect(x, y, w, h);
    ctx.closePath();
}

function Guns(x, y, w, h, ammo, bulletsArr) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.ammo = ammo;
    this.bulletsArr = bulletsArr;
    
    ctx.beginPath();
    ctx.fillStyle = "#000000";
    ctx.lineWidth = 5;
    if (defaultLevel.paddle.outline === "#000000") {
        ctx.strokeStyle = "#000000";
    } else {
        ctx.strokeStyle = "#00dd00";
    }
    ctx.strokeRect(x, y, w, h);
    ctx.strokeRect(x+defaultLevel.paddle.w, y, w, h);
    
    ctx.fillRect(x, y, w, h);
    ctx.fillRect(x+defaultLevel.paddle.w, y, w, h);
    ctx.closePath();
}

function Bullets(x, y, w, h, c, xVel, yVel, damage) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;
    this.xVel = xVel;
    this.yVel = yVel;
    this.damage = damage;
    
    ctx.beginPath();
    ctx.fillStyle = c;
    ctx.fillRect(x, y, w, h);
    ctx.closePath();
}

function Text(x, y, color, size, content) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = size;
    this.content = content;
    
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.font = size +  " Arial";
    ctx.textAlign = "center";
    ctx.fillText(content, x, y);
    ctx.closePath();   
}

function Level(x, y, w, h, brickQuantity, bricksArr, powerupsArr, paddle, ball, levelNumber, backgroundColor, finished, active) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.brickQuantity = brickQuantity;
    this.bricksArr = bricksArr;
    this.powerupsArr = powerupsArr;
    this.paddle = paddle;
    this.ball = ball;
    this.levelNumber = levelNumber;
    this.backgroundColor = backgroundColor;
    this.finished = finished;
    this.active = active;
}
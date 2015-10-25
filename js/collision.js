function checkObjectCollision(brick, collider, x, y, w, h) {
    if (brick.visible === true) {
        if (brick.hp <= 0) {
            requestPowerup(brick, defaultLevel.powerupsArr);
            brick.visible = false;
        } else if (checkSpecificCollision(brick, collider, x, y, w, h)) return true;   
    }
}

function checkSpecificCollision(rect, collider, x, y, w, h) {
    var distX = Math.abs(x - rect.x-rect.w/2);
    var distY = Math.abs(y - rect.y-rect.h/2);

    if (distX > (rect.w/2 + w)) return false;
    if (distY > (rect.h/2 + h)) return false;

    if (distX <= (rect.w/2)) { //top/bottom collision
        if (typeof collider.xAngle !== "undefined") collider.xAngle = 1;
        if (typeof collider.yAngle !== "undefined") collider.yAngle = -1;
        return true; 
    } 
    if (distY <= (rect.h/2)) { //left/right collision
        if (typeof collider.xAngle !== "undefined") collider.xAngle = -1;
        if (typeof collider.yAngle !== "undefined") collider.yAngle = 1;
        return true; 
    }
    var dx=distX-rect.w/2;
    var dy=distY-rect.h/2;
    return (dx*dx+dy*dy<=(w*h));
}
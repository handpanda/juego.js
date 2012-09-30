// Collide with the sides of the stage
var LOG_COLLISION = false;

function collideWithStageBoundaries(object) {
	var left = object.posX;
	var right = object.posX + object.width;
	var top = object.posY;
	var bottom = object.posY + object.height;

	if (left - 1 + object.velocityX < 0) {
		this.posX = 0;
		
		if (object.velocityX < 0) {
			object.velocityX = 0;
		}
		object.posX = 0;
		object.collideLeft = 1;
	}
	
	if (top - 1 + object.velocityY < 0) {
		this.posY = 0;

		if (object.velocityY < 0) {
			object.velocityY = 0;
		}
		object.posY = 0;
		object.collideUp = 1;
	}
	
	if (right + 1 + object.velocityX > levelWidth){
		this.posX = levelWidth - this.width;
		
		if (object.velocityX > 0) {
			object.velocityX = 0;
		}
		object.posX = levelWidth - object.width;
		object.collideRight = 1;
	}
	
	if (bottom + 1 + object.velocityY > levelHeight){
		this.posY = levelHeight - this.height;
		
		if (object.velocityY > 0) {
			object.velocityY = 0;
		}
		object.posY = levelHeight - object.height;
		object.collideDown = 1;
	}
}

// Only works if object2 is not moving
function collideWithObject(object1, object2) {
	var left1 = object1.posX;
	var left2 = object2.posX;
	var right1 = object1.posX + object1.width;
	var right2 = object2.posX + object2.width;
	var top1 = object1.posY;
	var top2 = object2.posY;
	var bottom1 = object1.posY + object1.height;
	var bottom2 = object2.posY + object2.height;
	
	if ((bottom1 + 1 + object1.velY > top2) &&
		(top1 + object1.velY < bottom2) &&
		(right1 + object1.velX > left2) &&
		(left1 + object1.velX < right2) &&
		bottom1 <= top2) { 
		if (object1.velY >= 0) {
			object1.velY = 0;
			object1.posY = top2 - object1.height;
			object1.colDown = 1;
		}
	}
	if ((bottom1 + object1.velY > top2) &&
		(top1 - 1 + object1.velY < bottom2) &&
		(right1 + object1.velX > left2) &&
		(left1 + object1.velX < right2) &&
		top1 >= bottom2) { 
		if (object1.velY <= 0) {
			object1.velY = 0;
			object1.posY = bottom2;
			object1.colUp = 1;
		}
	}
	if ((bottom1 + object1.velY > top2) &&
		(top1 + object1.velY < bottom2) &&
		(right1 + 1 + object1.velX > left2) &&
		(left1 + object1.velX < right2) &&
		right1 <= left2) { 
		if (object1.velX >= 0) {
			object1.velX = 0;
			object1.posX = left2 - object1.width;
			object1.colRight = 1;
		}
	}
	if ((bottom1 + object1.velY > top2) &&
		(top1 + object1.velY < bottom2) &&
		(right1 + object1.velX > left2) &&
		(left1 - 1 + object1.velX < right2) &&
		left1 >= right2) { 
		if (object1.velX <= 0) {
			object1.velX = 0;
			object1.posX = right2;
			object1.colLeft = 1;
		}
	}
}

function overlap(object1, object2) {
	var left1 = object1.posX + object1.velX;
	var left2 = object2.posX + object2.velX;
	var right1 = left1 + object1.width + object1.velX;
	var right2 = left2 + object2.width + object2.velX;
	var top1 = object1.posY + object1.velY;
	var top2 = object2.posY + object2.velY;
	var bottom1 = top1 + object1.height + object1.velY;
	var bottom2 = top2 + object2.height + object2.velY;
	
	if ((bottom1 > top2) &&
		(top1 < bottom2) &&
		(right1 > left2) &&
		(left1 < right2)) { 
	
		// The two objects' collision boxes overlap
		return true;
	}
	
	// The two objects' collision boxes do not overlap
	return false
}	 

function drawCollisionBox(context, object) {
	if (LOG_COLLISION) {
		// Collision Box
		context.fillStyle = "#777777";
		context.fillRect(object.posX, object.posY, object.width, object.height);
		
		// Colored rectangles to indicate collision
		if (object.colDown == 1) { 
			context.fillStyle = "#ff0000";
			context.fillRect(object.posX + object.width / 4, object.posY + object.height * 3 / 4, object.width / 2, object.height / 4);
		}
		if (object.colUp == 1) { 
			context.fillStyle = "#00ff00";
			context.fillRect(object.posX + object.width / 4, object.posY, object.width / 2, object.height / 4);
		}
		if (object.colLeft == 1) { 
			context.fillStyle = "#0000ff";
			context.fillRect(object.posX, object.posY + object.height / 4, object.width / 4, object.height / 2);
		}
		if (object.colRight == 1) { 
			context.fillStyle = "#ffff00";
			context.fillRect(object.posX + object.width * 3 / 4, object.posY + object.height / 4, object.width / 4, object.height / 2);
		}
	}
}
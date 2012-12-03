JUEGO.LOG_COLLISION = false;

var DIR = {
	LEFT: 0,
	RIGHT: 1,
};

var TYPE = {
	UNDEFINED: -1,
}

var ACTION = {

}

var STATE = {

}

JUEGO.Entity = function( parameters ) {
	this.posX = 0;
	this.posY = 0;
	this.width = 0;
	this.height = 0;

	this.faceDir = DIR.LEFT;	
	this.type = TYPE.UNDEFINED; 
	
	this.velX = 0;
	this.velY = 0;
	this.colRight = false;
	this.colLeft = false;
	this.colDown = false;
	this.colUp = false;

	this.removeThis = false;		
	
	this.spawnQueue = [];	
	
	this.clearCollisionData = function() {
		this.colRight = false;
		this.colLeft = false;
		this.colDown = false;
		this.colUp = false;	
	}
	
	this.turnAround = function() {
		if (this.faceDir == DIR.LEFT) this.faceDir = DIR.RIGHT;
		else if (this.faceDir == DIR.RIGHT) this.faceDir = DIR.LEFT;
	}		
	
	this.spawnEntity = function(ent) {
		this.spawnQueue.push(ent);
	}
	this.hasSpawnedEntities = function() {
		return (this.spawnQueue.length > 0);
	}
	this.getSpawnedEntity = function() {
		return this.spawnQueue.pop();
	}
	
	this.hit = function(object) { }

	this.update = function() {
		this.posX = this.posX + this.velX;
		this.posY = this.posY + this.velY;
	
	}

	this.stimulate = function() { }
	
	this.overlaps = function ( otherEntity ) {
		var left1 = this.posX + this.velX;
		var left2 = otherEntity.posX + otherEntity.velX;
		var right1 = left1 + this.width + this.velX;
		var right2 = left2 + otherEntity.width + otherEntity.velX;
		var top1 = this.posY + this.velY;
		var top2 = otherEntity.posY + otherEntity.velY;
		var bottom1 = top1 + this.height + this.velY;
		var bottom2 = top2 + otherEntity.height + otherEntity.velY;
		
		if ((bottom1 > top2) &&
			(top1 < bottom2) &&
			(right1 > left2) &&
			(left1 < right2)) { 
		
			// The two Entity' collision boxes overlap
			return true;
		}
		
		// The two Entity' collision boxes do not overlap
		return false;
	}
	
	this.collideWith = function( staticEntity ) {
	
		var left1 = this.posX;
		var left2 = staticEntity.posX;
		var right1 = this.posX + this.width;
		var right2 = staticEntity.posX + staticEntity.width;
		var top1 = this.posY;
		var top2 = staticEntity.posY;
		var bottom1 = this.posY + this.height;
		var bottom2 = staticEntity.posY + staticEntity.height;
		
		if ((bottom1 + 1 + this.velY > top2) &&
			(top1 + this.velY < bottom2) &&
			(right1 + this.velX > left2) &&
			(left1 + this.velX < right2) &&
			bottom1 <= top2) { 
			if (this.velY >= 0) {
				this.velY = 0;
				this.posY = top2 - this.height;
				this.colDown = 1;
			}
		}
		if ((bottom1 + this.velY > top2) &&
			(top1 - 1 + this.velY < bottom2) &&
			(right1 + this.velX > left2) &&
			(left1 + this.velX < right2) &&
			top1 >= bottom2) { 
			if (this.velY <= 0) {
				this.velY = 0;
				this.posY = bottom2;
				this.colUp = 1;
			}
		}
		if ((bottom1 + this.velY > top2) &&
			(top1 + this.velY < bottom2) &&
			(right1 + 1 + this.velX > left2) &&
			(left1 + this.velX < right2) &&
			right1 <= left2) { 
			if (this.velX >= 0) {
				this.velX = 0;
				this.posX = left2 - this.width;
				this.colRight = 1;
			}
		}
		if ((bottom1 + this.velY > top2) &&
			(top1 + this.velY < bottom2) &&
			(right1 + this.velX > left2) &&
			(left1 - 1 + this.velX < right2) &&
			left1 >= right2) { 
			if (this.velX <= 0) {
				this.velX = 0;
				this.posX = right2;
				this.colLeft = 1;
			}
		}		
	}
	
	this.drawCollisionBox = function( context ) {
		if ( JUEGO.LOG_COLLISION ) {
			// Collision Box
			context.fillStyle = "gray";
			context.fillRect(this.posX, this.posY, this.width, this.height);
			
			// Colored rectangles to indicate collision
			if (this.colDown == 1) { 
				context.fillStyle = "red";
				context.fillRect(this.posX + this.width / 4, this.posY + this.height * 3 / 4, this.width / 2, this.height / 4);
			}
			if (this.colUp == 1) { 
				context.fillStyle = "green";
				context.fillRect(this.posX + this.width / 4, this.posY, this.width / 2, this.height / 4);
			}
			if (this.colLeft == 1) { 
				context.fillStyle = "blue";
				context.fillRect(this.posX, this.posY + this.height / 4, this.width / 4, this.height / 2);
			}
			if (this.colRight == 1) { 
				context.fillStyle = "yellow";
				context.fillRect(this.posX + this.width * 3 / 4, this.posY + this.height / 4, this.width / 4, this.height / 2);
			}
		}
	}	
	
	this.setValues = function( values ) {
		
		if ( values === undefined ) return;
		
		for ( key in values ) {
			var newValue = values[ key ];
		
			if ( newValue === undefined ) {
				console.warn("- Entity - : Parameter /" + key + "/ undefined"); 
				continue;
			}
		
			if ( key in this ) {
				currentValue = this[ key ];
				
				this[ key ] = newValue;
			}
		}
	}	
}

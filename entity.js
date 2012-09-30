var DIR = {
	LEFT: 0,
	RIGHT: 1,
};

var TYPE = {

}

var ACTION = {

}

var STATE = {

}

var entity = function(posX, posY, width, height, type) {
	this.posX = posX;
	this.posY = posY;
	this.width = width;
	this.height = height;

	this.faceDir;	
	this.type; 
	
	this.velX = 0;
	this.velY = 0;
	this.colRight = false;
	this.colLeft = false;
	this.colDown = false;
	this.colUp = false;

	this.removeThis = false;		
	
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
	
	this.spawnQueue = [];
	this.spawnEntity = function(ent) {
		// // console.log('Entity added');
		this.spawnQueue.push(ent);
		// // console.log(this.spawnQueue.length);
	}
	this.hasSpawnedEntities = function() {
		return (this.spawnQueue.length > 0);
	}
	this.getSpawnedEntity = function() {
		// // console.log('Entity taken');
		return this.spawnQueue.pop();
	}
	
	this.hit = function(object) { }

	this.update = function() {
		this.posX = this.posX + this.velX;
		this.posY = this.posY + this.velY;
	
	}

	this.stimulate = function() { }
}

var entityManager = function() {
	
	this.clear = function() {
		this.men = [];
		this.bugs = [];
		this.traps = [];
	}
	
	this.spawnFromLevelData = function(x, y, val) {
	
	}
	
	this.update = function() {
	
	}
	
	this.cull = function() {
		
	}
	
	this.addEntity = function(ent) {

	}
	
	this.getSpawnedEntities = function() {
	
	}
	
	this.draw = function(context, layer) {
	
	}
}
	

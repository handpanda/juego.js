var LOG_COLLISION = false;

var DIR = {
	left: { X: -1, Y: 0 },
	right: { X: 1, Y: 0 },
	down: { X: 0, Y: 1 },
	up: { X: 0, Y: -1 },
};

/* Collision Groups
 * 
 * If two entities' collision groups are the same, and they are not None, they will not register collisions with each other.
 * Otherwise, they will. 
 * This is mainly used for bullets, bullets one ship shoots can't hurt that ship or its friends
 * 
 */
var GROUP = {
	none: 0,
	player: 1,
	enemy: 2
}

var SHAPE = {
	rect: 0,
	line: 1,
}

////////////
// ENTITY //
////////////

/*
	One of the objects in the game world. Player, enemies, bosses, bullets, explosions, falling rocks, etc.
	
	
*/

var Entity = function( posX, posY, width, height ) {
	// position (top left corner of rectangle that defines entity bounds)
	this.posX = posX;
	this.posY = posY;
	
	// velocity
	this.velX = 0;
	this.velY = 0;
	
	//this.origin = new Vec2( this.posX, this.posY );
	this.angle = 0.0;

	// Dimensions	
	this.width = width;
	this.height = height;

	this.collisionGroup = GROUP.none; // Entities with the same collision group can't hit each other

	this.faceDir = DIR.left; // Facing direction
	this.state = 0; // General-purpose state variable. Not all entities will use it

	this.pathFollower = null;
	
	// Collision flags. All entities have flags for collisions to the left, right, top, and bottom
	this.collideRight = false; 
	this.collideLeft = false;
	this.collideDown = false;
	this.collideUp = false;

	// ghost entities do not participate in collision detection
	this.isGhost = false;

	// Entity is controlled by a player
	this.isPlayer = false;

	// Removal flag. Entities with this flag set will be removed from the game
	this.removeThis = false;		
	
	// Sight region
	this.fieldOfView = null;
	
	// Queue of entities created by this one that will be added to the game. Bullets are a common example
	this.spawnQueue = [];	
	
	// Where to send spawned entities. Usually this is to the spawn queue
	this.spawnTarget = this.spawnQueue;
	
	// Mouse control flags
	this.mouseHover = false;
	this.mouseSelected = false;	

	// For overlap testing
	this.shape = SHAPE.rect;
}

Entity.prototype.constructor = Entity;

////////////////////////
// CLEARCOLLISIONDATA // Resets collision flags
////////////////////////

Entity.prototype.clearCollisionData = function() {
	this.collideRight = false;
	this.collideLeft = false;
	this.collideDown = false;
	this.collideUp = false;	
}

//////////////
// CLEARVEL // Sets vel to zero
//////////////

Entity.prototype.clearVel = function() {
	this.velX = 0;
	this.velY = 0;
}

////////////////
// TURNAROUND // Turn to face left if facing right, turn to face right if facing left
////////////////

Entity.prototype.turnAround = function() {
	if (this.faceDir == DIR.left) this.faceDir = DIR.right;
	else if (this.faceDir == DIR.right) this.faceDir = DIR.left;
}		

/////////////////
// FACETOWARDS //
/////////////////

Entity.prototype.faceTowards = function( otherEntity ) {
	if ( otherEntity.posX < this.posX ) this.faceDir = DIR.left;
	else this.faceDir = DIR.right;
}

/////////////////
// SPAWNENTITY // Add an entity to the spawn queue. It will later be added to the game
/////////////////

Entity.prototype.spawnEntity = function( entity ) {
	entity.collisionGroup = this.collisionGroup;
	this.spawnTarget.push( entity );
}

////////////////////////
// HASSPAWNEDENTITIES // Check if this has spawned any entities
//////////////////////// 

Entity.prototype.hasSpawnedEntities = function() {
	return (this.spawnQueue.length > 0);
}

//////////////////////
// GETSPAWNEDENTITY // Extract a spawned entity from the queue
//////////////////////

Entity.prototype.getSpawnedEntity = function() {
	return this.spawnQueue.pop();
}

/////////////////////////////
// REDIRECTSPAWNEDENTITIES // Send spawned entities somewhere else
/////////////////////////////

Entity.prototype.redirectSpawnedEntities = function( whereTo ) {
	this.spawnTarget = whereTo;
}

/////////////
// HITWITH // Some other entity has overlapped this one, do something
/////////////

Entity.prototype.hitWith = function( otherEntity ) { }

////////////
// UPDATE // Move, change state, spawn stuff
////////////

Entity.prototype.update = function() {
	this.posX = this.posX + this.velX;
	this.posY = this.posY + this.velY;

	this.centerX = this.posX + this.width / 2;
	this.centerY = this.posY + this.height / 2;
}

//////////////
// OVERLAPS // Check if this entity's bounding rectangle overlaps another entity's bounding rectangle
//////////////

Entity.prototype.canOverlap = function ( otherEntity ) {
	return ( this != otherEntity &&
			 !this.isGhost && 
			 !otherEntity.isGhost &&
		 	 ( ( this.collisionGroup == GROUP.none ) || 
		 	   ( otherEntity.collisionGroup == GROUP.none ) || 
		 	   ( this.collisionGroup != otherEntity.collisionGroup ) ) );
}

Entity.prototype.overlaps = function ( otherEntity ) {
	// Two upright rectangles
	if ( this.shape == SHAPE.rect && otherEntity.shape == SHAPE.rect ) {
		var left1 = this.posX + this.velX;
		var left2 = otherEntity.posX + ( otherEntity.velX < 0 ? otherEntity.velX : 0 );
		var right1 = left1 + this.width + this.velX;
		var right2 = left2 + otherEntity.width + ( otherEntity.velX > 0 ? otherEntity.velX : 0 );
		var top1 = this.posY + this.velY;
		var top2 = otherEntity.posY + ( otherEntity.velY < 0 ? otherEntity.velY : 0 );
		var bottom1 = top1 + this.height + this.velY;
		var bottom2 = top2 + otherEntity.height + ( otherEntity.velY > 0 ? otherEntity.velY : 0 );
		
		if ((bottom1 > top2) &&
			(top1 < bottom2) &&
			(right1 > left2) &&
			(left1 < right2)) { 
		
			// The two objects' collision boxes overlap
			return true;
		}
	// Rectangle and a line	
	} else if ( this.shape == SHAPE.rect && otherEntity.shape == SHAPE.line ) {
		return this.rectOverlapsLine( otherEntity );
	} else if ( this.shapw == SHAPE.line && otherEntity.shape == SHAPE.rect ) { 
		return otherEntity.rectOverlapsLine( this );
	}
	
	// The two objects' collision boxes do not overlap
	return false;
}

//////////////////
// LINEOVERLAPS //
//////////////////

Entity.prototype.rectOverlapsLine = function( otherEntity ) {
	var leftLine = new Line( this.posX, this.posY, this.posX, this.posY + this.height);
	var rightLine = new Line( this.posX + this.width, this.posY, this.posX + this.width, this.posY + this.height);
	var topLine = new Line( this.posX, this.posY, this.posX + this.width, this.posY); 
	var bottomLine = new Line( this.posX, this.posY + this.height, this.posX + this.width, this.posY + this.height);

	if ( leftLine.intersect( otherEntity ) != null || 
		 rightLine.intersect( otherEntity ) != null ||
		 topLine.intersect( otherEntity ) != null ||
		 bottomLine.intersect( otherEntity ) != null ) {
		return true;
	}

	return false;
}

///////////////////
// ANGLEOVERLAPS // Do two angled entities overlap?
///////////////////

Entity.prototype.angleOverlaps = function( otherEntity ) {
	if ( this.containedBy( otherEntity ) || otherEntity.containedBy( this ) ) {
		return true;
	}

	return false;
}

/////////////////
// CONTAINEDBY // Does one entity contain any of the corners of the caller?
/////////////////

Entity.prototype.containedBy = function( otherEntity ) {
	var pos = new Vec2( this.posX, this.posY );

	var topLeft = ( new Vec2( 0, 0 ) ).rotate( this.angle ).add( pos );
	var topRight = ( new Vec2( this.width, 0 ) ).rotate( this.angle ).add( pos );
	var bottomLeft = ( new Vec2( 0, this.height ) ).rotate( this.angle ).add( pos );
	var bottomRight = ( new Vec2( this.width, this.height ) ).rotate( this.angle ).add( pos );

	if ( otherEntity.containsPoint( topLeft ) ||
		 otherEntity.containsPoint( topRight ) ||
		 otherEntity.containsPoint( bottomLeft ) ||
		 otherEntity.containsPoint( bottomRight ) ) {
		return true;
	}

	return false;
}

///////////////////
// CONTAINSPOINT // Ask whether this entity contains a particular Vec2 point
/////////////////// 

Entity.prototype.containsPoint = function( point ) {
	var p = point.minus( new Vec2( this.posX, this.posY ) );
	p.rotate( -this.angle ); // Why
	p.add( new Vec2( this.posX, this.posY ) );

	if ( p.x >= this.posX && p.x <= this.posX + this.width &&
		 p.y >= this.posY && p.y <= this.posY + this.height ) {
		return true;
	}

	return false;
}

//////////////////
// COLLIDELEFT  // Do something when we hit a wall
// COLLIDERIGHT //
// COLLIDEUP    //
// COLLIDEDOWN  //
////////////////// 

Entity.prototype.onCollideLeft = function() {
	this.velX = 0;
}

Entity.prototype.onCollideRight = function() {
	this.velX = 0;
}

Entity.prototype.onCollideDown = function() {
	this.velY = 0;
}

Entity.prototype.onCollideUp = function() {
	this.velY = 0;
}

/////////////////
// COLLIDEWITH // Check if two entities collide and correct any overlap
/////////////////

Entity.prototype.collideWith = function( staticEntity ) {

	// "this" is entity 1, the other entity is 2
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
			this.onCollideDown();
			this.posY = top2 - this.height;
			this.collideDown = 1;
		}
	}
	
	if ((bottom1 + this.velY > top2) &&
		(top1 - 1 + this.velY < bottom2) &&
		(right1 + this.velX > left2) &&
		(left1 + this.velX < right2) &&
		top1 >= bottom2) { 
		if (this.velY <= 0) {
			this.onCollideUp();
			this.posY = bottom2;
			this.collideUp = 1;
		}
	}
	
	if ((bottom1 + this.velY > top2) &&
		(top1 + this.velY < bottom2) &&
		(right1 + 1 + this.velX > left2) &&
		(left1 + this.velX < right2) &&
		right1 <= left2) { 
		if (this.velX >= 0) {
			this.onCollideRight();
			this.posX = left2 - this.width;
			this.collideRight = 1;
		}
	}
	
	if ((bottom1 + this.velY > top2) &&
		(top1 + this.velY < bottom2) &&
		(right1 + this.velX > left2) &&
		(left1 - 1 + this.velX < right2) &&
		left1 >= right2) { 
		if (this.velX <= 0) {
			this.onCollideLeft();
			this.posX = right2;
			this.collideLeft = 1;
		}
	}		
}

///////////////
// SETVALUES // Set variable values of this entity
///////////////

/*
 * A list of varname-value pairs to set
 */

Entity.prototype.setValues = function( values ) {

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

//////////
// DRAW // Draw this
//////////

/*
 * context - an HTML5 2D drawing context to draw with
 */

Entity.prototype.draw = function( context ) { 
	this.drawCollisionBox( context );
	//context.fillStyle = "black";
	//context.font = "bold 20px arial";
	//context.fillText( this.state, this.posX, this.posY );
}

//////////////
// DRAWRECT // Draw this entity's bounding rectangle
////////////// 

/*
 * context - an HTML5 2D drawing context to draw with
 */

Entity.prototype.drawRect = function( context ) {
	context.save();
		//context.translate( this.posX + this.width / 2, this.posY + this.height / 2 );
		//context.rotate( this.angle );
		//context.fillRect( -this.width / 2, -this.height / 2, this.width, this.height );
		context.fillRect( this.posX, this.posY, this.width, this.height );
	context.restore();
}

//////////////////////
// DRAWCOLLISIONBOX // Draw this entity's bounding rectangle
//////////////////////

/*
 * context - an HTML5 2D drawing context to draw with
 */

Entity.prototype.drawCollisionBox = function( context ) {
	//if ( LOG_COLLISION ) {
		// Collision Box
		context.fillStyle = "gray";
		if ( this.mouseHover ) context.fillStyle = "red";
		if ( this.mouseSelected ) context.fillStyle = "green";
		context.globalAlpha = 0.6;
		this.drawRect( context );
		
		context.fillStyle = "black";

		// Rectangles to indicate collision
		if (this.collideDown == 1) { 
			context.fillRect(this.posX + this.width / 4, this.posY + this.height * 3 / 4, this.width / 2, this.height / 4);
		}
		if (this.collideUp == 1) { 
			context.fillRect(this.posX + this.width / 4, this.posY, this.width / 2, this.height / 4);
		}
		if (this.collideLeft == 1) { 
			context.fillRect(this.posX, this.posY + this.height / 4, this.width / 4, this.height / 2);
		}
		if (this.collideRight == 1) { 
			context.fillRect(this.posX + this.width * 3 / 4, this.posY + this.height / 4, this.width / 4, this.height / 2);
		}

		context.globalAlpha = 1.0;
	//}
}	

Entity.prototype.onClick = function() {
	
}
	
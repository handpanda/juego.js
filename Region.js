var Region = function( params ) {
	Entity.call( this );
	
	this.containsPlayer = false;
	this.playerX = 0;
	this.playerY = 0;
	
	this.inAir = false;

	this.setValues( params );
}

Region.prototype = new Entity();
Region.prototype.constructor = Region;

Region.prototype.clearCollisionData = function() {
	this.inAir = true;
	this.containsPlayer = false;
}

Region.prototype.hitWith = function( otherEntity ) {
	if ( otherEntity.isPlayer ) {
		this.containsPlayer = true;
		this.playerX = otherEntity.posX;
		this.playerY = otherEntity.posY;
	}
}

Region.prototype.draw = function( context ) {
	if ( LOG_COLLISION ) {
		context.fillStyle = "yellow";
		if ( this.containsPlayer ) context.fillStyle = "red";
		if ( this.inAir ) context.fillStyle = "green";
		context.globalAlpha = 0.3;
		this.drawRect( context );
		context.globalAlpha = 1.0;
	}
}

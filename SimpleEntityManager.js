/*
	SimpleEntityManager

	Entity manager class
*/

var SimpleEntityManager = function() {
	this.world = [];
	this.actors = [];
	this.effects = [];
}

// Do something for each entity
// func should take a single argument, the entity
SimpleEntityManager.prototype.doForAllEntities = function( func ) {
	for ( w in this.world ) {
		func( this.world[w] );
	}

	for ( a in this.actors ) {
		func( this.actors[a] );
	}

	for ( e in this.effects ) {
		func( this.effects[e] );
	}
}

SimpleEntityManager.prototype.clear = function() {
	this.world = [];
	this.actors = [];
	this.effects = [];
}

// Helper functions for collision
var overlapList = function( entity, entityList ) {
	for ( e in entityList ) {
		otherEntity = entityList[e];

		if ( entity.canOverlap( otherEntity ) && entity.overlaps( otherEntity ) ) {
			otherEntity.hitWith( entity );
			entity.hitWith( otherEntity );
		}
	}	
}

var collideList = function( entity, entityList ) {
	for ( e in entityList ) {
		otherEntity = entityList[e];

		if ( entity.canOverlap( otherEntity ) ) {
			entity.collideWith( otherEntity );
		}
	}	
}

SimpleEntityManager.prototype.collide = function( level ) {
	this.doForAllEntities( function( entity ) {
		entity.clearCollisionData();
	});

	for ( a in this.actors ) {
		collideList( this.actors[a], this.world );
	}

	for ( a in this.actors ) {
		overlapList( this.actors[a], this.actors );
	}
}

SimpleEntityManager.prototype.update = function() {
	this.collide();

	this.doForAllEntities( function( entity ) {
		entity.update();
	});

	this.grab();
	this.cull();
}
	
var cullEntityList = function( entityList ) {
	for ( e in entityList ) {
		if ( entityList[e].removeThis ) entityList.splice( e, 1 );
	}
}

SimpleEntityManager.prototype.cull = function() {
	cullEntityList( this.world );
	cullEntityList( this.actors );
	cullEntityList( this.effects );
}
	
SimpleEntityManager.prototype.grab = function() {
	var spawnedEntities = [];

	this.doForAllEntities( function( entity ) {
		while( entity.hasSpawnedEntities() ) {
			spawnedEntities.push( entity.getSpawnedEntity() );
		}
	});
		
	for (var i = 0; i < spawnedEntities.length; i++) {
		this.add( spawnedEntities[i] );
	}
}

SimpleEntityManager.prototype.add = function( entity ) {
	if ( entity instanceof Actor ) {
		this.actors.push( entity );
	} else if ( entity instanceof Effect ) {
		this.effects.push( entity );
	} else if ( entity instanceof Entity ) {
		this.world.push( entity );
	}

}

SimpleEntityManager.prototype.draw = function(context, layer) {
	this.doForAllEntities( function( entity ) {
		entity.draw( context );
		if (LOG_COLLISION) entity.drawCollisionBox( context );
	});	
}
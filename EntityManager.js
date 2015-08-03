/*
	EntityManager

	Entity manager class
*/

var EntityManager = function() {
	this.spawns = [];
}

// Do something for each entity
// func should take a single argument, the entity
EntityManager.prototype.doForAllEntities = function( func ) {

}

EntityManager.prototype.clear = function() {

}

// Helper function
var overlapList = function( entity, entityList ) {
	for ( e in entityList ) {
		otherEntity = entityList[e];
		
		if ( entity.canOverlap( otherEntity ) && entity.overlaps( otherEntity ) ) {
			otherEntity.hitWith( entity );
			entity.hitWith( otherEntity );
		}
	}	
}

EntityManager.prototype.takeInput = function() {

}

EntityManager.prototype.collide = function( level ) {

}

EntityManager.prototype.update = function() {

}
	
var cullEntityList = function( entityList ) {
	for ( e in entityList ) {
		if ( entityList[e].removeThis ) entityList.splice( e, 1 );
	}
}

EntityManager.prototype.cull = function() {
		
}
	
EntityManager.prototype.grab = function() {
	var spawnedEntities = [];

	this.doForAllEntities( function( entity ) {
		while( entity.hasSpawnedEntities() ) {
			spawnedEntities.push( entity.getSpawnedEntity() );
		}
	});
		
	for (var i = 0; i < spawnedEntities.length; i++) {
		this.insert( spawnedEntities[i] );
	}
}

EntityManager.prototype.insert = function( entity ) {
	
}

EntityManager.prototype.addSpawn = function( index, object ) {
	this.spawns[index] = object;
}

EntityManager.prototype.spawn = function( scrollBox, level ) {
	
}

EntityManager.prototype.draw = function(context, layer) {
	this.doForAllEntities( function( entity ) {
		entity.draw( context );
		if (LOG_COLLISION) entity.drawCollisionBox( context );
	});	
}

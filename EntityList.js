var EntityList = function() {
	var entities = [];
}

EntityList.prototype.overlaps = function( entity ) {
	for ( e in this.entities ) {
		otherEntity = entityList[e];
		
		if ( 	!( entity.collisionGroup == GROUP.none ) &&
				( ( entity.collisionGroup == GROUP.all ) || ( otherEntity.collisionGroup == GROUP.all ) || 
					( entity.collisionGroup != otherEntity.collisionGroup ) ) && 
				entity.overlaps( otherEntity ) ) {
			
			otherEntity.hitWith( entity );
			entity.hitWith( otherEntity );
		}
	}	
}

EntityList.prototype.cull = function() {
	for ( e in this.entities ) {
		if ( this.entities[e].removeThis ) this.entities.splice( e, 1 );
	}	
}
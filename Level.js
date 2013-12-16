///////////
// LEVEL //
///////////

/*
	Class that holds and maintains all of the data used for a level.
	This "data" amounts to:
		-the width (hTiles) and height (vTiles) of the level in tiles
		-several grids of tiles ("layers"):
			-drawing layers for visuals
			-a collision layer for interaction with the level
			-a spawn layer for specifying points where objects will be created
		-the tile size of the images used in the level
		-several scrolling backgrounds
		-an image to use for the draw layers
		
		loadFromTiledJSON() - Read level data from a JSON file written by the tile editor program Tiled
		getCollisionData() - Reads from the collision layer
		getSpawnData() - Reads from the spawn layer
		setSpawnData() - Writes to the spawn layer
		collide() - Tests an entity for collision against the collision layer and corrects overlap with solid regions
		draw() - Draws the background and visible layers of the level
		
		Usage:
			loadFromTiledJSON
				call once, before the level has started
			getCollisionData
				not necessary to call externally, but may be useful for predictive AI
			getSpawnData
			setSpawnData
				use when creating entities - call getSpawnData to find spawn points, and setSpawnData to clear them so they're only used once
			collide
				call once per entity per cycle
			draw
				call once per cycle 
*/

var Level = function() {
	this.hTiles = 0;
	this.vTiles = 0;
	
	this.drawLayers = [];
	
	this.collisionLayer = null;
	this.spawnLayer = null;
	
	this.tileWidth = 0;
	this.tileHeight = 0;

	this.image = null;

	this.properties = [];

	this.shapes = [];
}

///////////////////////
// LOADFROMTILEDJSON // Load a tilemap made with the map editor program Tiled
///////////////////////	
	
/*
 * levelFileName - name of the level file
 * callback - function to call when the level has finished loading
 */	

Level.prototype.loadFromTiledJSON = function( levelFilename, callback ) {
	console.log( "Attempting to load " + levelFilename + " as Tiled JSON" );

	var tileOffset = 0;
	
	level = this;
	
	$.ajax({
		type: "POST",
		url: "load.php",

		data: { filename: levelFilename },
		success: function( filedata ) {
			
			console.log( "FILE: " + filedata );

			levelData = JSON.parse( filedata );			
			console.log( "Here's " + levelFilename);
			console.log( levelData );
			
			level.hTiles = levelData.width;
			level.vTiles = levelData.height;
			level.tileWidth = levelData.tilewidth;
			level.tileHeight = levelData.tileheight;
			level.properties = levelData.properties;
			
			for ( l in levelData.layers ) {
				filelayer = levelData.layers[l];
				
				var layer = new TileArray( filelayer.width, filelayer.data );
				
				if ( filelayer.name == "Collision" || filelayer.name == "collision" ) {
					level.collisionLayer = layer;
				} else if ( filelayer.name == "Spawn" || filelayer.name == "spawn" ) {
					level.spawnLayer = layer;
				} else {
					level.drawLayers.push( layer );
				}
			}

			for ( t in levelData.tilesets ) {
				tileset = levelData.tilesets[t];
				
				if ( tileset.name == "Collision" || tileset.name == "collision" ) {
					if ( level.collisionLayer != null ) {
						level.collisionLayer.map( function( r, c, val ) {
							var newVal = val - tileset.firstgid;
							if ( newVal < 0 ) newVal = 0;
						
							level.collisionLayer.set( r, c, newVal );
						} ); 
					}
				} else if ( tileset.name == "Spawn" || tileset.name == "spawn" ) {
					if ( level.spawnLayer != null ) {
						level.spawnLayer.map( function( r, c, val ) {
							var newVal = val - tileset.firstgid;
							if ( newVal < 0 ) newVal = 0;
						
							level.spawnLayer.set( r, c, newVal );
						} ); 
					}			
				} else {
					level.image = new AnimatedImage( tileset.image, tileset.tilewidth, tileset.tileheight, 0, 0, []);
				}										
			}	
			
			callback();
		}	
	});	
}

/* Set the background layer images
 *  imageFileNames - the file names of the background layer images
 *		in order from front to back
 */
Level.prototype.setBackgrounds = function(backgrounds) {
	for (var i = 0; i < backgrounds.length; i++) {
		this.parallaxingBackground.addLayer(new BackgroundLayer(backgrounds[i].image, backgrounds[i].scrollSpeed));
	}
}

Level.prototype.bouncecast = function( line, maxBounces ) {
	var points = [];	
	points.push( line.p1 );

<<<<<<< HEAD
<<<<<<< HEAD
	var line2 = new Line( line );

	do {
		var rayHit = this.shapecast( line2 );
		if ( rayHit ) {
			points.push( rayHit.point );

			if ( !rayHit.material ) break;

			var dir = rayHit.reflect( line2.getDirection() );

			line2.p1.set( rayHit.point.plus( dir.times( 3 ) ) );
			line2.p2.set( line2.p1.plus( dir.times( 300 ) ) );
		} else {
			points.push( line2.p2 );

			break;
		}
	} while( points.length < maxBounces );
=======
=======
>>>>>>> 313e58bbecc851b8809902c0e03c0a0568ef667f
	var ray = new Ray();

	var line2 = new Line( line );

	do {
		ray = this.shapecast( line2 );
		points.push( ray.point );

		if ( ray.dir != null ) {
			// Fudge along the ray a bit so we don't hit the same shape again
			line2.p1.set( ray.point.plus( ray.dir.times( 3 ) ) );
			line2.p2.set( line2.p1.plus( ray.dir.scale( 300 ) ) );
		}

	} while( ray.dir && points.length < maxBounces);
<<<<<<< HEAD
>>>>>>> 313e58bbecc851b8809902c0e03c0a0568ef667f
=======
>>>>>>> 313e58bbecc851b8809902c0e03c0a0568ef667f

	return points;
}

Level.prototype.shapecast = function( line ) {
	var closestRayHits = [];

	for ( s in this.shapes ) {
		rayHits = this.shapes[s].rayIntersect( line );

		if ( rayHits.length > 0 ) closestRayHits.push( rayHits[0] );
	}

	if ( closestRayHits.length > 0 ) {
		closestRayHits.sort( function( a, b ) { return Math.abs( a.point.x - line.p1.x ) - Math.abs( b.point.x - line.p1.x ) } );

<<<<<<< HEAD
<<<<<<< HEAD
		return closestRayHits[0]; 
	} else {
		return null;
=======
=======
>>>>>>> 313e58bbecc851b8809902c0e03c0a0568ef667f
		var dir = closestRayHits[0].reflect( line.getDirection() );

		return new Ray( closestRayHits[0].point, dir ); 
	} else {
		return new Ray( line.p2.copy(), null );
<<<<<<< HEAD
>>>>>>> 313e58bbecc851b8809902c0e03c0a0568ef667f
=======
>>>>>>> 313e58bbecc851b8809902c0e03c0a0568ef667f
	}	
}

Level.prototype.setScrollBoxInitialPosition = function(scrollBox) {
	for (var r = 0; r < this.vTiles; r++) {
		for (var c = 0; c < this.hTiles; c++) {
			if (this.getSpawnData(r, c) == SPAWNINDICES.startPosition) {
				console.log("Setting initial position to (" + r + ", " + c + ")");
				scrollBox.hScroll = c * this.tileWidth;
				scrollBox.vScroll = r * this.tileHeight;
				return;
			}
		}
	}
}
	
//////////////////////
// GETCOLLISIONDATA // Return data from the collision layer
////////////////////// 	
	 
/*
 * r - row
 * c - column
 */
Level.prototype.getCollisionData = function( r, c ) {
	if ( this.collisionLayer == null ) return 0;
	
	return this.collisionLayer.get( r, c );
}

//////////////////
// GETSPAWNDATA // Return data from the spawn layer
////////////////// 		
	
/*
 * r - row
 * c - column
 */	
Level.prototype.getSpawnData = function( r, c ) {
	if ( this.spawnLayer == null ) return 0;

	return this.spawnLayer.get( r, c );
}
	
//////////////////
// SETSPAWNDATA // Set data from the spawn layer
//////////////////	
	
/*
 * r - row
 * c - column
 * val - value to write
 */	
Level.prototype.setSpawnData = function( r, c, val ) {
	if ( this.spawnLayer == null ) return;

	this.spawnLayer.set( r, c, val );
}

/////////////
// COLLIDE // Test an entity against the solid parts of the level, prevent it from going through walls
/////////////	
	
/*
 * entity - the Entity that will be tested for collision
 */	
	
Level.prototype.collide = function( entity ) {
	if ( this.collisionLayer == null ) return;

	var block = new Region( { width: this.tileWidth, height: this.tileHeight } );

	for (var c = Math.floor( entity.posX / this.tileWidth ) - 1; c <= Math.ceil( ( entity.posX + entity.width ) / this.tileWidth ) + 1; c++ ) {
		for (var r = Math.floor( entity.posY / this.tileHeight ) - 1; r <= Math.ceil( ( entity.posY + entity.height ) / this.tileHeight ) + 1; r++ ) {
			if ( c >= 0 && c < this.hTiles && r >= 0 && r < this.vTiles ) {
				var index = this.collisionLayer.get( r, c );
			
				if ( index > 0 ) {
					block.posX = c * this.tileWidth;
					block.posY = r * this.tileHeight;
				}
			
				switch ( index ) {
					case 1: // Solid
						entity.collideWith( block );
						break;
					case 2: // Water
						if ( entity.overlaps( block ) ) {
							entity.overlapWater();
						}
						break;
					case 3: // Lava
						if ( entity.overlaps( block ) ) {
							entity.overlapLava();
						}
						break;
				} 
			}
		}
	}		
}	

	
Level.prototype.doesCollide = function( entity ) {
	if ( this.collisionLayer == null ) return;

	var block = new Region( { width: this.tileWidth, height: this.tileHeight } );

	for (var c = Math.floor( entity.posX / this.tileWidth ) - 1; c <= Math.ceil( ( entity.posX + entity.width ) / this.tileWidth ) + 1; c++ ) {
		for (var r = Math.floor( entity.posY / this.tileHeight ) - 1; r <= Math.ceil( ( entity.posY + entity.height ) / this.tileHeight ) + 1; r++ ) {
			if ( c >= 0 && c < this.hTiles && r >= 0 && r < this.vTiles ) {
				var index = this.collisionLayer.get( r, c );
			
				if ( index > 0 ) {
					block.posX = c * this.tileWidth;
					block.posY = r * this.tileHeight;
				}
			
				switch ( index ) {
					case 1: // Solid
						if ( entity.overlaps( block ) ) entity.inAir = false;
						break;
				} 
			}
		}
	}		
}	
	
Level.prototype.collideAction= function( entity, func ) {
	if ( this.collisionLayer == null ) return;

	var block = new Region( { width: this.tileWidth, height: this.tileHeight } );

	for (var c = Math.floor( entity.posX / this.tileWidth ) - 1; c <= Math.ceil( ( entity.posX + entity.width ) / this.tileWidth ) + 1; c++ ) {
		for (var r = Math.floor( entity.posY / this.tileHeight ) - 1; r <= Math.ceil( ( entity.posY + entity.height ) / this.tileHeight ) + 1; r++ ) {
			if ( c >= 0 && c < this.hTiles && r >= 0 && r < this.vTiles ) {
				var index = this.collisionLayer.get( r, c );

				block.posX = c * this.tileWidth;
				block.posY = r * this.tileHeight;

				func( r, c, index, block );	
			}
		}
	}
}

Level.prototype.drawBackground = function( context, scrollBox ) {
	this.parallaxingBackground.draw( context, scrollBox );
}
	
Level.prototype.drawForeground = function( context, scrollBox ) {
	
	level = this;
		
	var drawFunc = function( l, r, c ) {
		level.image.draw( context, c * scrollBox.tileW, r * scrollBox.tileH, level.drawLayers[ l ].get( r, c ) - 1, 1.0, false, false );		
	};
	
	if ( this.image == null ) drawFunc = function( l, r, c ) {
		if ( level.drawLayers[ l ].get( r, c ) > 0 ) {
			context.fillRect( c * scrollBox.tileW, r * scrollBox.tileH, scrollBox.tileW, scrollBox.tileH );
		}			
	};
		
	// Draw the tile layers
	for (var l = 0; l < this.drawLayers.length; l++) {			
		context.fillStyle = 'black';
		
		for (var c = scrollBox.hLoTileIndex; c < scrollBox.hHiTileIndex; c++) {
			for (var r = scrollBox.vLoTileIndex; r < scrollBox.vHiTileIndex; r++) {
				drawFunc( l, r, c );
			}
		}
	}
	
	if ( LOG_COLLISION ) {
		// Draw the collision layer - for debugging
		context.fillStyle = 'red';
		
		if ( this.collisionLayer != null ) {
			for (var c = scrollBox.hLoTileIndex; c < scrollBox.hHiTileIndex; c++) {
				for (var r = scrollBox.vLoTileIndex; r < scrollBox.vHiTileIndex; r++) {
					if ( this.collisionLayer.get( r, c ) > 0 ) {
						context.fillRect( c * scrollBox.tileW + 4, r * scrollBox.tileH + 4, scrollBox.tileW / 2, scrollBox.tileH / 2 );
					}
				}
			}
		}
	}
}
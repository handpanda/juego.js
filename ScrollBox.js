///////////////
// SCROLLBOX //
///////////////

/*
	Handles the scrolling window of tiles the player sees as the level progresses. 
	Doesn't actually contain any data about the level, just the size of the screen.

	calcValues() - sets some derived quantites about the map
	
*/

var ScrollBox = function( parameters ) {
	
	// Quantities measured in TILES

		// Constant with scrolling 
		this.hTiles = 0; 		// Horizontal Tiles, width of the map in tiles
		this.vTiles = 0; 		// Vertical Tiles, height of the map in tiles
		this.numTiles = 0; 		// Total number of tiles in map
		 
		// Change with scrolling 
		this.hLoTileIndex = 0; 	// Horizontal Low Tile Index, the leftmost tile that can be seen in the viewport
		this.hHiTileIndex = 0; 	// Horizontal High Tile Index, the rightmost tile that can be seen in the viewport
		this.vLoTileIndex = 0; 	// Vertical Low Tile Index, the topmost tile that can be seen in the viewport
		this.vHiTileIndex = 0; 	// Vertical High Tile Index, the bottommost tile that can be seen in the viewport
	
	// Quantities measured in PIXELS
	
		// Constant with scrolling 
		this.tileW = 0; 		// Tile Width, in pixels
		this.tileH = 0; 		// Tile Height, in pixels
		this.viewportW = 0; 	// Viewport Width, width of the visible area in pixels
		this.viewportH = 0; 	// Viewport Height, height of the visible area in pixels
		this.hPixels = 0; 		// Horizontal Pixels, width of the map in pixels
		this.vPixels = 0; 		// Vertical Pixels, height of the map in pixels
		
		// Change with scrolling
		this.hScrollSpeed = 0;  // Horizontal scrolling speed
		this.vScrollSpeed = 0;  // Vertical scrolling speed
		this.hScroll = 0; 		// Horizontal Scroll, horizontal offset (x-axis) from the origin in pixels
		this.vScroll = 0; 		// Vertical Scroll, vertical offset (y-axis) from the origin in pixels
		this.hOffset = 0; 		// Horizontal Offset, horizontal distance (x-axis) from the upper-left corner of the viewport going left to the nearest gridline
		this.vOffset = 0; 		// Vertical Offset, vertical distance (y-axis) from the upper-left corner of the viewport going up to the nearest gridline
	
	this.calcValues();
	
	this.setValues( parameters );
	
	this.updateScroll();
}	

////////////////
// CALCVALUES // Derive values based on grid information
////////////////

ScrollBox.prototype.calcValues = function() {
	this.numTiles = this.hTiles * this.vTiles;
	this.hPixels = this.hTiles * this.tileW;
	this.vPixels = this.vTiles * this.tileH;
}

///////////////////
// SCREEN TOTILE // Take screen coordinates and transfer them to the grid
///////////////////

ScrollBox.prototype.screenXToTile = function ( posX ) {
	return cap( Math.floor( ( posX + this.hScroll ) / this.tileW ), 0, this.hTiles );
}

ScrollBox.prototype.screenYToTile = function ( posY ) {
	return cap( Math.floor( ( posY + this.vScroll ) / this.tileH ), 0, this.vTiles );
}

/////////////////
// SNAP TOGRID // Move a point to the nearest grid line
///////////////// 

ScrollBox.prototype.snapXToGrid = function ( posX ) {
	return this.screenXToTile( posX ) * this.tileW - this.hScroll;
}

ScrollBox.prototype.snapYToGrid = function ( posY ) {
	return this.screenYToTile( posY ) * this.tileH - this.vScroll;
}

///////////////
// SETSCROLL //
///////////////

ScrollBox.prototype.setScroll = function( hScroll, vScroll ) {
	this.hScroll = hScroll;
	this.vScroll = vScroll;
	
	this.updateScroll();
}

//////////////////
// UPDATESCROLL // Set the horizontal and vertical scroll values
//////////////////

ScrollBox.prototype.updateScroll = function() {

	var hScroll = this.hScroll + this.hScrollSpeed;
	var vScroll = this.vScroll + this.vScrollSpeed;

	if ( this.hPixels > this.viewportW ) { // If the whole map does not fit in the viewport horizontally, we can scroll
		
		this.hScroll = cap(hScroll, 0, this.hPixels - this.viewportW );
		this.hLoTileIndex = Math.floor( this.hScroll / this.tileW );
		this.hHiTileIndex = Math.ceil( ( this.hScroll + this.viewportW ) / this.tileW );
		this.hOffset = this.hLoTileIndex * this.tileW - this.hScroll;
		
	} else { // If the whole map fits in the viewport horizontally, center the map
	
		this.hScroll = ( this.hPixels - this.viewportW ) / 2;
		this.hLoTileIndex = 0;
		this.hHiTileIndex = this.hTiles;
		this.hOffset = 0;
	}
	
	if ( this.vPixels > this.viewportH ) { // If the whole map does not fit in the viewport vertically, we can scroll
	
		this.vScroll = cap( vScroll, 0, this.vPixels - this.viewportH );
		this.vLoTileIndex = Math.floor( this.vScroll / this.tileH);
		this.vHiTileIndex = Math.ceil( ( this.vScroll + this.viewportH ) / this.tileH );
		this.vOffset = this.vLoTileIndex * this.tileH - this.vScroll;
		
	} else { // If the whole map fits in the viewport vertically, center the map
	
		this.vScroll = ( this.vPixels - this.viewportH ) / 2;
		this.vLoTileIndex = 0;
		this.vHiTileIndex = this.vTiles;
		this.vOffset = 0;
	}
}

///////////////
// SETVALUES // Set parameters to values given in a list
///////////////

ScrollBox.prototype.setValues = function ( values ) {
	if ( values === undefined ) return;

	for ( var key in values ) {
		var newValue = values[ key ];
		if ( newValue === undefined ) {
			console.warn( 'ScrollBox: \'' + key + '\' parameter is undefined.' );
			continue;
		}
		
		if ( key in this ) {
			var currentValue = this[ key ];
			
			this[ key ] = newValue;
		}
	}		
}
var scrollBox = function(hTiles, vTiles, tileW, tileH, viewportW, viewportH) {
	this.hTiles = hTiles;
	this.vTiles = vTiles;
	this.tileW = tileW;
	this.tileH = tileH;
	this.viewportW = viewportW;
	this.viewportH = viewportH;
	
	this.numTiles = this.hTiles * this.vTiles;
	this.hPixels = this.hTiles * this.tileW;
	this.vPixels = this.vTiles * this.tileH;
	
	this.hScroll = 0;
	this.vScroll = 0;
	this.hLoTileIndex = 0;
	this.hHiTileIndex = 0;
	this.vLoTileIndex = 0;
	this.vHiTileIndex = 0;
	
	this.hOffset = 0;
	this.vOffset = 0;
	
	this.updateScroll = function(hScroll, vScroll) {
		if (this.hPixels > this.viewportW) {
			this.hScroll = cap(hScroll, 0, this.hPixels - this.viewportW);
			this.hLoTileIndex = Math.floor(this.hScroll / this.tileW);
			this.hHiTileIndex = Math.ceil((this.hScroll + this.viewportW) / this.tileW);
			this.hOffset = this.hLoTileIndex * this.tileW - this.hScroll;
		} else {
			this.hScroll = ( this.hPixels - this.viewportW ) / 2;
			this.hLoTileIndex = 0;
			this.hHiTileIndex = this.hTiles;
			this.hOffset = 0;
		}
		
		if (this.vPixels > this.viewportH) {
			this.vScroll = cap(vScroll, 0, this.vPixels - this.viewportH);
			this.vLoTileIndex = Math.floor(this.vScroll / this.tileH);
			this.vHiTileIndex = Math.ceil((this.vScroll + this.viewportH) / this.tileH);
			this.vOffset = this.vLoTileIndex * this.tileH - this.vScroll;
		} else {
			this.vScroll = ( this.vPixels - this.viewportH ) / 2;
			this.vLoTileIndex = 0;
			this.vHiTileIndex = this.vTiles;
			this.vOffset = 0;
		}		
	}
	
	this.updateScroll(0, 0);
	
	this.setValues = function ( values ) {
		if ( values === undefined ) return;

		for ( var key in values ) {
			var newValue = values[ key ];
			if ( newValue === undefined ) {
				console.warn( 'ScrollBox: \'' + key + '\' parameter is undefined.' );
				continue;
			}

			if ( key in this ) {
					var currentValue = this[ key ];
					
					if ( currentValue instanceof THREE.Color && newValue instanceof THREE.Color ) {
						currentValue.copy( newValue );
					} else if ( currentValue instanceof THREE.Color && typeof( newValue ) === "number" ) {
						currentValue.setHex( newValue );
					} else if ( currentValue instanceof THREE.Vector3 && newValue instanceof THREE.Vector3 ) {
						currentValue.copy( newValue );
					} else {
						this[ key ] = newValue;
					}
				}
			}
		}		
	}
}	
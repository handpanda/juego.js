var cap = function(val, lo, hi) {
	if (val <= lo) val = lo;
	if (val > hi - 1) val = hi - 1;

	return val;
}

var toggle = function(val) {
	if (val) return false;
	else return true;
}

var discrand = function(min, max) {
	return min + Math.floor(Math.random() * (max - min));
}

/*
	Expanded array class with lots of useful operations

	getSub:
		Return a sub-array. Pads with zeros if an out-of-range subarray is specified
	
		l: which layer
		col, row: row and column of top-left element of subarray
		width, height: dimensions of subarray in columns and rows
		
	map:	
		Perform an operation using each element of the array
		
		
	
*/
var TileArray = function(layers, rowlength, tiles) {
	this.layers = layers;
	this.rowlength = rowlength;
	this.tiles = tiles;
	this.tilesPerLayer = this.tiles.length / this.layers;
	this.collength = this.tilesPerLayer / this.rowlength;
	
	this.copy = function(data) {
		this.layers = data.layers;
		this.rowlength = data.rowlength;
		this.tiles = data.tiles.slice(0);
		this.tilesPerLayer = this.tiles.length / this.layers;
	}
	
	this.validIndices = function( r, c ) {
		return ( c >= 0 && c < this.rowlength && r >= 0 && r < this.collength );
	}
	
	this.getSub = function( l, row, col, width, height ) {
		var sub = [];
		
		for ( r = row; r < row + height; r++ ) {
			for ( c = col; c < col + width; c++ ) {
				if ( !this.validIndices( r, c ) ) sub.push( 0 );
				else {
					sub.push( this.get( l, r, c ) );
				}
			}
		}
		
		return new TileArray( 1, width, sub );
	}
	
	this.map = function( func ) {
		for ( l = 0; l < this.layers; l++ ) {
			for ( r = 0; r < this.collength; r++ ) {
				for ( c = 0; c < this.rowlength; c++ ) {
					func( l, r, c, this.get( l, r, c ) );
				}
			}
		}
	}
	
	this.get = function(l, r, c) {
		if ( this.validIndices( r, c ) ) return this.tiles[l * this.tilesPerLayer + r * this.rowlength + c];
		else return 0;
	}
	
	this.set = function(l, r, c, val) {
		if ( this.validIndices( r, c ) ) this.tiles[l * this.tilesPerLayer + r * this.rowlength + c] = val;
	}
}

var Level = function(name, layers, sheets, rowlength, tiles) {
	this.name = name;
	this.sheets = sheets;
	this.data = new TileArray(layers, rowlength, tiles);
}

var drawRectangleOutline = function( context, x, y, w, h ) {
	context.beginPath();
	context.moveTo( x, y );
	context.lineTo( x + w, y );
	context.lineTo( x + w, y + h );
	context.lineTo( x, y + h );
	context.closePath();
	context.stroke();
}

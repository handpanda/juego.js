//////////////////
// TILEARRAY.JS //
//////////////////

/*
	TileArray
	
	Expanded 2D array class with lots of useful operations

	getSub:
		Return a sub-array. Pads with zeros if an out-of-range subarray is specified
	
		col, row: row and column of top-left element of subarray
		width, height: dimensions of subarray in columns and rows
		
	map:	
		Perform an operation using each element of the array
	
*/

define( [], function() {

var TileArray = function(rowlength, tiles) {
	this.rowlength = rowlength;
	this.tiles = tiles;
	this.collength = this.tiles.length / this.rowlength;
}

TileArray.prototype.copy = function( data ) {
	this.rowlength = data.rowlength;
	this.tiles = data.tiles.slice(0);
}

TileArray.prototype.validIndices = function( r, c ) {
	return ( c >= 0 && c < this.rowlength && r >= 0 && r < this.collength );
}

TileArray.prototype.getSub = function( row, col, width, height ) {
	var sub = [];
	
	for ( r = row; r < row + height; r++ ) {
		for ( c = col; c < col + width; c++ ) {
			if ( !this.validIndices( r, c ) ) sub.push( 0 );
			else {
				sub.push( this.get( r, c ) );
			}
		}
	}
	
	return new TileArray( width, sub );
}

TileArray.prototype.map = function( func ) {
	for ( r = 0; r < this.collength; r++ ) {
		for ( c = 0; c < this.rowlength; c++ ) {
			func( r, c, this.get( r, c ) );
		}
	}
}

TileArray.prototype.get = function(r, c) {
	if ( this.validIndices( r, c ) ) return this.tiles[r * this.rowlength + c];
	else return 0;
}

TileArray.prototype.set = function(r, c, val) {
	if ( this.validIndices( r, c ) ) this.tiles[r * this.rowlength + c] = val;
}

return TileArray;

});
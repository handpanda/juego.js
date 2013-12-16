/*
	TileArray
	
	Expanded array class with lots of useful operations

	getSub:
		Return a sub-array. Pads with zeros if an out-of-range subarray is specified
	
		col, row: row and column of top-left element of subarray
		width, height: dimensions of subarray in columns and rows
		
	map:	
		Perform an operation using each element of the array
	
*/
var TileArray = function(rowlength, tiles) {
	this.rowlength = rowlength;
	this.tiles = tiles;
	this.collength = this.tiles.length / this.rowlength;
	
	this.copy = function( data ) {
		this.rowlength = data.rowlength;
		this.tiles = data.tiles.slice(0);
	}
	
	this.validIndices = function( r, c ) {
		return ( c >= 0 && c < this.rowlength && r >= 0 && r < this.collength );
	}
	
	this.getSub = function( row, col, width, height ) {
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
	
	this.map = function( func ) {
		for ( r = 0; r < this.collength; r++ ) {
			for ( c = 0; c < this.rowlength; c++ ) {
				func( r, c, this.get( r, c ) );
			}
		}
	}
	
	this.get = function(r, c) {
		if ( this.validIndices( r, c ) ) return this.tiles[r * this.rowlength + c];
		else return 0;
	}
	
	this.set = function(r, c, val) {
		if ( this.validIndices( r, c ) ) this.tiles[r * this.rowlength + c] = val;
	}
}
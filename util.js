define( [], function() {

util = {};

util.cap = function(val, lo, hi) {
	if (val < lo) val = lo;
	if (val > hi - 1) val = hi - 1;
	
	return val;
}

util.toggle = function(val) {
	if (val) return false;
	else return true;
}

util.discrand = function(min, max) {
	return min + Math.floor(Math.random() * (max - min));
}

util.TileArray = function(layers, rowlength, tiles) {
	this.layers = layers;
	this.rowlength = rowlength;
	this.tiles = tiles;
	this.tilesPerLayer = this.tiles.length / this.layers;
	
	this.copy = function(data) {
		this.layers = data.layers;
		this.rowlength = data.rowlength;
		this.tiles = data.tiles.slice(0);
		this.tilesPerLayer = this.tiles.length / this.layers;
	}
	
	this.get = function(l, x, y) {
		return this.tiles[l * this.tilesPerLayer + x * this.rowlength + y];
	}
	
	this.set = function(l, x, y, val) {
		this.tiles[l * this.tilesPerLayer + x * this.rowlength + y] = val;
	}
}

util.level = function(name, layers, sheets, rowlength, tiles) {
	this.name = name;
	this.sheets = sheets;
	this.data = new tilearray(layers, rowlength, tiles);
}

return util;

});
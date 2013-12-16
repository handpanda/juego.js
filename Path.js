var Node = function( posX, posY ) {
	this.posX = posX;
	this.posY = posY;
	//this.nextNode = null;
}

var Path = function() {
	this.nodes = [];
}

Path.prototype.addNode = function( node ) {
	//if ( this.nodes.length > 0 ) {
	//	this.nodes[this.nodes.length - 1].nextNode = node;
	///}

	this.nodes.push( node );
}

var PathFollower = function( path, index ) {
	this.path = path;
	this.index = index;
}
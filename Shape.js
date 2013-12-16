var Shape = function() {
	this.lines = []
}

// Make a chain of lines from a list of points
function chainFromPoints( points, loop ) {
	var lines = [];

	for ( var i = 1; i < points.length; i++ ) {
		lines.push( new Line( points[i-1], points[i] ) );
	}

	if ( loop ) {
		lines.push( new Line( points[points.length - 1], points[0] ) );
	}

	return lines;
}

Shape.prototype.fromLines = function( lines ) {
	this.lines = lines;

	return this;
}

Shape.prototype.Loop = function( points ) {
	this.lines = chainFromPoints( points, true );

	return this;
}

Shape.prototype.Chain = function( points ) {
	this.lines = chainFromPoints( points, false );

	return this;
}

// Make a rectangle
Shape.prototype.Rectangle = function( x, y, w, h ) {
	this.lines = chainFromPoints( [ new Vec2( x, y ),
									new Vec2( x + w, y ),
									new Vec2( x + w, y + h ),
									new Vec2( x, y + h ) ],
									true );

	return this;
}

Shape.prototype.copy = function() {
	var s = new Shape();

	for ( l in this.lines ) {
		s.lines.push( new Line( this.lines[l] ) );
	}	

	return s;
}

Shape.prototype.add = function( point ) {
	for ( l in this.lines ) {
		this.lines[l].p1.add( point );
		this.lines[l].p2.add( point );
	}

	return this;
}

Shape.prototype.intersect = function( line ) {
	var points = [];

	for ( l in this.lines ) {
		var inter = this.lines[l].intersect( line );
		if ( inter != null ) points.push( inter );
	}
	
	// Sort in order of closest to farthest
	points.sort( function( a, b ) { return Math.abs( a.x - line.p1.x ) - Math.abs( b.x - line.p1.x ) } );

	return points;
}

Shape.prototype.rayIntersect = function( ray ) {
	var rayHits = [];

	for ( l in this.lines ) {
		var hit = ray.rayIntersect( this.lines[l] );
		if ( hit != null ) rayHits.push( hit );
	}
	
	// Sort in order of closest to farthest
	rayHits.sort( function( a, b ) { return Math.abs( a.point.x - ray.p1.x ) - Math.abs( b.point.x - ray.p1.x ) } );

	return rayHits;	
}

Shape.prototype.draw = function( context ) {
	for ( l in this.lines ) {
		this.lines[l].draw( context );
	}
}

Shape.prototype.materialDraw = function( context ) {
	for ( l in this.lines ) {
		if ( this.lines[l].material ) {
			context.strokeStyle = "blue";
		} else context.strokeStyle = "red";

		this.lines[l].draw( context );
	}
}
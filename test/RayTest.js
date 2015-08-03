////////////////
// RAYTEST.JS //
////////////////

/*
	RayTest

	Test ray intersection on a bunch of random shapes
*/

define( ["juego/Shape", "juego/RayHit", "juego/Line", "juego/Vec2", "juego/mouse"], function( Shape, RayHit, Line, Vec2, mouse ) {

var RayTest = function() {
	this.shapes = [];

	for ( var i = 0; i < 5; i++ ) {
		this.shapes.push( new Shape().Rectangle( Math.random() * 300, Math.random() * 300, Math.random() * 100, Math.random() * 100 ) );
	}

	for ( var i = 0; i < 5; i++ ) {
		var numPoints = 2 + Math.random() * 4
		var points = [];

		for ( var j = 0; j < numPoints; j++ ) {
			points.push( new Vec2( Math.random() * 300, Math.random() * 300 ) );
		}

		this.shapes.push( new Shape().Loop( points ) );
	}

	this.line = new Line();
}

RayTest.prototype.update = function( canvas, context ) {
	this.line.p1 = mouse.start;
	this.line.p2 = mouse.pos;

	var closestRayHits = [];

	for ( s in this.shapes ) {
		var rayHits = this.shapes[s].rayIntersect( this.line );

		// Grab the closest intersection if there was one;
		if ( rayHits.length > 0 ) closestRayHits.push( rayHits[0] );
	}

	var t = this; // Can't use "this" inside the sorting function below

	// Sort the list of per-shape closest points to find the overall closest one
	closestRayHits.sort( function( a, b ) { return Math.abs( a.point.x - t.line.p1.x ) - Math.abs( b.point.x - t.line.p1.x ) } );

	context.clearRect( 0, 0, canvas.width, canvas.height );

	context.strokeStyle = "red";
	context.lineWidth = 2;

	this.line.draw( context );
	for ( s in this.shapes ) {
		this.shapes[s].draw( context );
	}

	if ( closestRayHits.length > 0 ) {
		var point = closestRayHits[0].point;
		var normal = closestRayHits[0].normal;

		context.fillStyle = "green";
		context.fillRect( point.x-5, point.y-5, 10, 10 );
		
		context.strokeStyle = "orange";
		context.beginPath();
		context.moveTo( point.x, point.y );
		context.lineTo( point.x+normal.x * 100, point.y+normal.y * 100 );
		context.stroke();
	}

	mouse.updateState( canvas );
}				

return RayTest;

});
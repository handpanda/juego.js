//////////////////////
// SHAPECASTTEST.JS //
//////////////////////

/*
	ShapeCastTest

	Test of the Level class shapecast() function for raycasting
*/

var ShapeCastTest = function() {
	this.level = new Level();

	// Random rectangles
	for ( var i = 0; i < 5; i++ ) {
		this.level.shapes.push( new Shape().Rectangle( Math.random() * 300, Math.random() * 300, Math.random() * 100, Math.random() * 100 ) );
	}

	// Random polygons
	for ( var i = 0; i < 5; i++ ) {
		var numPoints = 2 + Math.random() * 4
		var points = [];

		for ( var j = 0; j < numPoints; j++ ) {
			points.push( new Vec2( Math.random() * 300, Math.random() * 300 ) );
		}

		this.level.shapes.push( new Shape().Loop( points ) );
	}

	this.line = new Line();
}

ShapeCastTest.prototype.update = function() {
	this.line.p1 = mouse.start;
	this.line.p2 = mouse.pos;

	var ray = this.level.shapecast( this.line );

	context.clearRect( 0, 0, canvas.width, canvas.height );

	context.strokeStyle = "red";
	context.lineWidth = 2;

	this.line.draw( context );
	for ( s in this.level.shapes ) {
		this.level.shapes[s].draw( context );
	}

	if ( ray.dir != null ) {
		var point = ray.point;
		var normal = ray.dir;

		context.fillStyle = "green";
		context.fillRect( point.x-5, point.y-5, 10, 10 );
		
		context.strokeStyle = "orange";
		context.beginPath();
		context.moveTo( point.x, point.y );
		context.lineTo( point.x+normal.x * 100, point.y+normal.y * 100 );
		context.stroke();
	}

	mouseStateUpdater( canvas );
}	
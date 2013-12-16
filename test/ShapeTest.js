var ShapeTest = function() {
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

ShapeTest.prototype.update = function() {
	this.line.p1 = mouse.start;
	this.line.p2 = mouse.pos;

	var closestPoints = [];

	for ( s in this.shapes ) {
		var points = this.shapes[s].intersect( this.line );

		// Grab the closest intersection if there was one;
		if ( points.length > 0 ) closestPoints.push( points[0] );
	}

	var t = this; // Can't use "this" inside the sorting function below

	// Sort the list of per-shape closest points to find the overall closest one
	closestPoints.sort( function( a, b ) { return Math.abs( a.x - t.line.p1.x ) - Math.abs( b.x - t.line.p1.x ) } );

	context.clearRect( 0, 0, canvas.width, canvas.height );

	context.strokeStyle = "red";
	context.lineWidth = 2;

	this.line.draw( context );
	for ( s in this.shapes ) {
		var points = this.shapes[s].intersect( this.line );

		context.fillStyle = "blue";
		for ( p in points ) {	
			context.fillRect( points[p].x - 5, points[p].y - 5, 10, 10 );
			context.fillStyle = "red";
		}

		this.shapes[s].draw( context );
	}

	if ( closestPoints.length > 0 ) {
		context.fillStyle = "green";
		context.fillRect( closestPoints[0].x - 5, closestPoints[0].y - 5, 10, 10 );
	}

	mouseStateUpdater( canvas );
}
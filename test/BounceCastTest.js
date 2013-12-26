define( ["juego/Level", "juego/Shape", "juego/Line", "juego/mouse"], function( Level, Shape, Line, mouse ) {

var BounceCastTest = function() {
	this.level = new Level();

	// Random rectangles
	for ( var i = 0; i < 5; i++ ) {
		this.level.shapes.push( new Shape().Rectangle( Math.random() * 300, Math.random() * 300, Math.random() * 100, Math.random() * 100 ) );
	}

	// Random polygons
	for ( var i = 0; i < 0; i++ ) {
		var numPoints = 2 + Math.random() * 4
		var points = [];

		for ( var j = 0; j < numPoints; j++ ) {
			points.push( new Vec2( Math.random() * 300, Math.random() * 300 ) );
		}

		this.level.shapes.push( new Shape().Loop( points ) );
	}

	this.line = new Line();
}

BounceCastTest.prototype.update = function( canvas, context ) {
	this.line.p1.set(mouse.start);
	this.line.p2.set(mouse.pos);

	var points = this.level.bouncecast( this.line, 10, true );
	var chain = new Shape().Chain( points );

	context.clearRect( 0, 0, canvas.width, canvas.height );

	context.strokeStyle = "red";
	context.lineWidth = 2;

	this.line.draw( context );
	for ( s in this.level.shapes ) {
		this.level.shapes[s].draw( context );
	}

	context.strokeStyle = "blue";
	chain.draw( context );

	mouse.updateState( canvas );
}						

return BounceCastTest;

});
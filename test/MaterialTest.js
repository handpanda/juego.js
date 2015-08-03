define( ["juego/Shape", "juego/Level", "juego/Line", "juego/mouse"], function(Shape, Level, Line, mouse) {

var MaterialTest = function() {
	this.level = new Level();

	// Random rectangles
	for ( var i = 0; i < 5; i++ ) {
		shape = new Shape().Rectangle( Math.random() * 300, Math.random() * 300, Math.random() * 100, Math.random() * 100 );

		for ( l in shape.lines ) {
			shape.lines[l].material = Math.floor( Math.random() + 0.5 );
		}

		this.level.shapes.push( new Shape().fromLines( shape.lines ) );
	}

	this.line = new Line();
}

MaterialTest.prototype.update = function( canvas, context ) {
	this.line.p1.set(mouse.start);
	this.line.p2.set(mouse.pos);

	var points = this.level.bouncecast( this.line, 10 );
	var chain = new Shape().Chain( points );

	context.clearRect( 0, 0, canvas.width, canvas.height );

	context.strokeStyle = "red";
	context.lineWidth = 2;

	this.line.draw( context );
	for ( s in this.level.shapes ) {
		this.level.shapes[s].materialDraw( context );
	}

	context.strokeStyle = "blue";
	chain.draw( context );

	mouse.updateState( canvas );
}	

return MaterialTest;

});
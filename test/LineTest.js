var LineTest = function() {
	this.rect = new Entity( 100, 100, 30, 30 );
	this.line = new Line();

	this.lines = [];
	for ( var i = 0; i < 8; i++ ) {
		var angle = Math.PI * 2 / 8 * i;

		this.lines.push( new Line( 200, 200, 200 + 100 * Math.cos( angle ), 200 + 100 * Math.sin( angle ) ) );	
	}
}

LineTest.prototype.update = function() {
	this.line.p1 = mouse.start;
	this.line.p2 = mouse.pos;

	context.clearRect( 0, 0, canvas.width, canvas.height );

	context.fillStyle = "red";
	if ( this.rect.rectOverlapsLine( this.line ) ) context.fillStyle = "blue";
	this.rect.drawRect( context );

	context.strokeStyle = "red";
	context.lineWidth = 2;

	this.line.draw( context );

	for ( l in this.lines ) {
		this.drawIntersection( this.line, this.lines[l] );	
	}

	mouseStateUpdater( canvas );
}

LineTest.prototype.drawIntersection = function( testline, line ) {
	context.strokeStyle = "red";
    var inter = line.intersect( testline );
	if ( inter != null ) {
		context.strokeStyle = "blue";
		context.fillRect( inter.x - 5, inter.y - 5, 10, 10 );
	}
	line.draw( context );
}
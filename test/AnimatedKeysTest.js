define( [ "juego/animatedKeys", "juego/AnimationRunner" ], function( animatedKeys, AnimationRunner ) {

var AnimatedKeysTest = function() {
	this.runners = [];

	for ( var k in animatedKeys ) {
		var runner = new AnimationRunner( 0, 0, false, false );
		runner.setLoopingAnim( animatedKeys[k] );

		this.runners.push( runner );
	}
}

AnimatedKeysTest.prototype.update = function( canvas, context ) {
	context.clearRect( 0, 0, canvas.width, canvas.height );

	var x = 0, y = 0;

	for ( var r in this.runners ) {
		if ( x + this.runners[r].frameWidth > canvas.width ) {
			x = 0;
			y += this.runners[r].frameHeight;
		}

		this.runners[r].update( x, y );

		x += this.runners[r].frameWidth;

		this.runners[r].draw( context );
	}
}

return AnimatedKeysTest;

});
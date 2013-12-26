define( ["juego/keyboard", "juego/animatedKeys", "juego/AnimationRunner"], function( keyboard, animatedKeys, AnimationRunner ) {

var KeyboardTest = function() {
	this.runners = [];

	for ( var k in animatedKeys ) {
		var runner = new AnimationRunner( 0, 0, false, false );
		runner.setLoopingAnim( animatedKeys[k] );

		this.runners.push( runner );
	}
}

KeyboardTest.prototype.update = function( canvas, context ) {
	context.clearRect( 0, 0, canvas.width, canvas.height );

	var x = 0, y = 0;

	for ( var k in keyboard.KEY ) {
		if ( keyboard.keyHeld( keyboard.KEY[k] ) ) this.runners[r].frame = 0;
	}

	for ( var r in this.runners ) {
		if ( x + this.runners[r].frameWidth > canvas.width ) {
			x = 0;
			y += this.runners[r].frameHeight;
		}

		this.runners[r].update( x, y );

		x += this.runners[r].frameWidth;

		this.runners[r].draw( context );
	}

	keyboard.updateState();
}

return KeyboardTest;

});
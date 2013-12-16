entityManager = new SimpleEntityManager();

screens = [];
currentScreen = null;

canvas = null;
context = null;

$(window).load(function () {
	canvas = document.getElementById( "canvas" );
	context = canvas.getContext( "2d" );

	setInterval( update, 60 );
});

var switchScreen = function( name ) {
	if ( !screens ) {
		console.log( "Screen.js not included");
		return;
	}

	for ( s in screens ) {
		if ( screens[s].name == name ) {
			if ( currentScreen != null ) currentScreen.onExit();

			screens[s].onEnter( entityManager );

			currentScreen = screens[s];

			break;
		}
	}
}

var update = function() {
	if ( currentScreen != null ) currentScreen.onUpdate();

	entityManager.update();

	context.clearRect( 0, 0, canvas.width, canvas.height );

	if ( currentScreen != null ) currentScreen.onDraw( context );

	entityManager.draw( context );

	keyboardStateUpdater();
	mouseStateUpdater( canvas );	
}
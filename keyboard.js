LOG_KEYBOARD = false;

var KEY = {
	SPACE : 32,
	UP : 38,
	DOWN : 40,
	LEFT : 37,
	RIGHT : 39,
	A : 65,
	B : 66,
	C : 67,
	D : 68,
	E : 69,
	F : 70,
	G : 71,
	H : 72,
	I : 73,
	J : 74,
	K : 75,
	L : 76,
	M : 77,
	N : 78,
	O : 79,
	P : 80,
	Q : 81,
	R : 82,
	S : 83,
	T : 84,
	U : 85,
	V : 86,
	W : 87,
	X : 88,
	Y : 89,
	Z : 90,
};

var KEYSTATE = {
	UP : 0,
	HIT : 1,
	HELD : 2,
	LETGO : 3,
	DOUBLETAPPED : 4,
}

var keyboardState = [];
var keyLastHit = [];
var updateCounter = 0;
var doubleTapInterval = 5;

function resetKeys() {
	for ( key in KEY ) {
		keyboardState[KEY[key]] = KEYSTATE.UP;
		keyLastHit[KEY[key]] = -Infinity;
	}
}

function keyDownHandler( e ) {
	if ( LOG_KEYBOARD ) console.log( "Key " + e.keyCode + " down" );
	if ( keyboardState[e.keyCode] == KEYSTATE.UP ) {	
		keyboardState[e.keyCode] = KEYSTATE.HIT;
	}
}

function keyUpHandler( e ) {
	if ( LOG_KEYBOARD ) console.log( "Key " + e.keyCode + " up" );
	keyboardState[e.keyCode] = KEYSTATE.LETGO;
	if (updateCounter - keyLastHit[e.keyCode] < doubleTapInterval)  {
		keyboardState[e.keyCode] = KEYSTATE.DOUBLETAPPED;
	}
	keyLastHit[e.keyCode] = updateCounter;
}

function keyboardStateUpdater() {
	for ( key in KEY ) {
		if ( keyboardState[KEY[key]] == KEYSTATE.HIT ) {
			keyboardState[KEY[key]] = KEYSTATE.HELD;
		}
		if ( keyboardState[KEY[key]] == KEYSTATE.LETGO || keyboardState[KEY[key]] == KEYSTATE.DOUBLETAPPED ) {
			keyboardState[KEY[key]] = KEYSTATE.UP;
		}
	}
	updateCounter++;
}

function keyDoubleTapped(key) {
	return ( keyboardState[key] == KEYSTATE.DOUBLETAPPED );
}

function keyHit( key ) {
	return ( keyboardState[key] == KEYSTATE.HIT );
}

function keyHeld( key ) {
	return ( keyboardState[key] == KEYSTATE.HIT || keyboardState[key] == KEYSTATE.HELD );
}

function keyLetGo( key ) {
	return ( keyboardState[key] == KEYSTATE.LETGO );
}

function anyKeyHit() {
	for ( key in KEY ) {
		if ( keyboardState[KEY[key]] == KEYSTATE.HIT || keyboardState[KEY[key]] == KEYBOARD.HELD ) {
			return true;
		}
	}
	
	return false;
}

resetKeys();
document.onkeyup = keyUpHandler;
document.onkeydown = keyDownHandler;
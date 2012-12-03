JUEGO.LOG_KEYBOARD = false;

var KEY = {
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
	NUM_KEYS : 128,
};

var KEYSTATE = {
	UP : 0,
	HIT : 1,
	HELD : 2,
}

var keyboardState = [];

function resetKeys() {
	for (var i = 0; i < KEY.NUM_KEYS; i++) {
		keyboardState[i] = KEYSTATE.UP;
	}
}

resetKeys();

function keyDownHandler(e) {
	//if (JUEGO.LOG_KEYBOARD) // console.log("Key " + e.keyCode + " down");
	if (keyboardState[e.keyCode] == KEYSTATE.UP) keyboardState[e.keyCode] = KEYSTATE.HIT;
}

function keyUpHandler(e) {
	//if (JUEGO.LOG_KEYBOARD) // console.log("Key " + e.keyCode + " up");
	keyboardState[e.keyCode] = KEYSTATE.UP;
}

function keyboardStateUpdater() {
	for (var i = 0; i < KEY.NUM_KEYS; i++) {
		if (keyboardState[i] == KEYSTATE.HIT) {
			keyboardState[i] = KEYSTATE.HELD;
		}
	}
}

function keyHit(key) {
	return (keyboardState[key] == KEYSTATE.HIT);
}

function keyHeld(key) {
	return (keyboardState[key] == KEYSTATE.HIT || keyboardState[key] == KEYSTATE.HELD);
}

function anyKeyHit() {
	for (var i = 0; i < KEY.NUM_KEYS; i++) {
		if (keyboardState[i] == KEYSTATE.HIT || keyboardState[i] == KEYBOARD.HELD) {
			return true;
		}
	}
	
	return false;
}
/*
JUEGO.keyboardEvents = [];

JUEGO.KeyboardEvent = function( action, func ) {
	this.action = action;
	this.func = func;
}

function registerKeyEvent( action, func ) {
	keyboardEvents.push( new JUEGO.KeyboardEvent( action, func ) );
};*/

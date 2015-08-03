define( [], function() {

var KEYSTATE = {
	UP: 0,
	HIT: 1,
	HELD: 2,
	LETGO: 3,
	DOUBLETAPPED: 4,
};

var updateCounter = 0;
var doubleTapInterval = 5;

var state = [];
var keyLastHit = [];

var keyboard = {

	LOG: false,

	KEY: {
		A: 65,
		B: 66,
		C: 67,
		D: 68,
		E: 69,
		F: 70,
		G: 71,
		H: 72,
		I: 73,
		J: 74,
		K: 75,
		L: 76,
		M: 77,
		N: 78,
		O: 79,
		P: 80,
		Q: 81,
		R: 82,
		S: 83,
		T: 84,
		U: 85,
		V: 86,
		W: 87,
		X: 88,
		Y: 89,
		Z: 90,
		SPACE: 32,
		UP: 38,
		DOWN: 40,
		LEFT: 37,
		RIGHT: 39,		
	},

 	keyLastHit: [],

	resetKeys: function() {
		for ( key in keyboard.KEY ) {
			state[keyboard.KEY[key]] = KEYSTATE.UP;
			keyLastHit[keyboard.KEY[key]] = -Infinity;
		}
	},

	keyDownHandler: function( e ) {
		if ( keyboard.LOG_KEYBOARD ) console.log( "Key " + e.keyCode + " down" );
		if ( state[e.keyCode] == KEYSTATE.UP ) {	
			state[e.keyCode] = KEYSTATE.HIT;
		}
	},

	keyUpHandler: function( e ) {
		if ( keyboard.LOG_KEYBOARD ) console.log( "Key " + e.keyCode + " up" );
		state[e.keyCode] = KEYSTATE.LETGO;
		if ( updateCounter - keyLastHit[e.keyCode] < doubleTapInterval)  {
			state[e.keyCode] = KEYSTATE.DOUBLETAPPED;
		}
		keyLastHit[e.keyCode] = updateCounter;
	},

	updateState: function() {
		for ( key in keyboard.KEY ) {
			if ( state[keyboard.KEY[key]] == KEYSTATE.HIT ) {
				state[keyboard.KEY[key]] = KEYSTATE.HELD;
			}
			if ( state[keyboard.KEY[key]] == KEYSTATE.LETGO || state[keyboard.KEY[key]] == KEYSTATE.DOUBLETAPPED ) {
				state[keyboard.KEY[key]] = KEYSTATE.UP;
			}
		}

		updateCounter++;
	},

	keyDoubleTapped: function( key ) {
		return ( state[key] == KEYSTATE.DOUBLETAPPED );
	},

	keyHit: function( key ) {
		return ( state[key] == KEYSTATE.HIT );
	},

	keyHeld: function( key ) {
		return ( state[key] == KEYSTATE.HIT || state[key] == KEYSTATE.HELD );
	},

	keyLetGo: function( key ) {
		return ( state[key] == KEYSTATE.LETGO );
	},

	anyKeyHit: function() {
		for ( key in keyboard.KEY ) {
			if ( state[KEY[key]] == KEYSTATE.HIT || state[keyboard.KEY[key]] == KEYBOARD.HELD ) {
				return true;
			}
		}
	
		return false;
	},
};

keyboard.resetKeys();
document.onkeyup = keyboard.keyUpHandler;
document.onkeydown = keyboard.keyDownHandler;

return keyboard;

});
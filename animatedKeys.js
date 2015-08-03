define( ["juego/AnimatedImage", "juego/Animation"], function( AnimatedImage, Animation ) {

var ImgKeys = new AnimatedImage( "../juego.js/img/keys.png", 15, 15, 0, 0 );
var ImgSpacebar = new AnimatedImage( "../juego.js/img/spacebar.png", 75, 15, 0, 0 );

var animations = {
	A: new Animation( "A", ImgKeys, [ 0, 1 ], 3 ),
	B: new Animation( "B", ImgKeys, [ 2, 3 ], 3 ),
	C: new Animation( "C", ImgKeys, [ 4, 5 ], 3 ),
	D: new Animation( "D", ImgKeys, [ 6, 7 ], 3 ),
	E: new Animation( "E", ImgKeys, [ 8, 9 ], 3 ),
	F: new Animation( "F", ImgKeys, [ 10, 11 ], 3 ),
	G: new Animation( "G", ImgKeys, [ 12, 13 ], 3 ),
	H: new Animation( "H", ImgKeys, [ 14, 15 ], 3 ),
	I: new Animation( "I", ImgKeys, [ 16, 17 ], 3 ),
	J: new Animation( "J", ImgKeys, [ 18, 19 ], 3 ),
	K: new Animation( "K", ImgKeys, [ 20, 21 ], 3 ),
	L: new Animation( "L", ImgKeys, [ 22, 23 ], 3 ),
	M: new Animation( "N", ImgKeys, [ 24, 25 ], 3 ),
	N: new Animation( "M", ImgKeys, [ 26, 27 ], 3 ),
	O: new Animation( "O", ImgKeys, [ 28, 29 ], 3 ),
	P: new Animation( "P", ImgKeys, [ 30, 31 ], 3 ),
	Q: new Animation( "Q", ImgKeys, [ 32, 33 ], 3 ),
	R: new Animation( "R", ImgKeys, [ 34, 35 ], 3 ),
	S: new Animation( "S", ImgKeys, [ 36, 37 ], 3 ),
	T: new Animation( "T", ImgKeys, [ 38, 39 ], 3 ),
	U: new Animation( "U", ImgKeys, [ 40, 41 ], 3 ),
	V: new Animation( "V", ImgKeys, [ 42, 43 ], 3 ),
	W: new Animation( "W", ImgKeys, [ 44, 45 ], 3 ),
	X: new Animation( "X", ImgKeys, [ 46, 47 ], 3 ),
	Y: new Animation( "Y", ImgKeys, [ 48, 49 ], 3 ),	
	Z: new Animation( "Z", ImgKeys, [ 50, 51 ], 3 ),
	SPACE: new Animation( "Space", ImgSpacebar, [ 0, 1 ], 3 ),
};

return animations;

});
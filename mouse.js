JUEGO.LOG_MOUSE = false;

var BUTTONSTATE = {
	LETGO: 0,
	UP : 1,
	HIT : 2,
	HELD : 3,
}	
	
var mouseModes = {
	PUT: 0,
	GET: 1,
	SET: 2,
	COPY: 3,
}	

var Mouse = function() {
	this.x = 0;
	this.y = 0;

	this.startX = 0;
	this.startY = 0;
	this.offX = 0;
	this.offY = 0;

	this.layer = 3;
	this.separatelayers = false;
	this.mode = mouseModes.PUT;
	this.currentanim = 0;
	this.tileX = 0;
	this.tileY = 0;

	this.selecting = false;
	this.selWidth = 0;
	this.selHeight = 0;

	this.selection = null;
	
	this.box = null;
}

Mouse.prototype.selectFromArray = function( arr, layer ) {
	if ( this.box == null ) return;

	mouse.selection = [];
	
	var y = this.box.screenYToTile( mouse.startY ), x = this.box.screenXToTile( mouse.startX );
	var w = this.selWidth, 
		h = this.selHeight;
	
	if ( h < 0 ) {
		y = y + h;
		h *= -1;
	}	
	if ( w < 0 ) {
		x = x + w;
		w *= -1;
	}

	this.selection = arr.getSub( layer, y, x, w, h );
	
	console.log( "--Selection--" );
	console.log( this.selection.tiles );
	this.selection.map( function( l, c, r, val ) {
		console.log( l + " " + c + " " + r + " " + val );
	});
}

mouse = new Mouse();

var leftButtonState = BUTTONSTATE.UP;
var refX = 0;
var refY = 0;

function mouseMoveHandler(e) {
	mouse.x = e.pageX;
	mouse.y = e.pageY;

	mouse.x -= refX;
	mouse.y -= refY;
	
	mouse.offX = mouse.x - mouse.startX;
	mouse.offY = mouse.y - mouse.startY;
	
	if (JUEGO.LOG_MOUSE) {
		// console.log("Mouse moved to " + mouse.x + "," + mouse.y);
	}
}

function mouseDownHandler(e) {
	//if (JUEGO.LOG_MOUSE) // console.log("Mouse button down");
	if (leftButtonState == BUTTONSTATE.UP || leftButtonState == BUTTONSTATE.LETGO) {
		leftButtonState = BUTTONSTATE.HIT;
		
		mouse.startX = mouse.x;
		mouse.startY = mouse.y;
	}
}

function mouseUpHandler(e) {
	//if (JUEGO.LOG_MOUSE) // console.log("Mouse button up");
	if (leftButtonState == BUTTONSTATE.HIT || leftButtonState == BUTTONSTATE.HELD) {
		leftButtonState = BUTTONSTATE.LETGO;
	}
}

function mouseStateUpdater(canvas) {
	if ( JUEGO.LOG_MOUSE ) console.log( "Mouse state: " + leftButtonState );

	if (leftButtonState == BUTTONSTATE.HIT) leftButtonState = BUTTONSTATE.HELD;
	if (leftButtonState == BUTTONSTATE.LETGO) leftButtonState = BUTTONSTATE.UP;
	refX = canvas.offsetLeft;
	refY = canvas.offsetTop;
}

function mouseHit() {
	return (leftButtonState == BUTTONSTATE.HIT);
}

function mouseHeld() {
	return (leftButtonState == BUTTONSTATE.HIT || leftButtonState == BUTTONSTATE.HELD);
}

function mouseLetGo() {
	return ( leftButtonState == BUTTONSTATE.LETGO );
}

function clearMouse() { 
	leftButtonState = BUTTONSTATE.UP;	
}

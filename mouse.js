var LOG_MOUSE = false;

var BUTTONSTATE = {
	UP : 0,
	HIT : 1,
	HELD : 2,
}	
	
var mouseModes = {
	PUT: 0,
	GET: 1,
	SET: 2,
}	

var mouse = {
	x: 0,
	y: 0,

	startX: 0,
	startY: 0,
	offX: 0,
	offY: 0,	
	
	layer: 3,
	separatelayers: false,
	mode: mouseModes.PUT,
	currentanim: 0,
	tileIndex: 0,
	tileX: 0,
	tileY: 0,
}

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
	
	if (LOG_MOUSE) {
		// console.log("Mouse moved to " + mouse.x + "," + mouse.y);
	}
}

function mouseDownHandler(e) {
	//if (LOG_MOUSE) // console.log("Mouse button down");
	if (leftButtonState == BUTTONSTATE.UP) {
		leftButtonState = BUTTONSTATE.HIT;
		
		mouse.startX = mouse.x;
		mouse.startY = mouse.y;
	}
}

function mouseUpHandler(e) {
	//if (LOG_MOUSE) // console.log("Mouse button up");
	leftButtonState = BUTTONSTATE.UP;
}

function mouseStateUpdater(canvas) {
	if (leftButtonState == BUTTONSTATE.HIT) leftButtonState = BUTTONSTATE.HELD;
	refX = canvas.offsetLeft;
	refY = canvas.offsetTop;
}

function mouseHit() {
	return (leftButtonState == BUTTONSTATE.HIT);
}

function mouseHeld() {
	return (leftButtonState == BUTTONSTATE.HIT || leftButtonState == BUTTONSTATE.HELD);
}
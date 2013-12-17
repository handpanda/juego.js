/*
	Mouse.js
	
	Utilities for mouse tracking
	
	Keeps track of mouse position and the left mouse button. You can get the mouse position in window coordinates
	and whether the left button is not pressed, pressed, or was just pressed (being "just pressed" counts as being pressed)

	HOW TO USE
	
	1. mouse.x and mouse.y are the coordinates of the mouse position
	2. mouseHit() returns whether the left mouse button was just pressed
	3. mouseHeld() returns whether the left mouse button is being held down. MouseHeld() is always true if MouseHit() is true
	4. Call mouseStateUpdater() at the end of each cycle
	
*/

// Whether to output debugging data to the console
var LOG_MOUSE = false;

// Horizontal and vertical position of the mouse pointer
var mouse = {
	pos: new Vec2(),

	start: new Vec2(),
	off: new Vec2(),

	origin: new Vec2(),

	line: new Line( 0, 0, 0, 0 ),
	currentEntity: null,
}

// What the left mouse button can do
var BUTTONSTATE = {
	UP: 0, // Not pressed
	HIT: 1, // Just pressed, a single click
	HELD: 2, // Has been pressed for a while
	LETGO: 3, // Just released
}

// What the left mouse button is doing right now
var leftButtonState = BUTTONSTATE.UP;

// Update the mouse position when we receive a move event
function mouseMoveHandler(e) {
	mouse.pos.x = e.pageX - mouse.origin.x;
	mouse.pos.y = e.pageY - mouse.origin.y;

	mouse.off.x = mouse.pos.x - mouse.start.x;
	mouse.off.y = mouse.pos.y - mouse.start.y;

	mouse.line.x1 = mouse.start.x;
	mouse.line.y1 = mouse.start.y;
	mouse.line.x2 = mouse.pos.x;
	mouse.line.y2 = mouse.pos.y;

	if (LOG_MOUSE) console.log("Mouse moved to " + mouse.x + "," + mouse.y);
}

// Update the left button state when we receive and button press event
function mouseDownHandler(e) {
	if (LOG_MOUSE) console.log("Mouse button down");

	mouse.start.set( mouse.pos );

	leftButtonState = BUTTONSTATE.HIT;
}

// Update the left button state when we receive and button release event
function mouseUpHandler(e) {
	if (LOG_MOUSE) console.log("Mouse button up");

	mouse.start.set( mouse.pos );

	leftButtonState = BUTTONSTATE.LETGO;
}

// Change the left button state from "just pressed" to "pressed" if necessary
function mouseStateUpdater( canvas ) {
	var rect = canvas.getBoundingClientRect();

	mouse.origin.x = rect.left;
	mouse.origin.y = rect.top;

	if (leftButtonState == BUTTONSTATE.HIT) leftButtonState = BUTTONSTATE.HELD;
	if (leftButtonState == BUTTONSTATE.LETGO) leftButtonState = BUTTONSTATE.UP;
}

// Whether the left button was just pressed
function mouseHit() {
	return (leftButtonState == BUTTONSTATE.HIT);
}

// Whether the left button is pressed
function mouseHeld() {
	return (leftButtonState == BUTTONSTATE.HIT || leftButtonState == BUTTONSTATE.HELD);
}

// Whether the left button is pressed
function mouseLetGo() {
	return (leftButtonState == BUTTONSTATE.LETGO);
}

// Whether the left button is pressed
function mouseUp() {
	return (leftButtonState == BUTTONSTATE.UP || leftButtonState == BUTTONSTATE.LETGO);
}

// Register the event handlers
document.onmousemove = mouseMoveHandler;
document.onmousedown = mouseDownHandler;
document.onmouseup = mouseUpHandler;
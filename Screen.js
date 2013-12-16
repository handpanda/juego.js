var Screen = function( name, onEnter, onUpdate, onExit, onDraw ) {
	this.name = name;
	this.onEnter = onEnter;
	this.onUpdate = onUpdate;
	this.onExit = onExit;
	this.onDraw = onDraw;
}
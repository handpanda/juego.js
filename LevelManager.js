var SessionManager = function() {
	this.currentLevel = null;
	this.currentScreen = null;

	this.levelFilename = "";
	this.onLoad = function() {};
}

SessionManager.prototype.switchScreen = function( otherScreen ) {
	if ( otherScreen == null ) return;
	if ( currentScreen != null ) currentScreen.onExit();
	currentScreen = otherScreen;
	currentScreen.onEnter();
}

SessionManager.prototype.loadLevel = function( levelFilename, callback ) {	
	if ( callback === undefined ) callback = this.onLoad;
	
	currentLevel = new Level();
	currentLevel.loadFromTiledJSON( levelFilename, callback );

	this.levelFilename = levelFilename;
}

SessionManager.prototype.reloadLevel = function( callback ) {
	if ( callback === undefined ) callback = this.onLoad;

	this.loadLevel( this.levelFilename, callback );
}

SessionManager.prototype.loadCurrentLevel = function() {

}
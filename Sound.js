var Sound = function( filename ) {
	this.audio = new Audio( filename );
}

Sound.prototype.play = function() {
	this.audio.currentTime = 0;
	this.audio.play();
	this.audio.loop = false;
}

Sound.prototype.pause = function() {
	this.audio.pause();
}

Sound.prototype.loop = function() {
	this.audio.play();
	this.audio.loop = true;
}
define( [], function() {

var Animation = function( name, image, whichFrames, timePerFrame ) {
	this.name = name; // Name of the animation
	this.image = image; // Pointer to the image
	this.frameIndices = whichFrames; // Array of frames to cycle through
	this.numFrames = this.frameIndices.length; // How many frames
	this.timePerFrame = timePerFrame; // How many cycles to spend on each frame
}

// Return a frame based on an external counter
Animation.prototype.getFrameIndex = function( frameCounter ) {
	return this.frameIndices[Math.floor( frameCounter / this.timePerFrame ) % this.numFrames];
}
	
// Return whether or not each frame has been displayed
Animation.prototype.hasCompleted = function( frameCounter ) {
	return ( Math.floor( frameCounter / this.timePerFrame ) >= this.numFrames );
}

return Animation;

});
//////////////////////
// ANIMATEDIMAGE.JS //
//////////////////////

define( ["juego/TileArray"], function( TileArray ) {

var AnimatedImage = function( filename, frameWidth, frameHeight, hGap, vGap ) {
	this.filename = filename;

	this.image = new Image(); // Image is a built-in Javascript class

	this.image.src = filename; // The image only loads if src is set

	this.frameWidth = frameWidth; // The width of each frame
	this.frameHeight = frameHeight; // The height of each frame
	
	this.hGap = hGap; // Horizontal gap between frames
	this.vGap = vGap; // Vertical gap between frames
	
	console.log( "[AnimatedImage] Loading animated image " + this.filename );
}

// Calculate a bunch of constant-value terms that can only be derived once the image is loaded and its width and height are known
AnimatedImage.prototype.deriveConstants = function() {
	this.hFrames = Math.floor( this.image.width / ( this.frameWidth + this.hGap ) ); // Number of frames in the horizontal direction
	this.vFrames = Math.floor( this.image.height / ( this.frameHeight + this.vGap ) ); // Number of frames in the vertical direction
	this.numFrames = this.hFrames * this.vFrames; // Total number of frames
	
	var frames = [];
	
	for ( r = 0; r < this.vFrames; r++ ) {
		for ( c = 0; c < this.hFrames; c++ ) {
			frames.push( r * this.hFrames + c );
		}
	}

	// List of frames - this is just an array where every element is its index, i.e. [0, 1, 2, 3, 4, ... ]
	this.frameArray = new TileArray	( 1, this.hFrames, frames );
	
	// console.log( "Loaded image " + this.image.src + ", " + this.hFrames + " x " + this.vFrames + " tiles" ); 
}

AnimatedImage.prototype.draw = function( context, posX, posY, frame, scale, hFlip, vFlip ) {
	if ( this.image.complete ) this.deriveConstants(); // Assumes all loading takes place before drawing is attempted

	if ( frame >= this.numFrames ) return;
	
	// Which column and row of the sprite sheet
	var hFrame = frame % this.hFrames;
	var vFrame = Math.floor( ( frame % this.numFrames ) / this.hFrames );
	
	context.save();
	
	// Flip the image, if necessary, by flipping it across the axis and translating it back into place
	if ( hFlip ) {
		context.scale( -1, 1 );
		context.translate( -this.frameWidth * scale, 0 );	
	}
	if ( vFlip ) {
		context.scale( 1, -1 );			
		context.translate( 0, -this.frameHeight * scale );
	}
	
	// Draw the frame by drawing a rectangular sub-image of the sprite sheet
	context.drawImage( 	this.image, 
					    hFrame * ( this.frameWidth + this.hGap ), vFrame * ( this.frameHeight + this.vGap ), // Top left corner of the frame in the larger image
						this.frameWidth, this.frameHeight, // Width and height of the frame
						posX * ( hFlip ? -1 : 1 ), posY * ( vFlip ? -1 : 1 ), // Screen position to draw the frame
						this.frameWidth * scale, this.frameHeight * scale ); // Screen size of frame
						
	context.restore();
}

return AnimatedImage;

});
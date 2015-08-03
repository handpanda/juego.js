//////////////
// IMAGE.JS //
//////////////

/*
	A set of Javascript image utility classes

		RegularImage - A simple, static image
		AnimatedImage - An image divided into multiple frames
		Animation - A list of frames ( an animation )
		AnimationRunner - An animation controller class
		
		Animation contains an AnimatedImage
		AnimationRunner contains one or two Animations
				
		HOW TO USE:
		
		1. Load each image you want to use as an AnimatedImage
		2. Make a FrameSeqence for each animation you want
		3. Give an AnimationRunner member to each class that will use an animation. Call update() for each instance each cycle.
		
		To draw the sprite, call the draw() method of the AnimationRunner
			
		EXAMPLE:
			
			var IMGbird = new AnimatedImage('bird.png', 16, 16, 2, 2); <--------------------------------- AnimatedImage
			
			var ANIMs = {
				birdSTAND : new Animation('Bird Stand', IMGbird, [0], 1), <-------------------------- Animation
				birdFLY : new Animation('Bird Fly', IMGbird, [4, 5, 4, 6, 7], 1),
				birdDEADFALL : new Animation('Bird Deadfall', IMGbird, [8, 9], 1),
				birdDEAD : new Animation('Bird Dead', IMGbird, [10], 1),
			};		
			
			var Bird = function( posX, posY ) {
				this.posX = posX;
				this.posY = posY;
				
				this.mainRunner = new AnimationRunner( this.posX, this.posY, false, false ); <------ AnimationRunner
				this.mainRunner.setLoopingAnim( ANIMS.birdFLY ); // This animation will repeat indefinitely
				this.mainRunner.setLimitedAnim( ANIMS.birdSTAND, 4 ); // This animation will repeat 4 times and cease, overriding the looping animation
 				
				this.update = function() {
					this.mainRunner.update( this.posX, this.posY ); // We only want to update the position of the sprite 
				}
				
				this.draw = function() {
					this.mainRunner.draw();
				}
			}
*/

//////////////////
// REGULARIMAGE //
//////////////////

var RegularImage = function( filename ) {
	this.image = new Image(); // Image is a built-in Javascript class
	this.image.src = filename; // The image only loads if src is set
}

RegularImage.prototype.draw = function( context, posX, posY, scale ) {
	context.drawImage( this.image, posX, posY, this.image.width * scale, this.image.height * scale );
}

///////////
// COLOR //
///////////

var Color = function( r, g, b, a ) {
	this.r = r;
	this.g = g;
	this.b = b;
	this.a = a;
}

Color.prototype.equals = function( otherColor ) {
	return ( this.r == otherColor.r &&
					 this.g == otherColor.g &&
					 this.b == otherColor.b &&
					 this.a == otherColor.a );
}

/////////////
// PALETTE //
/////////////

var Palette = function( inColors, outColors ) {
	this.inColors = inColors;
	this.outColors = outColors;
}

///////////////////
// ANIMATEDIMAGE //
///////////////////

var AnimatedImage = function( filename, frameWidth, frameHeight, hGap, vGap, palette ) {
	this.filename = filename;

	this.image = new Image(); // Image is a built-in Javascript class
	this.image.src = filename; // The image only loads if src is set

	var ai = this;

	this.image.onload = function(ev) {
		ai.can = document.createElement("canvas");
		ai.context = ai.can.getContext("2d");
		console.log( "loaded " + ai.frameWidth );

		img = ev.target;

		ai.can.width = img.width;
		ai.can.height = img.height;

		ai.context.drawImage( img, 0, 0 );

		var imgdata = ai.context.getImageData(0,0,ai.can.width,ai.can.height);
		var rgba = imgdata.data;

		// 4) Read or manipulate the rgba as you wish
		for (var px=0,ct=ai.can.width*ai.can.height*4;px<ct;px+=4){
			for ( c in palette.inColors ) {
				var inColor = palette.inColors[c];

				if ( inColor.r == rgba[px  ] &&
						 inColor.g == rgba[px+1] &&
						 inColor.b == rgba[px+2] &&
						 inColor.a == rgba[px+3] ) {
					var outColor = palette.outColors[c];

					rgba[px  ] = outColor.r;
					rgba[px+1] = outColor.g;
					rgba[px+2] = outColor.b;
					rgba[px+3] = outColor.a;

					continue;
				}
			}
		}

		// 5) Update the context with newly-modified data
		ai.context.putImageData(imgdata,0,0);
	};

	this.ready = false;

	this.frameWidth = frameWidth; // The width of each frame
	this.frameHeight = frameHeight; // The height of each frame
	
	this.hGap = hGap; // Horizontal gap between frames
	this.vGap = vGap; // Vertical gap between frames
	
	console.log( "Loading animated image " + this.filename );
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

	this.ready = true;		
	
	// console.log( "Loaded image " + this.image.src + ", " + this.hFrames + " x " + this.vFrames + " tiles" ); 
}

AnimatedImage.prototype.draw = function( context, posX, posY, frame, scale, hFlip, vFlip ) {
	if ( !this.ready ) this.deriveConstants(); // Assumes all loading takes place before drawing is attempted

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
	context.drawImage( 	this.can, 
					    hFrame * ( this.frameWidth + this.hGap ), vFrame * ( this.frameHeight + this.vGap ), // Top left corner of the frame in the larger image
						this.frameWidth, this.frameHeight, // Width and height of the frame
						posX * ( hFlip ? -1 : 1 ), posY * ( vFlip ? -1 : 1 ), // Screen position to draw the frame
						this.frameWidth * scale, this.frameHeight * scale ); // Screen size of frame
						
	context.restore();
}

///////////////
// ANIMATION //
/////////////// 

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

/////////////////////
// ANIMATIONRUNNER //
///////////////////// 

var AnimationRunner = function( hPos, vPos, scale, hFlip, vFlip ) {
	this.hPos = hPos; // Horizontal pixel position 
	this.vPos = vPos; // Vertical pixel position
	this.scale = this.defaultScale; // How much to scale image dimensions
	this.hFlip = hFlip; // Whether to mirror the image left-to-right
	this.vFlip = vFlip; // Whether to mirror the image top-to-bottom 
	this.isVisible = true; // Whether to draw the image
	this.angle = 0.0; // Rotation angle, in radians
	
	this.frame = 0; // Current frame
	this.loopingAnim = null; // Animation to repeat over and over
	this.limitedAnim = null; // Animation to repeat a set number of times
	this.repetitions = 0; // Number of times to repeat limitedAnim

	this.newAnim = false; // Whether a new animation has been set

	this.image = null; // The image to draw	
}

AnimationRunner.prototype.defaultScale = 1.0;

AnimationRunner.prototype.setVisible = function( val ) {
	this.isVisible = val;
}
	
AnimationRunner.prototype.setLoopingAnim = function( anim ) {
	this.loopingAnim = anim;
	//this.frame = 0;
	//this.newAnim = true;
}
	
AnimationRunner.prototype.setLimitedAnim = function( anim, repetitions ) {
	this.limitedAnim = anim;
	this.repetitions = repetitions;
	this.frame = 0;
	this.newAnim = true;
}
	
AnimationRunner.prototype.hasCompleted = function() {
	return ( this.repetitions <= 0 );
}
	
/* Update the image and frame counter:
	Where to draw it
	Whether it is scaled or flipped

	These values don't need to be updated each time, they will stay the same if the argument is not given
*/
AnimationRunner.prototype.update = function( hPos, vPos, hFlip, vFlip ) {
	if ( hPos !== undefined ) this.hPos = hPos;
	if ( vPos !== undefined ) this.vPos = vPos;		
	if ( hFlip !== undefined ) this.hFlip = hFlip;
	if ( vFlip !== undefined ) this.vFlip = vFlip;
	
	// If we're on a new animation, we haven't seen the first frame yet, so don't update the frame counter
	if ( !this.newAnim ) this.frame++;
	this.newAnim = false;
	
	// Limited-repetition animation
	if ( this.repetitions > 0 ) {
		if ( this.limitedAnim == null ) {
			// console.log( 'Limited-repetition animation is null but repetitions > 0, defaulting to looping anim' );
			this.frame = 0;
			this.repetitions = 0;
		} else {
			if ( this.limitedAnim.hasCompleted( this.frame ) ) {
				this.frame = 0;
				this.repetitions--;
			}
		}
		
	// Looping animation
	} else {
		if ( this.loopingAnim == null ) {
			// console.log( 'Looping animation is null' );
		} else {
		
		}
	}
}
	
// Set sprite rotation, in radians
AnimationRunner.prototype.setRotation = function( angle ) {
	this.angle = angle;
}

AnimationRunner.prototype.setScale = function( scale ) {
	this.scale = scale;
}

// Draw the sprite
AnimationRunner.prototype.draw = function( context ) {
	context.save();
		context.translate( this.hPos, this.vPos );
		context.rotate( this.angle );

		if ( this.isVisible ) {
			if ( this.repetitions > 0 ) {
				// Draw the limited-repetition animation
				
				if ( this.limitedAnim == null ) {
					// console.log( 'Limited animation is null but repetitions > 0, cannot draw' );
				} else {
					if ( this.image != null ) {
						this.image.draw( context, 0, 0, this.limitedAnim.getFrameIndex( this.frame ), this.scale, this.hFlip, this.vFlip );
					} else if ( this.limitedAnim.image == null ) {
					// // console.log( 'Image is null for image ' + this.limitedAnim.name );
					} else this.limitedAnim.image.draw( context, 0, 0, this.limitedAnim.getFrameIndex( this.frame ), this.scale, this.hFlip, this.vFlip );
				}
				
			} else {
				// Draw the looping animation
				if ( this.loopingAnim == null ) {
				
				} else {
					if ( this.image != null ) {
						this.image.draw( context, 0, 0, this.loopingAnim.getFrameIndex( this.frame ), this.scale, this.hFlip, this.vFlip );
					} else if ( this.loopingAnim.image == null ) {
						// console.log( 'Image is null for image ' + this.loopingAnim.name );
					} else this.loopingAnim.image.draw( context, 0, 0, this.loopingAnim.getFrameIndex( this.frame ), this.scale, this.hFlip, this.vFlip );
				}
			}
		}
	context.restore();
}
////////////////////////
// ANIMATIONRUNNER.JS //
////////////////////////

/*
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

define( ["juego/AnimatedImage"], function( AnimatedImage ) {

var AnimationRunner = function( hPos, vPos, hFlip, vFlip ) {
	this.hPos = hPos; // Horizontal pixel position 
	this.vPos = vPos; // Vertical pixel position
	this.scale = 1.0; // How much to scale image dimensions
	this.hFlip = hFlip; // Whether to mirror the image left-to-right
	this.vFlip = vFlip; // Whether to mirror the image top-to-bottom 
	this.isVisible = true; // Whether to draw the image
	this.angle = 0.0; // Rotation angle, in radians
	
	this.frame = 0; // Current frame
	this.loopingAnim = null; // Animation to repeat over and over
	this.limitedAnim = null; // Animation to repeat a set number of times
	this.repetitions = 0; // Number of times to repeat limitedAnim
	
	this.newAnim = false; // Whether a new animation has been set

	this.frameWidth = 0; // Width of the animation frame
	this.frameHeight = 0; // Height of the animation frame
}

AnimationRunner.prototype.defaultScale = 1.0;

AnimationRunner.prototype.setVisible = function( val ) {
	this.isVisible = val;
}
	
AnimationRunner.prototype.setLoopingAnim = function( anim ) {
	this.loopingAnim = anim;
	this.frame = 0;
	this.newAnim = true;
	this.frameWidth = anim.image.frameWidth;
	this.frameHeight = anim.image.frameHeight;
}
	
AnimationRunner.prototype.setLimitedAnim = function( anim, repetitions ) {
	this.limitedAnim = anim;
	this.repetitions = repetitions;
	this.frame = 0;
	this.newAnim = true;
	this.frameWidth = anim.image.frameWidth;
	this.frameHeight = anim.image.frameHeight;	
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

AnimationRunner.prototype.getFrame = function( ) {
	if ( this.repetitions > 0 ) {
		// Draw the limited-repetition animation
		
		if ( this.limitedAnim == null ) {
			// console.log( 'Limited animation is null but repetitions > 0, cannot draw' );
		} else {
			if ( this.limitedAnim.image == null ) {
			// // console.log( 'Image is null for image ' + this.limitedAnim.name );
			} else return this.limitedAnim.getFrameIndex( this.frame );
		}
		
	} else {
		// Draw the looping animation
		if ( this.loopingAnim == null ) {
		
		} else {
			if ( this.loopingAnim.image == null ) {
				// console.log( 'Image is null for image ' + this.loopingAnim.name );
			} else return this.loopingAnim.getFrameIndex( this.frame );
		}
	}
}
	
AnimationRunner.prototype.advanceFrames = function( frames ) {
	for ( var i = 0; i < frames; i++ ) {
		this.update();
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
		context.translate( this.hPos + this.frameWidth / 2, this.vPos + this.frameWidth / 2);
		context.rotate( this.angle );
		context.translate( -this.frameWidth / 2, -this.frameHeight / 2 );

		if ( this.isVisible ) {
			if ( this.repetitions > 0 ) {
				// Draw the limited-repetition animation
				
				if ( this.limitedAnim == null ) {
					// console.log( 'Limited animation is null but repetitions > 0, cannot draw' );
				} else {
					if ( this.limitedAnim.image == null ) {
					// // console.log( 'Image is null for image ' + this.limitedAnim.name );
					} else this.limitedAnim.image.draw( context, 0, 0, this.limitedAnim.getFrameIndex( this.frame ), this.scale, this.hFlip, this.vFlip );
				}
				
			} else {
				// Draw the looping animation
				if ( this.loopingAnim == null ) {
				
				} else {
					if ( this.loopingAnim.image == null ) {
						// console.log( 'Image is null for image ' + this.loopingAnim.name );
					} else this.loopingAnim.image.draw( context, 0, 0, this.loopingAnim.getFrameIndex( this.frame ), this.scale, this.hFlip, this.vFlip );
				}
			}
		}
	context.restore();
}

return AnimationRunner;

});
var imageManager = function( filename ) {
	this.images = [];

	/* Grab an image from it's JSON representation:
		filename
		frame width
		frame height
		horizontal gap between frames
		vertical gap between frames
		internal frame sequences
	*/
	this.addFromJSON = function ( JSONElement ) {

		// Check if the image has been loaded already
		for ( i in images ) {
			var internalImage = images[ i ];
			
			if ( JSONElement.filename == internalImage.filename ) return internalImage;
		}
	
		// Load it if it hasn't been loaded already
		var newImage = new animatedImage( JSONElement.filename, 
							   JSONElement.frameWidth,
							   JSONElement.frameHeight,
							   JSONElement.hGap,
							   JSONElement.vGap,
							   JSONElement.seqs );
							   
		images.push( newImage );					   
							   
		return newImage;
		
	}
}

var regularImage = function(filename) {
	this.image = new Image();
	this.image.src = filename;

	this.draw = function(context, posX, posY, scale) {
		context.drawImage(this.image, posX, posY, this.image.width * scale, this.image.height * scale);
	};
}

var animatedImage = function(filename, frameWidth, frameHeight, hGap, vGap, seqs) {
	this.filename = filename;

	this.image = new Image();
	this.image.src = filename;
	this.loaded = false;

	this.frameWidth = frameWidth;
	this.frameHeight = frameHeight;
	
	this.hGap = hGap;
	this.vGap = vGap;

	// Assumes a frame is only part of one sequence
	this.seqs = seqs;
	this.seqIndices = [];	
	
	this.loadImage = function() {
		this.image = new Image();
		this.image.src = filename;
		this.loaded = false;
	}
	
	console.log(this.filename);
	this.load = function() {
		this.loaded = true;
	
		this.hFrames = Math.floor(this.image.width / (this.frameWidth + hGap)); // Horizontal Frames
		this.vFrames = Math.floor(this.image.height / (this.frameHeight + vGap)); // Vertical Frames	
		this.numFrames = this.hFrames * this.vFrames;
		
		for (var f = 0; f < this.numFrames; f++) {
			this.seqIndices[f] = -1;
		}
		
		for (s in seqs) {
			var seq = seqs[s];
			// console.log("Sequence " + s + ": " + seq[2]);
			for (f in seq[2]) {
				this.seqIndices[seq[2][f]] = s;
				// console.log(seq[2][f]);
			}
		}			
		
		// console.log("Loaded image " + this.image.src + ", " + this.hFrames + " x " + this.vFrames + " tiles"); 
		// console.log("Frame sequences: ");
		for (s in seqs) {
			var seq = seqs[s];
			// console.log("	" + s + ": " + seq[2]);
		}	
	};

	this.draw = function(context, posX, posY, frame, scale, hFlip, vFlip) {
		if (!this.loaded) this.load(); // Assumes all loading takes place before drawing is attempted

		if (frame > this.numFrames) return;

		if (this.seqIndices[frame] != -1) {
			var seq = this.seqs[this.seqIndices[frame]];
			if (seq[3]) frame = seq[2][Math.floor(counter / seq[1]) % seq[0]];
		} 
		
		var hFrame = frame % this.hFrames;
		var vFrame = Math.floor((frame % this.numFrames) / this.hFrames);
		context.save();
		
		if (hFlip) {
			context.scale(-1, 1);
			context.translate(-this.frameWidth * scale, 0);	
		}
		if (vFlip) {
			context.scale(1, -1);			
			context.translate(0, -this.frameHeight * scale);
		}
		
		context.drawImage(this.image, hFrame * (this.frameWidth + hGap), vFrame * (this.frameHeight + vGap), this.frameWidth, this.frameHeight, 
									  posX * (hFlip ? -1 : 1), posY * (vFlip ? -1 : 1), this.frameWidth * scale, this.frameHeight * scale);
		context.restore();
	};
	
	this.toJSON = function() {
		return { filename: this.filename, 
				 frameWidth: this.frameWidth, 
				 frameHeight: this.frameHeight,
				 hGap: this.hGap,
				 vGap: this.vGap,
				 seqs: this.seqs };	
	}
		
		
}

// Array version: [number of frames, time per frame, [frame indices]]

var frameSequence = function(name, image, whichFrames, timePerFrame) {
this.name = name;
	this.image = image;
	this.frameIndices = whichFrames;
	this.numFrames = this.frameIndices.length;
	this.timePerFrame = timePerFrame;
	
	this.getFrameIndex = function(frameCounter) {
		return this.frameIndices[Math.floor(frameCounter / this.timePerFrame) % this.numFrames];
	};
	
	this.hasCompleted = function(frameCounter) {
		return (Math.floor(frameCounter / this.timePerFrame) >= this.numFrames);
	};
}

var animationRunner = function(hPos, vPos, scale, hFlip, vFlip, layer) {
	this.hPos = hPos;
	this.vPos = vPos;
	this.scale = scale;
	this.hFlip = hFlip;
	this.vFlip = vFlip;
	this.layer = layer;
	this.isVisible = true;
	
	this.frame = 0;
	this.loopingAnim = null;
	this.limitedAnim = null;
	this.repetitions = 0;
	
	this.newAnim = false;
	
	this.setVisible = function(val) {
		this.isVisible = val;
	}
	
	this.setLoopingAnim = function(anim) {
		this.loopingAnim = anim;
		this.frame = 0;
		this.newAnim = true;
	}
	
	this.setLimitedAnim = function(anim, repetitions) {
		this.limitedAnim = anim;
		this.repetitions = repetitions;
		this.frame = 0;
		this.newAnim = true;
	}
	
	this.hasCompleted = function() {
		return (this.repetitions <= 0);
	}
	
	// Update the frame counter
	this.update = function(hPos, vPos, scale, hFlip, vFlip) {
		this.hPos = hPos;
		this.vPos = vPos;
		this.scale = 0;
		this.hFlip = hFlip;
		this.vFlip = vFlip;
		
		if (!this.newAnim) this.frame++;
		this.newAnim = false;
		
		if (this.repetitions > 0) {
			if (this.limitedAnim == null) {
				// // console.log('Limited animation is null but repetitions > 0, defaulting to looping anim');
				this.frame = 0;
				this.repetitions = 0;
			} else {
				if (this.limitedAnim.hasCompleted(this.frame)) {
					this.frame = 0;
					this.repetitions--;
				}
			}
		} else {
			if (this.loopingAnim == null) {
				// // console.log('Looping animation is null');
			} else {
			
			}
		}
	}
	
	// Draw the sprite
	this.draw = function(context) {
		if (this.isVisible) {
			if (this.repetitions > 0) {
				// Draw the limited-repetition animation
				
				if (this.limitedAnim == null) {
					// // console.log('Limited animation is null but repetitions > 0, cannot draw');
				} else {
					if (this.limitedAnim.image == null) {
					// // console.log('Image is null for image ' + this.limitedAnim.name);
					} else this.limitedAnim.image.draw(context, this.hPos, this.vPos, this.limitedAnim.getFrameIndex(this.frame), 1.0, this.hFlip, this.vFlip);
				}
				
			} else {
				// Draw the looping animation
				if (this.loopingAnim == null) {
				
				} else {
					if (this.loopingAnim.image == null) {
						// // console.log('Image is null for image ' + this.loopingAnim.name);
					} else this.loopingAnim.image.draw(context, this.hPos, this.vPos, this.loopingAnim.getFrameIndex(this.frame), 1.0, this.hFlip, this.vFlip);
				}
			}
		}
	}
}
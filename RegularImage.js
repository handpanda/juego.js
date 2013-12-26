//////////////////////
// REGIULARIMAGE.JS //
//////////////////////

define( [], function() {

var RegularImage = function( filename ) {
	this.image = new Image(); // Image is a built-in Javascript class

	this.image.src = filename; // The image only loads if src is set
}

RegularImage.prototype.draw = function( context, posX, posY, scale ) {
	context.drawImage( this.image, posX, posY, this.image.width * scale, this.image.height * scale );
}

return RegularImage;

});
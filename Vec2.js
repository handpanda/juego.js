Vec2 = function(x, y) {
	this.x = x;
	this.y = y;
}

Vec2.prototype.zero = function() {
	this.x = 0;
	this.y = 0;
}

<<<<<<< HEAD
Vec2.prototype.copy = function() {
	return new Vec2( this.x, this.y );
}

=======
>>>>>>> e81eb59e574eed68dcb0933126393aebbe187df7
Vec2.prototype.dot = function(v) {
	return this.x * v.x + this.y * v.y;
}

Vec2.prototype.cross = function(v) {
	return this.x * v.y - v.x * this.y;
}

Vec2.prototype.set = function(v) {
	this.x = v.x;
	this.y = v.y;

	return this;
}

Vec2.prototype.setValues = function(x, y) {
	this.x = x;
	this.y = y;

	return this;
}

Vec2.prototype.addX = function( x ) {
	this.x += x;
}

Vec2.prototype.addY = function( y ) {
	this.y += y;
}

Vec2.prototype.copy = function() {
	return new Vec2(this.x, this.y);
}

Vec2.prototype.add = function(v) {
	this.x += v.x;
	this.y += v.y;

	return this;
}

Vec2.prototype.plus = function(v) {
	return new Vec2(this.x + v.x, this.y + v.y);
}

Vec2.prototype.sub = function(v) {
	this.x -= v.x;
	this.y -= v.y;

	return this;
}

Vec2.prototype.minus = function(v) {
	return new Vec2(this.x - v.x, this.y - v.y);
}

Vec2.prototype.scale = function(s) {
	this.x *= s;
	this.y *= s;

	return this;
}

Vec2.prototype.times = function(s) {
	return new Vec2(this.x * s, this.y * s);
}

Vec2.prototype.flip = function() {
	return this.scale(-1);
}

Vec2.prototype.length = function() {
	return Math.sqrt(this.x * this.x + this.y * this.y);
}

Vec2.prototype.normalize = function() {
	if (this.length() == 0.0) return this;

	return this.scale(1.0 / this.length());
}

Vec2.prototype.rotate = function(a) {
	var x = this.x;
	var y = this.y;

	this.x = x * Math.cos(a) - y * Math.sin(a);
	this.y = x * Math.sin(a) + y * Math.cos(a);

	return this;
}

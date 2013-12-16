var Line = function( x1, y1, x2, y2 ) {
	this.p1 = new Vec2();
	this.p2 = new Vec2();

<<<<<<< HEAD
	this.material = 0;

	if ( x1 instanceof Line ) {
		this.p1.set( x1.p1 );
		this.p2.set( x1.p2 );

		this.material = x1.material;
=======
	if ( x1 instanceof Line ) {
		this.p1.set( x1.p1 );
		this.p2.set( x1.p2 );
>>>>>>> 313e58bbecc851b8809902c0e03c0a0568ef667f
	} else if ( x1 instanceof Vec2 ) {
		this.p1.set( x1 );
		this.p2.set( y1 );
	} else {
		this.p1 = new Vec2( x1, y1 );
		this.p2 = new Vec2( x2, y2 );
	}
}

var between = function( v, u1, u2 ) {
	var fudge = 1.0;

	return ( ( v >= u1 - fudge && v <= u2 + fudge ) || ( v >= u2 - fudge && v <= u1 + fudge ) );
}

Line.prototype.getDirection = function() {
	return this.p2.minus( this.p1 );
}

Line.prototype.intersect = function( line ) {
	var result = null;	

	var fudge = 1.0;

	if ( this.p2.x == this.p1.x && line.p2.x == line.p1.x ) {
		
 	} else if ( Math.abs( this.p2.x - this.p1.x ) < 0.01 ) {
		var slope2 = ( line.p2.y - line.p1.y ) / ( line.p2.x - line.p1.x );
		var yInt2 = line.p1.y - ( line.p1.x - this.p1.x ) * slope2;

		if ( between( yInt2, this.p1.y, this.p2.y ) && between( this.p1.x, line.p1.x, line.p2.x ) &&
			 between( yInt2, line.p1.y, line.p2.y )) {
			result = new Vec2( this.p1.x, yInt2 );
		}
	} else if ( Math.abs( line.p2.x - line.p1.x ) < 0.01 ) {
		return line.intersect( this );
	} else {
		var slope1 = ( this.p2.y - this.p1.y ) / ( this.p2.x - this.p1.x );
		var slope2 = ( line.p2.y - line.p1.y ) / ( line.p2.x - line.p1.x );

		if ( slope1 != slope2 ) {
			var yInt2 = line.p1.y - this.p1.y - (line.p1.x - this.p1.x) * slope2;

			var intX = yInt2 / ( slope1 - slope2 ) + this.p1.x;
			var intY = (intX - this.p1.x) * slope2 + yInt2 + this.p1.y

			if ( between( intX, this.p1.x, this.p2.x ) && between( intX, line.p1.x, line.p2.x ) &&
				 between( intY, this.p1.y, this.p2.y ) && between( intY, line.p1.y, line.p2.y ) ) {
				result = new Vec2( intX, intY );
			}
		}
	}

	return result;
}

Line.prototype.rayIntersect = function( line ) {
	var point = this.intersect( line );

	if ( point == null ) return null;

	// Rotate the line 90 degrees to get a normal vector
	var normal = new Vec2( line.p1.y - line.p2.y, line.p2.x - line.p1.x ).normalize();

	// Flip the normal if it's pointing in the same general direction as our ray
	if ( this.p1.minus( point ).dot( normal ) < 0 ) normal.flip();

	return new RayHit( point, normal, line.material );
}

Line.prototype.draw = function( context ) {
	context.beginPath();
	context.moveTo( this.p1.x, this.p1.y );	
	context.lineTo( this.p2.x, this.p2.y );
	context.stroke();
}
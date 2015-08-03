define( [], function() {

var RayHit = function( point, normal, material ) {
	this.point = point;
	this.normal = normal;
	this.material = material;
}

RayHit.prototype.reflect = function( incidentVector ) {
	var incident = incidentVector.copy(); // Copy the incident vector so we don't overwrite the input

	incident.normalize().flip();
	var cosine = this.normal.times( incident.dot( this.normal ) );
	return cosine.plus( cosine.minus( incident ) );
}

return RayHit;

});
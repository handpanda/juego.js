define( ["juego/Level", "juego/Shape", "juego/Line", "juego/mouse"], function( Level, Shape, Line, mouse ) {

var r = Math.random;

var ThreeTest = function( viewport ) {
	this.level = new Level();
	this.line = new Line();

	this.renderer = new THREE.CanvasRenderer( { canvas: viewport })

	this.scene = new THREE.Scene;
	this.camera = new THREE.PerspectiveCamera( 35, 1, 1, 1000 );

	ball_geometry = new THREE.SphereGeometry( 3 );
	ball_material = new THREE.MeshLambertMaterial({ color: 0x0000ff, overdraw: true });

	this.renderer.setSize( viewport.clientWidth, viewport.clientHeight );

	this.camera.position.set( 0, -400, 0 );
	this.camera.lookAt( this.scene.position );
	//this.camera.rotation.y += 
	this.scene.add( this.camera );

    var ambientLight = new THREE.AmbientLight( 0x555555 );
    this.scene.add( ambientLight );

    var directionalLight = new THREE.DirectionalLight( 0xffffff );
    directionalLight.position.set( -.5, 3, -1.5 ).normalize();
    this.scene.add( directionalLight );

	
   var material_red = new THREE.MeshLambertMaterial({ color: 0xdd0000, overdraw: true }),
        material_green = new THREE.MeshLambertMaterial({ color: 0x00bb00, overdraw: true });
 
    
    for ( var i = 0; i < 10; i++ ) this.addBlock();
 
    // Create the floor
    this.floor = new THREE.Mesh( new THREE.PlaneGeometry( 100, 100 ), material_red );
    this.scene.add( this.floor );
}

ThreeTest.prototype.addBlock = function() {
	var w = r()*50, h = r()*50;

	var block_geometry = new THREE.CubeGeometry( w, 20, h );

	var block = new THREE.Mesh( block_geometry, new THREE.MeshLambertMaterial({ color: 0xdd0000, overdraw: true }) );
	block.position.x = r() * 200 - 100;
	block.position.z = r() * 200 - 100;
	this.scene.add( block );	

	this.level.shapes.push( new Shape().Rectangle( block.position.x, block.position.z, w, h ) );
}

ThreeTest.prototype.update = function( canvas, context ) {

	var offset = new Vec2( canvas.width /2, canvas.height / 2 );

	var projector = new THREE.Projector();

	this.line.p1.set( mouse.start.minus( offset ) );
	this.line.p2.set( mouse.pos.minus( offset ) );

	var vector = new THREE.Vector3( 0, 0, 0.5 );/*( 
        mouse.pos.x / canvas.width ) * 2 - 1, 
        - ( mouse.pos.y / canvas.height ) * 2 + 1, 
        0.5 
    );*/

    projector.unprojectVector( vector, this.camera );

    //var ray = new THREE.Raycaster( this.camera.position, vector.sub( this.camera.position ).normalize() );

   // var intersects = ray.intersectObjects( [floor] );

    var ray = new THREE.Ray(this.camera.position, vector.sub(this.camera.position).normalize());
	var intersects = ray.isIntersectionPlane( this.floor );

    if ( intersects.length > 0 ) {

        console.log( intersects[ 0 ].point );

    }

	this.renderer.render( this.scene, this.camera );

	context.save();

	context.translate( canvas.width / 2, canvas.height / 2 );

	context.strokeStyle = "red";
	context.lineWidth = 2;

	this.line.draw( context );

	for ( s in this.level.shapes ) {
		this.level.shapes[s].draw( context );
	}

	context.restore();

	mouse.updateState( canvas );
}						

return ThreeTest;

});
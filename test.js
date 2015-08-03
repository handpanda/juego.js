require.config({
    baseUrl: "",
    paths: {
        // the left side is the module ID,
        // the right side is the path to
        // the jQuery file, relative to baseUrl.
        // Also, the path should NOT include
        // the '.js' file extension. This example
        // is using jQuery 1.9.0 located at
        // js/lib/jquery-1.9.0.js, relative to
        // the HTML page.
        jquery: "jquery-1.10.2.min",
        juego: ".",
    }
});

require([ "jquery" ], function( $ ) {
	var canvas, context;
	
	var test = null;			

	var testDir = "./test";

	var loadTest = function( testName ) {
		require( [ testDir + "/" + testName ], function( val ) {
			test = new val( canvas );
		});
	}

	// Load a test when the select value is changed
	$( "#selectTest" ).change( function() {
		console.log( $( this ).val() );
		loadTest( $( this ).val() );
	});

	// Read the contents of the tests directory
	$.ajax({
		type: "POST",
		url: "scandir.php",

		data: { dirname: testDir },
		success: function( filedata ) {

			var testFiles = filedata.split( "\n" );
			console.log( "Loaded tests: " );
			console.log( testFiles );
		
			for ( t in testFiles ) {
				// Populate a dropdown list with tests
				var option = document.createElement( "option" );
				option.text = testFiles[t];
				$( "#selectTest" ).append( option );

			}

			// Run the default test automatically
			if ( defaultTestName != "" ) loadTest( defaultTestName );
			else if ( testFiles.length > 0 ) loadTest( testFiles[0] );
		}	
	});	

	// Get a drawing context from the page
	canvas = document.getElementById( "screen" );
	context = canvas.getContext( "2d" );

	setInterval( update, 60 );											

	function update() {
		if ( test != null ) test.update( canvas, context );
	}
});
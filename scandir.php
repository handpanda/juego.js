<?php
	$dirname = $_POST[ "dirname" ];
	$files = scandir( $dirname ) or error("Unable to scan directory " . $dirname );
	$first = TRUE;

	foreach ( $files as $filename ) {
		if ( strcmp( ".", substr( $filename, 0, 1 ) ) != 0 ) {
			if ( !$first ) echo "\n";
			echo $filename;
			$first = FALSE;
		}
	}
?>
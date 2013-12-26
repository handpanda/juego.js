<html>
	<title>Entity Testbed</title>

	<script type="text/javascript">
		var defaultTestName = "";
	</script>

	<script type="text/javascript" src="lib/THREE.min.js"></script>

	<?php
		error_reporting( E_ERROR );

		$defaultTestName = $_GET[ "runtest" ];
		if ( $defaultTestName ) {
			echo "<script type=\"text/javascript\">";
			echo "var defaultTestName = \"" . $defaultTestName . "\";";
			echo "</script>";
		}
	?>

	<head>
		<script data-main="test" src="require.js"></script>		
	</head>

	<body>
		<select id="selectTest">
		</select>
		<canvas id="screen" width="640" height="480"></canvas>
		<canvas id="screen2" width="640" height="480"></canvas>
	</body>
</html>`
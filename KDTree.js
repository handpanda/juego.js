/*
 * list is what you are trying to make a kd tree out of
 * dimensions is how many dimensions you are comparing on, must be 1 or more
 * comparators is a list of comparators to compare the objects in list for each dimension
 */

var kdTree = function( list, dimensions, comparators ) {
	this.root = new kdNode( list, dimensions, comparators, 0 );
}

kdTree.prototype.print = function() {
	if ( this.root != null ) this.root.print();
}

var comp = function( a, b ) { return a - b; }

/*
 * depth is how deep in the tree the node is (how far from the root), the root is depth 0
 */

var kdNode = function( list, dimensions, comparators, depth ) {
	this.list = list;
	this.left = null;
	this.object = null;
	this.right = null;
	this.depth = depth;
	
	if ( this.list.length == 0 ) { // List is empty

	} else if ( this.list.length == 1 ) { // List is a single element
		this.isLeaf = true; // We are a leaf node (no children)
		this.object = this.list[0];
	} else { // List has more than one element
		var medianIndex; // The object for which the number of objects above and below it are equal or almost equal
		
		this.isLeaf = false; // We are not a leaf node (at least one child)
		this.list.sort( comparators[ depth % dimensions ] ); // Sort the list based on the comparator we're using
		
		if ( this.list.length % 2 ) { // Length of list is odd
			medianIndex = this.list.length / 2 - 0.5;
		} else { // Length of list is eo	ven
			medianIndex = this.list.length / 2;
		}
		
		this.right = new kdNode( this.list.slice( medianIndex + 1 ), dimensions, comparators, depth + 1 ); // Elements above the median
		this.object = this.list.slice( medianIndex, medianIndex + 1 )[0]; // The median
		this.left = new kdNode( this.list.slice( 0, medianIndex ), dimensions, comparators, depth + 1 ); // Elements below the median
	}
}

kdNode.prototype.print = function() {
	if ( this.object == null ) console.log( "X" );
	else console.log( this.object );
	
	if ( this.isLeaf ) console.log( "-" );
	
	if ( this.left != null ) {
		this.left.print();
	}
	if ( this.right != null ) {
		this.right.print();
	}
}


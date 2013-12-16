/*
 * A kd-tree
 * 
 * ...which is a TREE made from a list of objects. For any NODE in the tree, all of its LEFT
 * CHILDREN (its left child and all nodes below it) are "less" than the center node in some quality,
 * and all of its RIGHT CHILDREN (its right child and all nodes below it) are "greater" than the center
 * node in that quality. Each sub-tree in the kd-tree is also a kd-tree
 * 
 * list is what you are trying to make a kd tree out of
 * dimensions is how many dimensions you are comparing on, must be 1 or more
 * comparators is a list of comparators to compare the objects in list for each dimension
 */

var KDTree = function( list, dimensions, comparators ) {
	this.root = new KDNode( this, list, dimensions, comparators, 0 );
}

/*
 * print
 * 
 * prints out the tree in a semi-readable format
 */
KDTree.prototype.print = function() {
	if ( this.root != null ) this.root.print();
}

/*
 * draw
 * 
 * draws the tree, assuming every node's object has a variable named "pos" that is its position
 */
KDTree.prototype.draw = function( context, func ) {
	context.lineWidth = 10;	
		
	if ( this.root != null ) {
		this.root.draw( context, func );
		context.lineWidth = 20;
		context.beginPath();
		context.arc( this.root.object.center.x, this.root.object.center.y, 50, 0, Math.PI * 2, false );
		context.stroke();				
	}
}

KDTree.prototype.overlaps = function( entity ) {	
	if ( this.root != null ) {
		 return this.root.overlaps( entity );
	} else return false;
}

KDTree.prototype.isContainedBy = function( entity, mark ) {
	this.mark = mark;
	this.occluder = null;
	this.distance = -1;
	
	if ( this.root != null ) {
		 return this.root.isContainedBy( entity );
	} else return false;
}

var comp = function( a, b ) { return a - b; }

/*
 * KDNode
 * 
 * a node in a kd-tree
 * 
 * depth is how deep in the tree the node is (how far from the root), the root is depth 0
 */
var KDNode = function( tree, list, dimensions, comparators, depth ) {
	this.tree = tree;
	this.list = list;
	this.left = null;
	this.object = null;
	this.right = null;
	this.depth = depth;
	this.tested = false;
	
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
		} else { // Length of list is even
			medianIndex = this.list.length / 2;
		}
		
		this.right = new KDNode( this.tree, this.list.slice( medianIndex + 1 ), dimensions, comparators, depth + 1 ); // Elements above the median
		this.object = this.list.slice( medianIndex, medianIndex + 1 )[0]; // The median
		this.left = new KDNode( this.tree, this.list.slice( 0, medianIndex ), dimensions, comparators, depth + 1 ); // Elements below the median
	}
}

/*
 * print
 * 
 * Prints out the tree onto the console in a semi-readable format.
 * Prints out center-left-right
 */
KDNode.prototype.print = function() {
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

KDNode.prototype.overlaps = function( entity ) {
	// Empty node
	if ( this.object == null ) return false;
	
	// Non-empty
	if ( this.depth % 2 ) { // Y-split
		this.tested = true;
		
		if ( entity.bottom < this.object.top ) {
			if ( this.left != null ) {
				return this.left.overlaps( entity );
			}	
		} else if ( entity.top > this.object.bottom ) {
			if ( this.right != null ) {
				return this.right.overlaps( entity );
			}
		} else {
			return this.object.overlaps( entity ) ||
				   ( this.left != null && this.left.overlaps( entity )) ||
				   ( this.right != null && this.right.overlaps( entity ));
		}
	} else { // X-split
		this.tested = true;
		
		if ( entity.right < this.object.left ) {
			if ( this.left != null ) {
				return this.left.overlaps( entity );
			}	
		} else if ( entity.left > this.object.right ) {
			if ( this.right != null ) {
				return this.right.overlaps( entity );
			}
		} else {
			return this.object.overlaps( entity ) ||
				   ( this.left != null && this.left.overlaps( entity )) ||
				   ( this.right != null && this.right.overlaps( entity ));
		}		
	} 
}

KDNode.prototype.isContainedBy = function( entity ) {
	// Empty node
	if ( this.object == null ) return false;

	// Non-empty
	if ( this.depth % 2 ) { // Y-split
		if ( this.tree.mark ) this.tested = true;
		
	//	var result = entity.vBound( this.object.center );
		
		if ( entity.maxBottom < this.object.center.y ) { // To the top
			if ( this.left != null ) {
				return this.left.isContainedBy( entity );
			}
		} else if ( entity.maxTop > this.object.center.y ) { // To the bottom
			if ( this.right != null ) {
				return this.right.isContainedBy( entity );
			}
		} else { // Uncertain
			var result = entity.containsPoint( this.object.center );
			
			if ( result ) {
				var dist = this.object.center.distanceTo( entity.fromPos );
				
				if ( this.tree.occluder == null || dist < this.tree.distance ) {
					this.tree.occluder = this.object;	
					this.tree.distance = dist;
				}
			}
			
			return result ||
				   ( this.left != null && this.left.isContainedBy( entity )) ||
				   ( this.right != null && this.right.isContainedBy( entity ));
		}	
	} else { // X-split
		if ( this.tree.mark ) this.tested = true;
		
	//	var result = entity.hBound( this.object.center );
		
		if ( entity.maxRight < this.object.center.x ) { // To the left
			if ( this.left != null ) {
				return this.left.isContainedBy( entity );
			}
		} else if ( entity.maxLeft > this.object.center.x ) { // To the right
			if ( this.right != null ) {
				return this.right.isContainedBy( entity );
			}
		} else { // Uncertain
			var result = entity.containsPoint( this.object.center );
			
			if ( result ) {
				var dist = this.object.center.distanceTo( entity.fromPos );
				
				if ( this.tree.occluder == null || dist < this.tree.distance ) {
					this.tree.occluder = this.object;	
					this.tree.distance = dist;
				}
			}
			
			return result ||
				   ( this.left != null && this.left.isContainedBy( entity )) ||
				   ( this.right != null && this.right.isContainedBy( entity ));
		}		
	} 
}

/*
 * draw
 * 
 * draws a node and each of its sub-nodes. Doesn't draw anything at the nodes, just lines in between.
 */
KDNode.prototype.draw = function( context, func ) {
	if ( this.object != null ) {
		this.drawLinesToChildren( context, func );
		if ( this.left != null ) this.left.draw( context, func );
		if ( this.right != null ) this.right.draw( context, func );
	}
}

/*
 * drawLinesToChildren
 * 
 * draw a line to each of the node's children
 */
KDNode.prototype.drawLinesToChildren = function( context, func ) {
	context.strokeStyle = 'black';
	if ( this.depth % 2 ) context.strokeStyle = 'yellow';
	
	if ( this.object != null ) {
		if ( this.left != null && this.left.object != null && func( this.left ) ) {
			context.beginPath();
			context.moveTo( this.object.center.x, this.object.center.y );
			context.lineTo( this.left.object.center.x, this.left.object.center.y );
			context.stroke();
		}
		
		if ( this.right != null && this.right.object != null && func( this.right ) ) {
			context.beginPath();
			context.moveTo( this.object.center.x, this.object.center.y );
			context.lineTo( this.right.object.center.x, this.right.object.center.y );
			context.stroke();				
		} 
	}
}

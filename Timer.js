/*
	Timer

		Calls a function at intervals

		Three parameters:

			interval: how many cycles between function calls
			variance: how much the number of cycles between function can vary
			callback: the function to call

		EXAMPLE

*/
var Timer = function( interval, variance, callback ) {
	this.interval = interval;
	this.variance = variance;
	this.callback = callback;
	this.clock = this.getNextInterval();
}

Timer.prototype.update = function() {
	this.clock--;

	if ( this.clock <= 0 ) {
		this.clock = this.getNextInterval();

		this.callback();
	}
}

Timer.prototype.getNextInterval = function() {
	return this.interval + ( Math.random() * 0.5 - 1 ) * this.variance; 
}

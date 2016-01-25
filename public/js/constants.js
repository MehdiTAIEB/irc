(function() {
	angular
		.module('irc')
		.constant('socket', io.connect())
})();

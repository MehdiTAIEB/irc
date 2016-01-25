(function () {
	angular
		.module('irc')
		.service('WebSocketService', WebSocketService);

		function WebSocketService () {
			var service = {
				init: init
			};
			return service;

			function init () {
				return io.connect();
			}
		}
})();

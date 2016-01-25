(function () {
	angular
		.module('irc')
		.service('WebSocketService', WebSocketService);

		function WebSocketService () {
			var service = {
				init: init
			};

			function init () {
				return "service ok";
			}
		}
})();

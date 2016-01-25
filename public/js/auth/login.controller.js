(function () {
	angular
		.module('irc')
		.controller('LoginController', LoginController);

		LoginController.$inject = ['WebSocketService'];

		function LoginController(WebSocketService) {
			var vm = this;
			vm.socket = io.connect();
			vm.login = login;

			function login () {
				WebSocketService.init();
				vm.socket.emit('login', { name: vm.mainName });
			};
		}
})();

(function () {
	angular
		.module('irc')
		.controller('LoginController', LoginController);

		LoginController.$inject = ['$location', 'WebSocketService'];

		function LoginController($location, WebSocketService) {
			var vm = this;
			vm.socket = io.connect();
			vm.login = login;
			console.log(WebSocketService);


			function login () {
				vm.test = WebSocketService.init();
				console.log(vm.test);
				vm.socket.emit('login', { name: vm.mainName });
			};
		}
})();

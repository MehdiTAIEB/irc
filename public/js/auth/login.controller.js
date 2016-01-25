(function () {
	angular
		.module('irc')
		.controller('LoginController', LoginController);

		LoginController.$inject = ['$location', 'WebSocketService'];

		function LoginController($location, WebSocketService) {
			var vm = this;
			vm.socket = WebSocketService.init();
			vm.login = login;

			function login () {
				vm.socket.emit('login', { name: vm.mainName });
				vm.socket.on('setAuth', function (data) {
					console.log(data.name);
				});
				$location.path('/lol');
			};
		}
})();

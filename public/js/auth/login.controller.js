(function () {
	angular
		.module('irc')
		.controller('LoginController', LoginController);

		function LoginController() {
			var vm = this;
			vm.socket = io.connect();
			vm.loggedIn = false;
			vm.login = login;

			function login () {
				vm.loggedIn = true;
				vm.socket.emit('login', { name: vm.mainName });
			};
		}
})();

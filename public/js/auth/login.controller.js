(function () {
	angular
		.module('irc')
		.controller('LoginController', LoginController);

		function LoginController() {
			var vm = this;
			vm.socket = io.connect();
			vm.login = login;

			function login () {
				console.log('asd');
				vm.socket.emit('login', { name: vm.mainName });
			};
		}
})();

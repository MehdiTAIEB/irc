(function () {
	angular
		.module('irc')
		.controller('LoginController', LoginController);

		LoginController.$inject = ['$location', 'socket'];

		function LoginController($location, socket) {
			var vm = this;
			vm.socket = socket;
			vm.login = login;
			
			function login () {
				vm.socket.emit('login', { name: vm.mainName });
				$location.path('/dash');
			};
		}
})();

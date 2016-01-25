(function () {
	angular
		.module('irc')
		.controller('LoginController', LoginController);

		LoginController.$inject = ['$location', 'socket'];

		function LoginController($location, socket) {
			var vm = this;
			vm.socket = socket;
			vm.login = login;
			console.log(vm.socket);
			function login () {
				vm.socket.emit('login', { name: vm.mainName });
				vm.socket.on('setAuth', function (data) {
					console.log(data.name);
				});
				console.log(vm.socket);
				$location.path('/dash');
			};
		}
})();

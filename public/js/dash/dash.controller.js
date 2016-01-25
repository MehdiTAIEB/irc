(function () {
	angular
		.module('irc')
		.controller('DashController', DashController);

		function DashController() {
			var vm = this;
			vm.socket = io.connect();

			vm.socket.on('setAuth', function (data) { // does work on login controller maybe allias?
				console.log(data.name);
				console.log('asda');
			});
		}
})();

(function () {
	angular
		.module('irc')
		.controller('DashController', DashController);

		DashController.$inject = ['$location', 'socket'];

		function DashController($location, socket) {
			var vm = this;
			vm.socket = socket;

			console.log(vm.socket);
		}
})();

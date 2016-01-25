(function () {
	angular
		.module('irc')
		.controller('DashController', DashController);

		DashController.$inject = ['$location', 'socket'];

		function DashController($location, socket) {
			var vm = this;
			vm.socket = socket;
			$(".chat").niceScroll();
			console.log(vm.socket);
		}
})();

(function () {
	angular
		.module('irc')
		.controller('DashController', DashController);

		DashController.$inject = ['$location', 'socket'];

		function DashController($location, socket) {
			var vm = this;
			vm.socket = socket;
			vm.socket.emit('getId', {});
			vm.socket.on('id', function (data) {
				vm.mainName = data.id;
			});
			$(".chat").niceScroll();
		}
})();
